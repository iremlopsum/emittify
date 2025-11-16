/// <reference path="../setup.d.ts" />

import * as React from 'react'
import { render } from '@testing-library/react'

import Emitter from '../../react/index'

// Import utilities from testing library
const { waitFor, screen } = require('@testing-library/react')
const { act } = React as any

describe('React Emitter', () => {
  describe('useEventListener() Hook', () => {
    it('should return initial fallback value on mount', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>()

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)
        return <div data-testid="count">{count}</div>
      }

      render(<TestComponent />)

      expect(screen.getByTestId('count')).toHaveTextContent('0')
    })

    it('should return cached value if exists (overrides fallback)', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['counter'] })

      emitter.send('counter', 42)

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)
        return <div data-testid="count">{count}</div>
      }

      render(<TestComponent />)

      expect(screen.getByTestId('count')).toHaveTextContent('42')
    })

    it('should update value when event is sent', async () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>()

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)
        return <div data-testid="count">{count}</div>
      }

      render(<TestComponent />)

      expect(screen.getByTestId('count')).toHaveTextContent('0')

      act(() => {
        emitter.send('counter', 5)
      })

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('5')
      })

      act(() => {
        emitter.send('counter', 10)
      })

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('10')
      })
    })

    it('should update multiple components using same hook', async () => {
      interface Events {
        message: string
      }
      const emitter = new Emitter<Events>()

      const Component1 = () => {
        const message = emitter.useEventListener('message', 'default')
        return <div data-testid="message-1">{message}</div>
      }

      const Component2 = () => {
        const message = emitter.useEventListener('message', 'default')
        return <div data-testid="message-2">{message}</div>
      }

      render(
        <>
          <Component1 />
          <Component2 />
        </>,
      )

      expect(screen.getByTestId('message-1')).toHaveTextContent('default')
      expect(screen.getByTestId('message-2')).toHaveTextContent('default')

      act(() => {
        emitter.send('message', 'updated')
      })

      await waitFor(() => {
        expect(screen.getByTestId('message-1')).toHaveTextContent('updated')
        expect(screen.getByTestId('message-2')).toHaveTextContent('updated')
      })
    })

    it('should clean up listener on unmount', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>()
      const mockCallback = jest.fn()

      // Override the listen method to spy on it
      const originalListen = emitter.listen.bind(emitter)
      const listenSpy = jest.fn((key, callback) => originalListen(key, callback))
      emitter.listen = listenSpy as any

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)
        return <div data-testid="count">{count}</div>
      }

      const { unmount } = render(<TestComponent />)

      expect(listenSpy).toHaveBeenCalledTimes(1)

      const listener = listenSpy.mock.results[0].value
      const clearSpy = jest.spyOn(listener, 'clearListener')

      unmount()

      expect(clearSpy).toHaveBeenCalledTimes(1)
    })

    it('should not trigger updates after unmount', async () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>()
      const renderSpy = jest.fn()

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)
        renderSpy()
        return <div data-testid="count">{count}</div>
      }

      const { unmount } = render(<TestComponent />)

      const initialRenderCount = renderSpy.mock.calls.length

      unmount()

      act(() => {
        emitter.send('counter', 5)
      })

      // Wait a bit to ensure no re-renders happened
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(renderSpy).toHaveBeenCalledTimes(initialRenderCount)
    })

    it('should work with multiple instances in same component', async () => {
      interface Events {
        counter: number
        message: string
      }
      const emitter = new Emitter<Events>()

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)
        const message = emitter.useEventListener('message', 'default')
        return (
          <div>
            <div data-testid="count">{count}</div>
            <div data-testid="message">{message}</div>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('count')).toHaveTextContent('0')
      expect(screen.getByTestId('message')).toHaveTextContent('default')

      act(() => {
        emitter.send('counter', 42)
      })

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('42')
      })

      expect(screen.getByTestId('message')).toHaveTextContent('default')

      act(() => {
        emitter.send('message', 'hello')
      })

      await waitFor(() => {
        expect(screen.getByTestId('message')).toHaveTextContent('hello')
      })

      expect(screen.getByTestId('count')).toHaveTextContent('42')
    })

    it('should work with different event types', async () => {
      interface Events {
        'string-event': string
        'number-event': number
        'boolean-event': boolean
        'object-event': { id: number; name: string }
      }
      const emitter = new Emitter<Events>()

      const TestComponent = () => {
        const stringValue = emitter.useEventListener('string-event', 'default')
        const numberValue = emitter.useEventListener('number-event', 0)
        const booleanValue = emitter.useEventListener('boolean-event', false)
        const objectValue = emitter.useEventListener('object-event', { id: 0, name: 'default' })

        return (
          <div>
            <div data-testid="string">{stringValue}</div>
            <div data-testid="number">{numberValue}</div>
            <div data-testid="boolean">{booleanValue.toString()}</div>
            <div data-testid="object">{JSON.stringify(objectValue)}</div>
          </div>
        )
      }

      render(<TestComponent />)

      act(() => {
        emitter.send('string-event', 'hello')
        emitter.send('number-event', 42)
        emitter.send('boolean-event', true)
        emitter.send('object-event', { id: 1, name: 'test' })
      })

      await waitFor(() => {
        expect(screen.getByTestId('string')).toHaveTextContent('hello')
        expect(screen.getByTestId('number')).toHaveTextContent('42')
        expect(screen.getByTestId('boolean')).toHaveTextContent('true')
        expect(screen.getByTestId('object')).toHaveTextContent(JSON.stringify({ id: 1, name: 'test' }))
      })
    })

    it('should maintain type safety for event values', () => {
      interface Events {
        'typed-event': { userId: number; username: string }
      }
      const emitter = new Emitter<Events>()

      const TestComponent = () => {
        const value = emitter.useEventListener('typed-event', { userId: 0, username: 'default' })

        // Type checking - these should not cause TypeScript errors
        const userId: number = value.userId
        const username: string = value.username

        return (
          <div>
            <div data-testid="user-id">{userId}</div>
            <div data-testid="username">{username}</div>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('user-id')).toHaveTextContent('0')
      expect(screen.getByTestId('username')).toHaveTextContent('default')
    })

    it('should re-render component when value changes', async () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>()
      const renderSpy = jest.fn()

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)
        renderSpy(count)
        return <div data-testid="count">{count}</div>
      }

      render(<TestComponent />)

      expect(renderSpy).toHaveBeenCalledWith(0)

      act(() => {
        emitter.send('counter', 1)
      })

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(1)
      })

      act(() => {
        emitter.send('counter', 2)
      })

      await waitFor(() => {
        expect(renderSpy).toHaveBeenCalledWith(2)
      })
    })

    it('should handle rapid event changes', async () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>()

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)
        return <div data-testid="count">{count}</div>
      }

      render(<TestComponent />)

      act(() => {
        for (let i = 1; i <= 10; i++) {
          emitter.send('counter', i)
        }
      })

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('10')
      })
    })

    it('should work with button clicks', async () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>()

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)

        return (
          <div>
            <div data-testid="count">{count}</div>
            <button data-testid="increment" onClick={() => emitter.send('counter', count + 1)}>
              Increment
            </button>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('count')).toHaveTextContent('0')

      const button = screen.getByTestId('increment')

      act(() => {
        button.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('1')
      })

      act(() => {
        button.click()
      })

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('2')
      })
    })

    it('should handle cached events with multiple components mounting at different times', async () => {
      interface Events {
        message: string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['message'] })

      emitter.send('message', 'initial')

      const Component = ({ id }: { id: string }) => {
        const message = emitter.useEventListener('message', 'default')
        return <div data-testid={`message-${id}`}>{message}</div>
      }

      const { rerender } = render(<Component id="1" />)

      expect(screen.getByTestId('message-1')).toHaveTextContent('initial')

      rerender(
        <>
          <Component id="1" />
          <Component id="2" />
        </>,
      )

      expect(screen.getByTestId('message-1')).toHaveTextContent('initial')
      expect(screen.getByTestId('message-2')).toHaveTextContent('initial')

      act(() => {
        emitter.send('message', 'updated')
      })

      await waitFor(() => {
        expect(screen.getByTestId('message-1')).toHaveTextContent('updated')
        expect(screen.getByTestId('message-2')).toHaveTextContent('updated')
      })
    })
  })

  describe('Memory Leak Prevention', () => {
    it('should not accumulate listeners after multiple mount/unmount cycles', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>()

      // Track listener count by intercepting listen and clear
      let listenerCount = 0
      const originalListen = emitter.listen.bind(emitter)
      const originalClear = emitter.clear.bind(emitter)

      emitter.listen = jest.fn((key, callback) => {
        listenerCount++
        return originalListen(key, callback)
      }) as any

      emitter.clear = jest.fn(id => {
        listenerCount--
        return originalClear(id)
      })

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)
        return <div>{count}</div>
      }

      // Mount and unmount multiple times
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<TestComponent />)
        unmount()
      }

      expect(listenerCount).toBe(0)
    })

    it('should clean up all listeners from multiple hooks in same component', () => {
      interface Events {
        'event-1': string
        'event-2': number
        'event-3': boolean
      }
      const emitter = new Emitter<Events>()

      let listenerCount = 0
      const originalListen = emitter.listen.bind(emitter)
      const originalClear = emitter.clear.bind(emitter)

      emitter.listen = jest.fn((key, callback) => {
        listenerCount++
        return originalListen(key, callback)
      }) as any

      emitter.clear = jest.fn(id => {
        listenerCount--
        return originalClear(id)
      })

      const TestComponent = () => {
        emitter.useEventListener('event-1', 'default')
        emitter.useEventListener('event-2', 0)
        emitter.useEventListener('event-3', false)
        return <div>Test</div>
      }

      const { unmount } = render(<TestComponent />)

      expect(listenerCount).toBe(3)

      unmount()

      expect(listenerCount).toBe(0)
    })

    it('should handle component updates without adding duplicate listeners', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>()

      let listenerCount = 0
      const originalListen = emitter.listen.bind(emitter)

      emitter.listen = jest.fn((key, callback) => {
        listenerCount++
        return originalListen(key, callback)
      }) as any

      const TestComponent = ({ value }: { value: number }) => {
        const count = emitter.useEventListener('counter', 0)
        return <div data-testid="count">{count + value}</div>
      }

      const { rerender } = render(<TestComponent value={0} />)

      const initialListenerCount = listenerCount

      // Rerender with different prop (should not add new listeners)
      rerender(<TestComponent value={10} />)
      rerender(<TestComponent value={20} />)
      rerender(<TestComponent value={30} />)

      expect(listenerCount).toBe(initialListenerCount)
    })
  })

  describe('Integration with Base Emitter Methods', () => {
    it('should work alongside regular listen() calls', async () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>()
      const regularCallback = jest.fn()

      emitter.listen('counter', regularCallback)

      const TestComponent = () => {
        const count = emitter.useEventListener('counter', 0)
        return <div data-testid="count">{count}</div>
      }

      render(<TestComponent />)

      act(() => {
        emitter.send('counter', 42)
      })

      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('42')
        expect(regularCallback).toHaveBeenCalledWith(42)
      })
    })

    it('should respect clearAllCache()', async () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      emitter.send('cached-event', 'cached-value')
      emitter.clearAllCache()

      const TestComponent = () => {
        const value = emitter.useEventListener('cached-event', 'fallback')
        return <div data-testid="value">{value}</div>
      }

      render(<TestComponent />)

      expect(screen.getByTestId('value')).toHaveTextContent('fallback')
    })

    it('should respect clearCache()', async () => {
      interface Events {
        'event-1': string
        'event-2': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['event-1', 'event-2'] })

      emitter.send('event-1', 'value-1')
      emitter.send('event-2', 'value-2')
      emitter.clearCache('event-1')

      const TestComponent = () => {
        const value1 = emitter.useEventListener('event-1', 'fallback-1')
        const value2 = emitter.useEventListener('event-2', 'fallback-2')
        return (
          <div>
            <div data-testid="value-1">{value1}</div>
            <div data-testid="value-2">{value2}</div>
          </div>
        )
      }

      render(<TestComponent />)

      expect(screen.getByTestId('value-1')).toHaveTextContent('fallback-1')
      expect(screen.getByTestId('value-2')).toHaveTextContent('value-2')
    })
  })
})
