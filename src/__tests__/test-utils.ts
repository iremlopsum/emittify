/**
 * Test utilities and helper functions for emittify tests
 */

import Emitter from '../index'

/**
 * Creates a test emitter with a predefined event type structure
 */
export function createTestEmitter<T extends Record<keyof T, T[keyof T]>>(
  options?: { cachedEvents?: (keyof T)[] }
) {
  return new Emitter<T>(options)
}

/**
 * Creates a mock callback that can be used with emitter.listen()
 */
export function createMockCallback<T = any>() {
  return jest.fn<void, [T]>()
}

/**
 * Helper to wait for next tick in the event loop
 */
export function waitForNextTick() {
  return new Promise(resolve => setImmediate(resolve))
}

/**
 * Helper to wait for a specific amount of time
 */
export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Creates multiple listeners for testing
 */
export function createMultipleListeners<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
  K extends keyof EventsType
>(
  emitter: Emitter<EventsType>,
  eventKey: K,
  count: number
) {
  const callbacks = Array.from({ length: count }, () => createMockCallback<EventsType[K]>())
  const listeners = callbacks.map(callback => emitter.listen(eventKey, callback))
  
  return { callbacks, listeners }
}

/**
 * Helper to test if a callback was called with specific arguments
 */
export function expectCallbackCalledWith<T>(
  callback: jest.Mock,
  expectedValue: T,
  times: number = 1
) {
  expect(callback).toHaveBeenCalledTimes(times)
  expect(callback).toHaveBeenCalledWith(expectedValue)
}

/**
 * Helper to create a stress test scenario with many events and listeners
 */
export function createStressTestScenario<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
  K extends keyof EventsType
>(
  emitter: Emitter<EventsType>,
  eventKey: K,
  listenerCount: number,
  eventCount: number,
  getValue: (index: number) => EventsType[K]
) {
  const { callbacks, listeners } = createMultipleListeners(emitter, eventKey, listenerCount)
  
  for (let i = 0; i < eventCount; i++) {
    emitter.send(eventKey, getValue(i))
  }
  
  return { callbacks, listeners }
}

/**
 * Helper to verify all callbacks in an array were called
 */
export function expectAllCallbacksCalled(callbacks: jest.Mock[], times: number = 1) {
  callbacks.forEach(callback => {
    expect(callback).toHaveBeenCalledTimes(times)
  })
}

/**
 * Helper to verify no callbacks in an array were called
 */
export function expectNoCallbacksCalled(callbacks: jest.Mock[]) {
  callbacks.forEach(callback => {
    expect(callback).not.toHaveBeenCalled()
  })
}

/**
 * Creates a test emitter with common event types for testing
 */
export function createCommonTestEmitter() {
  interface CommonEvents {
    'string-event': string
    'number-event': number
    'boolean-event': boolean
    'object-event': { id: number; value: string }
    'array-event': number[]
  }
  
  return new Emitter<CommonEvents>()
}

/**
 * Helper to test cache behavior
 */
export function testCacheBehavior<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
  K extends keyof EventsType
>(
  emitter: Emitter<EventsType>,
  eventKey: K,
  value: EventsType[K],
  fallbackValue?: EventsType[K]
) {
  // Should return fallback before sending
  if (fallbackValue !== undefined) {
    expect(emitter.getCache(eventKey, fallbackValue)).toEqual(fallbackValue)
  } else {
    expect(emitter.getCache(eventKey)).toBeUndefined()
  }
  
  // Send event
  emitter.send(eventKey, value)
  
  // Should return cached value
  expect(emitter.getCache(eventKey, fallbackValue)).toEqual(value)
  
  // Clear cache
  emitter.clearCache(eventKey)
  
  // Should return fallback again
  if (fallbackValue !== undefined) {
    expect(emitter.getCache(eventKey, fallbackValue)).toEqual(fallbackValue)
  } else {
    expect(emitter.getCache(eventKey)).toBeUndefined()
  }
}

/**
 * Helper to test listener lifecycle
 */
export function testListenerLifecycle<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
  K extends keyof EventsType
>(
  emitter: Emitter<EventsType>,
  eventKey: K,
  testValue: EventsType[K]
) {
  const callback = createMockCallback<EventsType[K]>()
  
  // Register listener
  const listener = emitter.listen(eventKey, callback)
  
  // Verify listener object
  expect(listener).toHaveProperty('id')
  expect(listener).toHaveProperty('event')
  expect(listener).toHaveProperty('clearListener')
  expect(listener.event).toBe(eventKey)
  expect(typeof listener.id).toBe('string')
  expect(typeof listener.clearListener).toBe('function')
  
  // Test callback is called
  emitter.send(eventKey, testValue)
  expectCallbackCalledWith(callback, testValue, 1)
  
  // Clear listener
  listener.clearListener()
  
  // Verify callback is not called after clearing
  emitter.send(eventKey, testValue)
  expect(callback).toHaveBeenCalledTimes(1) // Still 1, not 2
  
  return listener
}

/**
 * Helper to measure execution time (for performance tests)
 */
export async function measureExecutionTime(fn: () => void | Promise<void>): Promise<number> {
  const start = performance.now()
  await fn()
  const end = performance.now()
  return end - start
}

/**
 * Helper to generate random event values for testing
 */
export const testDataGenerators = {
  randomString: () => Math.random().toString(36).substring(7),
  randomNumber: () => Math.floor(Math.random() * 1000),
  randomBoolean: () => Math.random() > 0.5,
  randomObject: () => ({
    id: Math.floor(Math.random() * 1000),
    value: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
  }),
  randomArray: (length: number = 10) =>
    Array.from({ length }, () => Math.floor(Math.random() * 100)),
}

/**
 * Type guard to check if a value is a listener object
 */
export function isListener<T>(
  value: any
): value is { id: string; event: T; clearListener: () => void } {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.clearListener === 'function' &&
    'event' in value
  )
}

