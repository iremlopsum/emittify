import { useCallback, useRef, useSyncExternalStore } from 'react'

import BaseEmitter from '../index.js'

class Emitter<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
> extends BaseEmitter<EventsType> {
  /**
   * Subscribes to an event and returns its latest value. Starts from the cached value, and falls back to
   * `fallbackValue` when nothing (or `undefined`) has been received.
   */
  useEventListener: {
    <K extends keyof EventsType>(key: K): EventsType[K] | undefined
    <K extends keyof EventsType>(key: K, fallbackValue: EventsType[K]): EventsType[K]
  } = <K extends keyof EventsType>(key: K, fallbackValue?: EventsType[K]) => {
    // Last value this hook's subscription received, tagged with its key so a key change never shows a stale value.
    // Needed for events that are not cached, which have no store to read from.
    const latest = useRef<{ key: K; value: EventsType[K] } | undefined>(undefined)

    const subscribe = useCallback(
      (onStoreChange: () => void) => {
        // A key change behaves like a fresh mount, so drop what was received for the previous key
        if (latest.current?.key !== key) latest.current = undefined

        return this.listen(key, value => {
          latest.current = { key, value }
          onStoreChange()
        }).clearListener
      },
      [key],
    )

    const getSnapshot = () => {
      const value = latest.current?.key === key ? latest.current.value : this.getCache(key)

      return (value === undefined ? fallbackValue : value) as EventsType[K]
    }

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  }
}

export default Emitter
