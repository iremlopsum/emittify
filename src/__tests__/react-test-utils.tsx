/**
 * React-specific test utilities for emittify
 */

import React from 'react'
import { render, RenderResult, waitFor } from '@testing-library/react'

import ReactEmitter from '../react/index'

/**
 * Creates a test component that uses useEventListener hook
 */
export function createTestComponent<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
  K extends keyof EventsType,
>(emitter: ReactEmitter<EventsType>, eventKey: K, fallbackValue: EventsType[K], testId: string = 'value') {
  return function TestComponent() {
    const value = emitter.useEventListener(eventKey, fallbackValue)
    return <div data-testid={testId}>{String(value)}</div>
  }
}

/**
 * Helper to render a component and get the text content of a test element
 */
export function renderAndGetText(
  Component: React.ComponentType,
  testId: string = 'value',
): { container: RenderResult; getText: () => string } {
  const container = render(<Component />)

  return {
    container,
    getText: () => container.getByTestId(testId).textContent || '',
  }
}

/**
 * Helper to test hook updates
 */
export async function testHookUpdate<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
  K extends keyof EventsType,
>(
  emitter: ReactEmitter<EventsType>,
  eventKey: K,
  initialValue: EventsType[K],
  newValue: EventsType[K],
  testId: string = 'value',
) {
  const TestComponent = createTestComponent(emitter, eventKey, initialValue, testId)
  const { container, getText } = renderAndGetText(TestComponent, testId)

  // Check initial value
  expect(getText()).toBe(String(initialValue))

  // Send new value
  emitter.send(eventKey, newValue)

  // Wait for update
  await waitFor(() => {
    expect(getText()).toBe(String(newValue))
  })

  return container
}

/**
 * Helper to test multiple components using the same hook
 */
export function renderMultipleComponents<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
  K extends keyof EventsType,
>(emitter: ReactEmitter<EventsType>, eventKey: K, fallbackValue: EventsType[K], count: number) {
  const components = Array.from({ length: count }, (_, i) =>
    createTestComponent(emitter, eventKey, fallbackValue, `value-${i}`),
  )

  const container = render(
    <>
      {components.map((Component, i) => (
        <Component key={i} />
      ))}
    </>,
  )

  return {
    container,
    getTextByIndex: (index: number) => container.getByTestId(`value-${index}`).textContent || '',
  }
}

/**
 * Helper to test component lifecycle with emitter
 */
export async function testComponentLifecycle<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
  K extends keyof EventsType,
>(emitter: ReactEmitter<EventsType>, eventKey: K, fallbackValue: EventsType[K], testValue: EventsType[K]) {
  const TestComponent = createTestComponent(emitter, eventKey, fallbackValue)
  const { container, getText } = renderAndGetText(TestComponent)

  // Check initial render
  expect(getText()).toBe(String(fallbackValue))

  // Update value
  emitter.send(eventKey, testValue)
  await waitFor(() => {
    expect(getText()).toBe(String(testValue))
  })

  // Unmount
  container.unmount()

  // Send another event - should not cause issues
  emitter.send(eventKey, fallbackValue)

  return container
}

/**
 * Helper to create a counter component (common test pattern)
 */
export function createCounterComponent<EventsType extends Record<keyof EventsType, number>>(
  emitter: ReactEmitter<EventsType>,
  eventKey: keyof EventsType,
) {
  return function CounterComponent() {
    const count = emitter.useEventListener(eventKey, 0 as EventsType[keyof EventsType])

    return (
      <div>
        <div data-testid="count">{count}</div>
        <button
          data-testid="increment"
          onClick={() => emitter.send(eventKey, (count + 1) as EventsType[keyof EventsType])}>
          Increment
        </button>
        <button
          data-testid="decrement"
          onClick={() => emitter.send(eventKey, (count - 1) as EventsType[keyof EventsType])}>
          Decrement
        </button>
        <button data-testid="reset" onClick={() => emitter.send(eventKey, 0 as EventsType[keyof EventsType])}>
          Reset
        </button>
      </div>
    )
  }
}

/**
 * Helper to create a message display component
 */
export function createMessageComponent<EventsType extends Record<keyof EventsType, string>>(
  emitter: ReactEmitter<EventsType>,
  eventKey: keyof EventsType,
  defaultMessage: string = '',
) {
  return function MessageComponent() {
    const message = emitter.useEventListener(eventKey, defaultMessage as EventsType[keyof EventsType])

    return (
      <div>
        <div data-testid="message">{message}</div>
        <button
          data-testid="update"
          onClick={() => emitter.send(eventKey, `Updated at ${Date.now()}` as EventsType[keyof EventsType])}>
          Update
        </button>
      </div>
    )
  }
}

/**
 * Helper to verify that a component updates correctly
 */
export async function verifyComponentUpdates<T>(getText: () => string, expectedValues: T[]) {
  for (const expectedValue of expectedValues) {
    await waitFor(() => {
      expect(getText()).toBe(String(expectedValue))
    })
  }
}

/**
 * Helper to test cached value restoration
 */
export async function testCachedValueRestoration<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
  K extends keyof EventsType,
>(emitter: ReactEmitter<EventsType>, eventKey: K, cachedValue: EventsType[K], fallbackValue: EventsType[K]) {
  // Send value to cache it
  emitter.send(eventKey, cachedValue)

  // Render component - should get cached value
  const TestComponent = createTestComponent(emitter, eventKey, fallbackValue)
  const { getText } = renderAndGetText(TestComponent)

  expect(getText()).toBe(String(cachedValue))
}

/**
 * Helper for testing memory leaks
 */
export function createMemoryLeakTest<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
  K extends keyof EventsType,
>(emitter: ReactEmitter<EventsType>, eventKey: K, fallbackValue: EventsType[K], cycles: number = 10) {
  const TestComponent = createTestComponent(emitter, eventKey, fallbackValue)

  for (let i = 0; i < cycles; i++) {
    const { unmount } = render(<TestComponent />)
    unmount()
  }

  return {
    cycles,
    emitter,
  }
}

/**
 * Custom render with wrapper for providers if needed
 */
export function renderWithWrapper(
  ui: React.ReactElement,
  wrapper?: React.ComponentType<{ children: React.ReactNode }>,
) {
  return render(ui, { wrapper })
}

/**
 * Helper to wait for async updates
 */
export async function waitForAsyncUpdates() {
  await waitFor(() => {}, { timeout: 1000 })
}
