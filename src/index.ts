export type Comparison = 'deep' | 'shallow'

export interface DeduplicationConfig<K> {
  event: K
  comparison: Comparison
}

export interface OptionsType<EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>> {
  cachedEvents?: (keyof EventsType)[]
  deduplicatedEvents?: DeduplicationConfig<keyof EventsType>[]
}

export interface Listener<K> {
  event: K
  clearListener: () => void
}

type Callback = (params: any) => void

const hasOwn = (object: object, key: PropertyKey) => Object.prototype.hasOwnProperty.call(object, key)

/**
 * Only checks first level properties, not nested objects
 */
const shallowEqual = (a: any, b: any): boolean => {
  if (a === b) return true
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false

  const keys = Object.keys(a)

  return keys.length === Object.keys(b).length && keys.every(key => hasOwn(b, key) && a[key] === b[key])
}

/**
 * Structural equality for plain objects, arrays, Maps, Sets, Dates and RegExps. NaN equals NaN, and objects
 * with a custom valueOf/toString (Date, URL, ...) are compared by its result, as in fast-deep-equal.
 */
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return a !== a && b !== b
  if (a.constructor !== b.constructor) return false

  if (Array.isArray(a)) return a.length === b.length && a.every((value, i) => deepEqual(value, b[i]))

  if (a instanceof Map) {
    if (a.size !== b.size) return false
    for (const [key, value] of a) if (!b.has(key) || !deepEqual(value, b.get(key))) return false
    return true
  }

  if (a instanceof Set) {
    if (a.size !== b.size) return false
    for (const value of a) if (!b.has(value)) return false
    return true
  }

  if (a instanceof RegExp) return a.source === b.source && a.flags === b.flags

  // Class instances such as Date or URL: compare by a meaningful valueOf/toString. Checks the returned values
  // rather than the functions, so it also works for objects from another realm (iframes, jsdom).
  const proto = Object.getPrototypeOf(a)

  if (proto && proto !== Object.prototype) {
    const value = a.valueOf?.()
    if (value !== a) return value === b.valueOf()

    const string = a.toString?.()
    if (typeof string === 'string' && !string.startsWith('[object ')) return string === b.toString()
  }

  const keys = Object.keys(a)

  return keys.length === Object.keys(b).length && keys.every(key => hasOwn(b, key) && deepEqual(a[key], b[key]))
}

class Emitter<EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>> {
  /**
   * Active callbacks per event. Each registration gets its own entry, so the same function can be registered
   * more than once and each registration is cleared independently.
   */
  private listeners = new Map<keyof EventsType, Set<{ callback: Callback }>>()

  private cachedEvents: Set<keyof EventsType>

  private cachedMessages = new Map<keyof EventsType, unknown>()

  /**
   * Previous values for deduplicated events, compared against the next send to skip redundant emissions
   */
  private previousValues = new Map<keyof EventsType, unknown>()

  private deduplicationConfig: Map<keyof EventsType, Comparison>

  constructor(options: OptionsType<EventsType> = {}) {
    this.cachedEvents = new Set(options.cachedEvents)
    this.deduplicationConfig = new Map(options.deduplicatedEvents?.map(config => [config.event, config.comparison]))
  }

  send = <K extends keyof EventsType>(key: K, params: EventsType[K]): void => {
    const comparison = this.deduplicationConfig.get(key)

    if (this.cachedEvents.has(key)) {
      this.cachedMessages.set(key, params)
    }

    if (comparison) {
      const isDuplicate =
        this.previousValues.has(key) &&
        (comparison === 'deep' ? deepEqual : shallowEqual)(this.previousValues.get(key), params)

      if (isDuplicate) return

      this.previousValues.set(key, params)
    }

    const subscriptions = this.listeners.get(key)

    if (!subscriptions) return

    // Iterate a snapshot so listeners added during this emit only receive later emits,
    // and skip listeners removed during this emit
    for (const subscription of [...subscriptions]) {
      if (!subscriptions.has(subscription)) continue

      try {
        subscription.callback(params)
      } catch (error) {
        // One failing listener must not stop the others. Re-throw asynchronously so the error still
        // reaches global error handlers (window.onerror, process 'uncaughtException', error trackers)
        queueMicrotask(() => {
          throw error
        })
      }
    }
  }

  listen = <K extends keyof EventsType>(key: K, callback: (params: EventsType[K]) => void): Listener<K> => {
    // A cached `undefined` means "cleared", so it is not replayed. Other falsy values (0, false, '', null) are.
    const cached = this.cachedMessages.get(key) as EventsType[K] | undefined

    if (cached !== undefined) {
      callback(cached)
    }

    const subscription = { callback }
    const subscriptions = this.listeners.get(key) ?? new Set()

    subscriptions.add(subscription)
    this.listeners.set(key, subscriptions)

    return {
      event: key,
      clearListener: () => {
        subscriptions.delete(subscription)

        // Drop the empty set so dynamic event names don't accumulate. Only if it is still the active set,
        // since clearAll() may have replaced it.
        if (!subscriptions.size && this.listeners.get(key) === subscriptions) {
          this.listeners.delete(key)
        }
      },
    }
  }

  /**
   * Returns the cached value, or `fallbackValue` when nothing (or `undefined`) is cached
   */
  getCache: {
    <K extends keyof EventsType>(key: K): EventsType[K] | undefined
    <K extends keyof EventsType>(key: K, fallbackValue: EventsType[K]): EventsType[K]
  } = <K extends keyof EventsType>(key: K, fallbackValue?: EventsType[K]) => {
    const cached = this.cachedMessages.get(key) as EventsType[K] | undefined

    // Overload signatures above give callers the precise type; the implementation returns either branch
    return (cached === undefined ? fallbackValue : cached) as EventsType[K]
  }

  /**
   * Removes all listeners, cached values and deduplication state. Options are kept.
   */
  clearAll = (): void => {
    // Empty each set as well, so an emit that is in progress stops reaching the removed listeners
    this.listeners.forEach(subscriptions => subscriptions.clear())
    this.listeners.clear()
    this.cachedMessages.clear()
    this.previousValues.clear()
  }

  clearCache = <K extends keyof EventsType>(key: K): void => {
    this.cachedMessages.delete(key)
  }

  clearAllCache = (): void => {
    this.cachedMessages.clear()
  }

  /**
   * Clears the previous value for a specific deduplicated event
   * Next send will always emit since there's no previous value to compare
   */
  clearDeduplicationCache = <K extends keyof EventsType>(key: K): void => {
    this.previousValues.delete(key)
  }

  /**
   * Clears all previous values for deduplicated events
   * Next sends will always emit since there are no previous values to compare
   */
  clearAllDeduplicationCache = (): void => {
    this.previousValues.clear()
  }
}

export default Emitter
