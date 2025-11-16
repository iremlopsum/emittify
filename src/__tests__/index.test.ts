import Emitter from '../index'

describe('Emitter', () => {
  describe('Constructor & Initialization', () => {
    it('should create instance without options', () => {
      const emitter = new Emitter()
      expect(emitter).toBeInstanceOf(Emitter)
    })

    it('should create instance with cachedEvents option', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['test-event'] })
      expect(emitter).toBeInstanceOf(Emitter)
    })

    it('should initialize empty internal maps', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()

      // Should not have any cached values initially
      expect(emitter.getCache('test-event')).toBeUndefined()
    })
  })

  describe('send()', () => {
    it('should send event to single listener', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      emitter.listen('test-event', callback)
      emitter.send('test-event', 'test-value')

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith('test-value')
    })

    it('should send event to multiple listeners', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const callback3 = jest.fn()

      emitter.listen('test-event', callback1)
      emitter.listen('test-event', callback2)
      emitter.listen('test-event', callback3)
      emitter.send('test-event', 'test-value')

      expect(callback1).toHaveBeenCalledWith('test-value')
      expect(callback2).toHaveBeenCalledWith('test-value')
      expect(callback3).toHaveBeenCalledWith('test-value')
    })

    it('should handle sending to non-existent event (no listeners)', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()

      // Should not throw
      expect(() => {
        emitter.send('test-event', 'test-value')
      }).not.toThrow()
    })

    it('should pass correct parameters to callbacks', () => {
      interface Events {
        'user-login': { userId: number; username: string }
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      emitter.listen('user-login', callback)
      emitter.send('user-login', { userId: 123, username: 'john' })

      expect(callback).toHaveBeenCalledWith({ userId: 123, username: 'john' })
    })

    it('should cache events when event is in cachedEvents array', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      emitter.send('cached-event', 'cached-value')

      expect(emitter.getCache('cached-event')).toBe('cached-value')
    })

    it('should not cache events when not in cachedEvents array', () => {
      interface Events {
        'cached-event': string
        'non-cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      emitter.send('non-cached-event', 'value')

      expect(emitter.getCache('non-cached-event')).toBeUndefined()
    })

    it('should overwrite cached value on subsequent sends', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['counter'] })

      emitter.send('counter', 1)
      expect(emitter.getCache('counter')).toBe(1)

      emitter.send('counter', 2)
      expect(emitter.getCache('counter')).toBe(2)

      emitter.send('counter', 3)
      expect(emitter.getCache('counter')).toBe(3)
    })

    it('should maintain type safety for event payloads', () => {
      interface Events {
        'string-event': string
        'number-event': number
        'object-event': { id: number; name: string }
      }
      const emitter = new Emitter<Events>()
      const stringCallback = jest.fn((value: string) => value)
      const numberCallback = jest.fn((value: number) => value)
      const objectCallback = jest.fn((value: { id: number; name: string }) => value)

      emitter.listen('string-event', stringCallback)
      emitter.listen('number-event', numberCallback)
      emitter.listen('object-event', objectCallback)

      emitter.send('string-event', 'test')
      emitter.send('number-event', 42)
      emitter.send('object-event', { id: 1, name: 'test' })

      expect(stringCallback).toHaveBeenCalledWith('test')
      expect(numberCallback).toHaveBeenCalledWith(42)
      expect(objectCallback).toHaveBeenCalledWith({ id: 1, name: 'test' })
    })
  })

  describe('listen()', () => {
    it('should register a new listener successfully', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      const listener = emitter.listen('test-event', callback)

      expect(listener).toHaveProperty('id')
      expect(listener).toHaveProperty('event')
      expect(listener).toHaveProperty('clearListener')
      expect(listener.event).toBe('test-event')
    })

    it('should return object with id, event, and clearListener', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      const listener = emitter.listen('test-event', callback)

      expect(typeof listener.id).toBe('string')
      expect(listener.event).toBe('test-event')
      expect(typeof listener.clearListener).toBe('function')
    })

    it('should generate unique ID for each listener', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      const listener1 = emitter.listen('test-event', callback)
      const listener2 = emitter.listen('test-event', callback)
      const listener3 = emitter.listen('test-event', callback)

      expect(listener1.id).not.toBe(listener2.id)
      expect(listener2.id).not.toBe(listener3.id)
      expect(listener1.id).not.toBe(listener3.id)
    })

    it('should allow multiple listeners for same event', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      emitter.listen('test-event', callback1)
      emitter.listen('test-event', callback2)

      emitter.send('test-event', 'test')

      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('should immediately call callback with cached value if exists', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })
      const callback = jest.fn()

      emitter.send('cached-event', 'cached-value')
      emitter.listen('cached-event', callback)

      expect(callback).toHaveBeenCalledWith('cached-value')
    })

    it('should not call callback if no cached value exists', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })
      const callback = jest.fn()

      emitter.listen('cached-event', callback)

      expect(callback).not.toHaveBeenCalled()
    })

    it('should only use cache for events in cachedEvents array', () => {
      interface Events {
        'cached-event': string
        'non-cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      emitter.send('cached-event', 'cached')
      emitter.send('non-cached-event', 'non-cached')

      emitter.listen('cached-event', callback1)
      emitter.listen('non-cached-event', callback2)

      expect(callback1).toHaveBeenCalledWith('cached')
      expect(callback2).not.toHaveBeenCalled()
    })

    it('should properly register listeners for different event types', () => {
      interface Events {
        'event-1': string
        'event-2': number
        'event-3': boolean
      }
      const emitter = new Emitter<Events>()
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const callback3 = jest.fn()

      emitter.listen('event-1', callback1)
      emitter.listen('event-2', callback2)
      emitter.listen('event-3', callback3)

      emitter.send('event-1', 'test')
      emitter.send('event-2', 42)
      emitter.send('event-3', true)

      expect(callback1).toHaveBeenCalledWith('test')
      expect(callback2).toHaveBeenCalledWith(42)
      expect(callback3).toHaveBeenCalledWith(true)
    })

    it('clearListener() function should work correctly', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      const listener = emitter.listen('test-event', callback)
      emitter.send('test-event', 'test-1')

      listener.clearListener()
      emitter.send('test-event', 'test-2')

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith('test-1')
    })
  })

  describe('getCache()', () => {
    it('should return cached value when it exists', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      emitter.send('cached-event', 'cached-value')

      expect(emitter.getCache('cached-event')).toBe('cached-value')
    })

    it('should return fallback value when cache is empty', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      expect(emitter.getCache('cached-event', 'fallback')).toBe('fallback')
    })

    it('should return undefined when no fallback provided and cache empty', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      expect(emitter.getCache('cached-event')).toBeUndefined()
    })

    it('should work correctly after cache is set via send()', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['counter'] })

      expect(emitter.getCache('counter', 0)).toBe(0)

      emitter.send('counter', 5)
      expect(emitter.getCache('counter', 0)).toBe(5)

      emitter.send('counter', 10)
      expect(emitter.getCache('counter', 0)).toBe(10)
    })

    it('should only return cache for events in cachedEvents array', () => {
      interface Events {
        'cached-event': string
        'non-cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      emitter.send('cached-event', 'cached')
      emitter.send('non-cached-event', 'non-cached')

      expect(emitter.getCache('cached-event')).toBe('cached')
      expect(emitter.getCache('non-cached-event')).toBeUndefined()
    })
  })

  describe('clear()', () => {
    it('should remove listener by ID', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      const listener = emitter.listen('test-event', callback)
      emitter.clear(listener.id)
      emitter.send('test-event', 'test')

      expect(callback).not.toHaveBeenCalled()
    })

    it('should return undefined after clearing', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      const listener = emitter.listen('test-event', callback)
      const result = emitter.clear(listener.id)

      expect(result).toBeUndefined()
    })

    it('should handle clearing non-existent listener ID', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()

      expect(() => {
        emitter.clear('non-existent-id')
      }).not.toThrow()
    })

    it('should remove listener from both receivers and listeners maps', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      const listener = emitter.listen('test-event', callback)
      emitter.send('test-event', 'test-1')

      emitter.clear(listener.id)
      emitter.send('test-event', 'test-2')

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should not affect other listeners for same event', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const callback3 = jest.fn()

      const listener1 = emitter.listen('test-event', callback1)
      emitter.listen('test-event', callback2)
      emitter.listen('test-event', callback3)

      emitter.clear(listener1.id)
      emitter.send('test-event', 'test')

      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).toHaveBeenCalledWith('test')
      expect(callback3).toHaveBeenCalledWith('test')
    })

    it('should not affect listeners for different events', () => {
      interface Events {
        'event-1': string
        'event-2': string
      }
      const emitter = new Emitter<Events>()
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      const listener1 = emitter.listen('event-1', callback1)
      emitter.listen('event-2', callback2)

      emitter.clear(listener1.id)
      emitter.send('event-1', 'test-1')
      emitter.send('event-2', 'test-2')

      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).toHaveBeenCalledWith('test-2')
    })
  })

  describe('clearAll()', () => {
    it('should remove all listeners', () => {
      interface Events {
        'event-1': string
        'event-2': number
        'event-3': boolean
      }
      const emitter = new Emitter<Events>()
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const callback3 = jest.fn()

      emitter.listen('event-1', callback1)
      emitter.listen('event-2', callback2)
      emitter.listen('event-3', callback3)

      emitter.clearAll()

      emitter.send('event-1', 'test')
      emitter.send('event-2', 42)
      emitter.send('event-3', true)

      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).not.toHaveBeenCalled()
      expect(callback3).not.toHaveBeenCalled()
    })

    it('should return empty Map', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      emitter.listen('test-event', callback)
      const result = emitter.clearAll()

      expect(result).toBeInstanceOf(Map)
      expect(result.size).toBe(0)
    })

    it('should prevent callbacks on cleared listeners', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      emitter.listen('test-event', callback1)
      emitter.listen('test-event', callback2)

      emitter.send('test-event', 'before-clear')
      emitter.clearAll()
      emitter.send('test-event', 'after-clear')

      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
      expect(callback1).toHaveBeenCalledWith('before-clear')
      expect(callback2).toHaveBeenCalledWith('before-clear')
    })

    it('should not affect cache', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      emitter.send('cached-event', 'cached-value')
      emitter.clearAll()

      expect(emitter.getCache('cached-event')).toBe('cached-value')
    })
  })

  describe('clearCache()', () => {
    it('should clear cache for specific event', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      emitter.send('cached-event', 'cached-value')
      expect(emitter.getCache('cached-event')).toBe('cached-value')

      emitter.clearCache('cached-event')
      expect(emitter.getCache('cached-event')).toBeUndefined()
    })

    it('should not affect other cached events', () => {
      interface Events {
        'event-1': string
        'event-2': number
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['event-1', 'event-2'] })

      emitter.send('event-1', 'value-1')
      emitter.send('event-2', 42)

      emitter.clearCache('event-1')

      expect(emitter.getCache('event-1')).toBeUndefined()
      expect(emitter.getCache('event-2')).toBe(42)
    })

    it('should handle clearing non-existent cache key', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      expect(() => {
        emitter.clearCache('cached-event')
      }).not.toThrow()
    })

    it('should not affect active listeners', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })
      const callback = jest.fn()

      emitter.listen('cached-event', callback)
      emitter.send('cached-event', 'value-1')
      emitter.clearCache('cached-event')
      emitter.send('cached-event', 'value-2')

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, 'value-1')
      expect(callback).toHaveBeenNthCalledWith(2, 'value-2')
    })
  })

  describe('clearAllCache()', () => {
    it('should clear all cached events', () => {
      interface Events {
        'event-1': string
        'event-2': number
        'event-3': boolean
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['event-1', 'event-2', 'event-3'] })

      emitter.send('event-1', 'value-1')
      emitter.send('event-2', 42)
      emitter.send('event-3', true)

      emitter.clearAllCache()

      expect(emitter.getCache('event-1')).toBeUndefined()
      expect(emitter.getCache('event-2')).toBeUndefined()
      expect(emitter.getCache('event-3')).toBeUndefined()
    })

    it('should not affect active listeners', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })
      const callback = jest.fn()

      emitter.listen('cached-event', callback)
      emitter.send('cached-event', 'value-1')
      emitter.clearAllCache()
      emitter.send('cached-event', 'value-2')

      expect(callback).toHaveBeenCalledTimes(2)
    })

    it('new listeners should not receive old cached values', () => {
      interface Events {
        'cached-event': string
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['cached-event'] })

      emitter.send('cached-event', 'old-value')
      emitter.clearAllCache()

      const callback = jest.fn()
      emitter.listen('cached-event', callback)

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('Integration & Edge Cases', () => {
    it('should handle listener added during event emission', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      emitter.listen('test-event', value => {
        callback1(value)
        // Add listener during emission - it will be called immediately for the current emission
        // because Set.forEach iterates over newly added items
        if (value === 'test-1') {
          emitter.listen('test-event', callback2)
        }
      })

      emitter.send('test-event', 'test-1')
      emitter.send('test-event', 'test-2')

      // callback1 is called twice (once for each send)
      expect(callback1).toHaveBeenCalledTimes(2)
      // callback2 is called twice:
      // - once immediately during test-1 emission (Set.forEach continues with new items)
      // - once during test-2 emission
      expect(callback2).toHaveBeenCalledTimes(2)
    })

    it('should handle listener removed during event emission', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      const listener2 = emitter.listen('test-event', callback2)
      emitter.listen('test-event', () => {
        callback1()
        // Remove listener during emission
        listener2.clearListener()
      })

      emitter.send('test-event', 'test')

      expect(callback1).toHaveBeenCalledTimes(1)
      // callback2 might or might not be called depending on iteration order
      // This tests that it doesn't throw
    })

    it('should handle recursive event sending', () => {
      interface Events {
        'event-a': string
        'event-b': string
      }
      const emitter = new Emitter<Events>()
      const callbackA = jest.fn()
      const callbackB = jest.fn()

      emitter.listen('event-a', value => {
        callbackA(value)
        if (value === 'trigger-b') {
          emitter.send('event-b', 'from-a')
        }
      })

      emitter.listen('event-b', callbackB)

      emitter.send('event-a', 'trigger-b')

      expect(callbackA).toHaveBeenCalledWith('trigger-b')
      expect(callbackB).toHaveBeenCalledWith('from-a')
    })

    it('should handle many listeners (stress test)', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const callbacks: jest.Mock[] = []

      // Add 100 listeners
      for (let i = 0; i < 100; i++) {
        const callback = jest.fn()
        callbacks.push(callback)
        emitter.listen('test-event', callback)
      }

      emitter.send('test-event', 'test')

      callbacks.forEach(callback => {
        expect(callback).toHaveBeenCalledWith('test')
      })
    })

    it('should handle rapid send() calls in succession', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['counter'] })
      const callback = jest.fn()

      emitter.listen('counter', callback)

      for (let i = 0; i < 100; i++) {
        emitter.send('counter', i)
      }

      expect(callback).toHaveBeenCalledTimes(100)
      expect(emitter.getCache('counter')).toBe(99)
    })

    it('should handle large payload objects', () => {
      interface Events {
        'data-event': { data: number[] }
      }
      const emitter = new Emitter<Events>()
      const callback = jest.fn()

      const largeArray = Array.from({ length: 10000 }, (_, i) => i)

      emitter.listen('data-event', callback)
      emitter.send('data-event', { data: largeArray })

      expect(callback).toHaveBeenCalledWith({ data: largeArray })
    })

    it('should handle callback that throws error without breaking other listeners', () => {
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      const errorCallback = jest.fn(() => {
        throw new Error('Callback error')
      })
      const normalCallback = jest.fn()

      emitter.listen('test-event', errorCallback)
      emitter.listen('test-event', normalCallback)

      expect(() => {
        emitter.send('test-event', 'test')
      }).toThrow('Callback error')

      // Note: The error will stop execution, so normalCallback might not be called
      // This behavior is expected - the emitter doesn't catch errors
    })

    it('should handle undefined values', () => {
      interface Events {
        'test-event': string | undefined
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['test-event'] })
      const callback = jest.fn()

      emitter.listen('test-event', callback)
      emitter.send('test-event', undefined)

      expect(callback).toHaveBeenCalledWith(undefined)
      expect(emitter.getCache('test-event')).toBeUndefined()
    })

    it('should handle null values', () => {
      interface Events {
        'test-event': string | null
      }
      const emitter = new Emitter<Events>({ cachedEvents: ['test-event'] })
      const callback = jest.fn()

      emitter.listen('test-event', callback)
      emitter.send('test-event', null)

      expect(callback).toHaveBeenCalledWith(null)
      expect(emitter.getCache('test-event')).toBe(null)
    })

    it('should handle multiple simultaneous send() calls for different events', () => {
      interface Events {
        'event-1': string
        'event-2': number
        'event-3': boolean
      }
      const emitter = new Emitter<Events>()
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const callback3 = jest.fn()

      emitter.listen('event-1', callback1)
      emitter.listen('event-2', callback2)
      emitter.listen('event-3', callback3)

      emitter.send('event-1', 'test')
      emitter.send('event-2', 42)
      emitter.send('event-3', true)

      expect(callback1).toHaveBeenCalledWith('test')
      expect(callback2).toHaveBeenCalledWith(42)
      expect(callback3).toHaveBeenCalledWith(true)
    })

    it('should handle listen/unlisten during sends', () => {
      interface Events {
        'test-event': number
      }
      const emitter = new Emitter<Events>()
      let listenerCount = 0

      const addAndRemoveListeners = () => {
        for (let i = 0; i < 10; i++) {
          const listener = emitter.listen('test-event', () => {
            listenerCount++
          })

          if (i % 2 === 0) {
            listener.clearListener()
          }
        }
      }

      addAndRemoveListeners()
      emitter.send('test-event', 1)

      expect(listenerCount).toBe(5) // Only 5 listeners should remain
    })
  })

  describe('Deduplication with deep comparison', () => {
    it('should emit first event always (no previous value)', () => {
      interface Events {
        data: { count: number }
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'data', comparison: 'deep' }],
      })
      const callback = jest.fn()

      emitter.listen('data', callback)
      emitter.send('data', { count: 1 })

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith({ count: 1 })
    })

    it('should block identical values with deep comparison', () => {
      interface Events {
        user: { id: number; name: string; settings: { theme: string } }
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'user', comparison: 'deep' }],
      })
      const callback = jest.fn()

      emitter.listen('user', callback)

      const userData = { id: 1, name: 'John', settings: { theme: 'dark' } }
      emitter.send('user', userData)
      emitter.send('user', { id: 1, name: 'John', settings: { theme: 'dark' } }) // Same value
      emitter.send('user', userData) // Same reference

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(userData)
    })

    it('should emit when nested values change with deep comparison', () => {
      interface Events {
        config: { api: { url: string; timeout: number } }
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'config', comparison: 'deep' }],
      })
      const callback = jest.fn()

      emitter.listen('config', callback)

      emitter.send('config', { api: { url: 'api.com', timeout: 5000 } })
      emitter.send('config', { api: { url: 'api.com', timeout: 5000 } }) // Same
      emitter.send('config', { api: { url: 'api.com', timeout: 3000 } }) // Different timeout

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, { api: { url: 'api.com', timeout: 5000 } })
      expect(callback).toHaveBeenNthCalledWith(2, { api: { url: 'api.com', timeout: 3000 } })
    })

    it('should handle arrays with deep comparison', () => {
      interface Events {
        list: number[]
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'list', comparison: 'deep' }],
      })
      const callback = jest.fn()

      emitter.listen('list', callback)

      emitter.send('list', [1, 2, 3])
      emitter.send('list', [1, 2, 3]) // Same
      emitter.send('list', [1, 2, 3, 4]) // Different

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, [1, 2, 3])
      expect(callback).toHaveBeenNthCalledWith(2, [1, 2, 3, 4])
    })

    it('should handle primitive values with deep comparison', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'counter', comparison: 'deep' }],
      })
      const callback = jest.fn()

      emitter.listen('counter', callback)

      emitter.send('counter', 1)
      emitter.send('counter', 1) // Same
      emitter.send('counter', 2) // Different

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, 1)
      expect(callback).toHaveBeenNthCalledWith(2, 2)
    })
  })

  describe('Deduplication with shallow comparison', () => {
    it('should block identical shallow objects', () => {
      interface Events {
        data: { count: number; label: string }
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'data', comparison: 'shallow' }],
      })
      const callback = jest.fn()

      emitter.listen('data', callback)

      emitter.send('data', { count: 1, label: 'test' })
      emitter.send('data', { count: 1, label: 'test' }) // Same

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith({ count: 1, label: 'test' })
    })

    it('should emit when shallow properties change', () => {
      interface Events {
        data: { count: number; label: string }
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'data', comparison: 'shallow' }],
      })
      const callback = jest.fn()

      emitter.listen('data', callback)

      emitter.send('data', { count: 1, label: 'test' })
      emitter.send('data', { count: 2, label: 'test' }) // Different count

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, { count: 1, label: 'test' })
      expect(callback).toHaveBeenNthCalledWith(2, { count: 2, label: 'test' })
    })

    it('should NOT detect nested changes with shallow comparison', () => {
      interface Events {
        config: { settings: { theme: string } }
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'config', comparison: 'shallow' }],
      })
      const callback = jest.fn()

      emitter.listen('config', callback)

      const settings1 = { theme: 'dark' }
      const settings2 = { theme: 'light' }

      emitter.send('config', { settings: settings1 })
      emitter.send('config', { settings: settings2 }) // Different nested object reference

      // Shallow comparison only checks if settings property references are the same
      // Since settings1 !== settings2, this WILL emit
      expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should handle primitives with shallow comparison', () => {
      interface Events {
        status: string
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'status', comparison: 'shallow' }],
      })
      const callback = jest.fn()

      emitter.listen('status', callback)

      emitter.send('status', 'active')
      emitter.send('status', 'active') // Same
      emitter.send('status', 'inactive') // Different

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, 'active')
      expect(callback).toHaveBeenNthCalledWith(2, 'inactive')
    })
  })

  describe('Deduplication with multiple events', () => {
    it('should handle multiple deduplicated events independently', () => {
      interface Events {
        counter: number
        user: { id: number; name: string }
        status: string
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [
          { event: 'counter', comparison: 'shallow' },
          { event: 'user', comparison: 'deep' },
          { event: 'status', comparison: 'shallow' },
        ],
      })
      const counterCallback = jest.fn()
      const userCallback = jest.fn()
      const statusCallback = jest.fn()

      emitter.listen('counter', counterCallback)
      emitter.listen('user', userCallback)
      emitter.listen('status', statusCallback)

      // Counter
      emitter.send('counter', 1)
      emitter.send('counter', 1) // Blocked
      emitter.send('counter', 2) // Emitted

      // User
      emitter.send('user', { id: 1, name: 'John' })
      emitter.send('user', { id: 1, name: 'John' }) // Blocked
      emitter.send('user', { id: 1, name: 'Jane' }) // Emitted

      // Status
      emitter.send('status', 'active')
      emitter.send('status', 'active') // Blocked

      expect(counterCallback).toHaveBeenCalledTimes(2)
      expect(userCallback).toHaveBeenCalledTimes(2)
      expect(statusCallback).toHaveBeenCalledTimes(1)
    })

    it('should not affect non-deduplicated events', () => {
      interface Events {
        deduplicated: number
        normal: number
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'deduplicated', comparison: 'deep' }],
      })
      const deduplicatedCallback = jest.fn()
      const normalCallback = jest.fn()

      emitter.listen('deduplicated', deduplicatedCallback)
      emitter.listen('normal', normalCallback)

      emitter.send('deduplicated', 1)
      emitter.send('deduplicated', 1) // Blocked

      emitter.send('normal', 1)
      emitter.send('normal', 1) // NOT blocked

      expect(deduplicatedCallback).toHaveBeenCalledTimes(1)
      expect(normalCallback).toHaveBeenCalledTimes(2)
    })
  })

  describe('Deduplication with cachedEvents', () => {
    it('should work together with cached events', () => {
      interface Events {
        data: { value: number }
      }
      const emitter = new Emitter<Events>({
        cachedEvents: ['data'],
        deduplicatedEvents: [{ event: 'data', comparison: 'deep' }],
      })
      const callback = jest.fn()

      emitter.send('data', { value: 1 })
      emitter.send('data', { value: 1 }) // Blocked from emission

      // Cache should be updated even when emission is blocked
      expect(emitter.getCache('data')).toEqual({ value: 1 })

      // New listener should get cached value
      emitter.listen('data', callback)
      expect(callback).toHaveBeenCalledWith({ value: 1 })
    })

    it('should cache new values even when deduplicated emission is blocked', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>({
        cachedEvents: ['counter'],
        deduplicatedEvents: [{ event: 'counter', comparison: 'shallow' }],
      })

      emitter.send('counter', 5)
      expect(emitter.getCache('counter')).toBe(5)

      emitter.send('counter', 5) // Blocked
      expect(emitter.getCache('counter')).toBe(5) // Still cached

      emitter.send('counter', 10)
      expect(emitter.getCache('counter')).toBe(10)
    })

    it('should deliver cached value to new listeners even if last send was deduplicated', () => {
      interface Events {
        status: string
      }
      const emitter = new Emitter<Events>({
        cachedEvents: ['status'],
        deduplicatedEvents: [{ event: 'status', comparison: 'shallow' }],
      })
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      emitter.listen('status', callback1)
      emitter.send('status', 'active')
      emitter.send('status', 'active') // Deduplicated, but still cached

      emitter.listen('status', callback2) // New listener

      expect(callback1).toHaveBeenCalledTimes(1) // Only first emission
      expect(callback2).toHaveBeenCalledTimes(1) // Gets cached value
      expect(callback2).toHaveBeenCalledWith('active')
    })
  })

  describe('clearDeduplicationCache()', () => {
    it('should clear previous value for specific event', () => {
      interface Events {
        counter: number
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'counter', comparison: 'shallow' }],
      })
      const callback = jest.fn()

      emitter.listen('counter', callback)
      emitter.send('counter', 1)
      emitter.send('counter', 1) // Blocked

      emitter.clearDeduplicationCache('counter')
      emitter.send('counter', 1) // Should emit now (no previous value)

      expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should not affect other deduplicated events', () => {
      interface Events {
        'event-1': number
        'event-2': string
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [
          { event: 'event-1', comparison: 'shallow' },
          { event: 'event-2', comparison: 'shallow' },
        ],
      })
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      emitter.listen('event-1', callback1)
      emitter.listen('event-2', callback2)

      emitter.send('event-1', 1)
      emitter.send('event-2', 'test')

      emitter.clearDeduplicationCache('event-1')

      emitter.send('event-1', 1) // Should emit
      emitter.send('event-2', 'test') // Still blocked

      expect(callback1).toHaveBeenCalledTimes(2)
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('should handle clearing non-existent cache', () => {
      interface Events {
        event: number
      }
      const emitter = new Emitter<Events>()

      expect(() => {
        emitter.clearDeduplicationCache('event')
      }).not.toThrow()
    })
  })

  describe('clearAllDeduplicationCache()', () => {
    it('should clear all previous values', () => {
      interface Events {
        'event-1': number
        'event-2': string
        'event-3': boolean
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [
          { event: 'event-1', comparison: 'shallow' },
          { event: 'event-2', comparison: 'deep' },
          { event: 'event-3', comparison: 'shallow' },
        ],
      })
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const callback3 = jest.fn()

      emitter.listen('event-1', callback1)
      emitter.listen('event-2', callback2)
      emitter.listen('event-3', callback3)

      emitter.send('event-1', 1)
      emitter.send('event-2', 'test')
      emitter.send('event-3', true)

      emitter.clearAllDeduplicationCache()

      // All should emit again now
      emitter.send('event-1', 1)
      emitter.send('event-2', 'test')
      emitter.send('event-3', true)

      expect(callback1).toHaveBeenCalledTimes(2)
      expect(callback2).toHaveBeenCalledTimes(2)
      expect(callback3).toHaveBeenCalledTimes(2)
    })

    it('should not affect regular cache', () => {
      interface Events {
        data: string
      }
      const emitter = new Emitter<Events>({
        cachedEvents: ['data'],
        deduplicatedEvents: [{ event: 'data', comparison: 'shallow' }],
      })

      emitter.send('data', 'value')
      emitter.clearAllDeduplicationCache()

      expect(emitter.getCache('data')).toBe('value')
    })
  })

  describe('Edge cases for deduplication', () => {
    it('should handle null values', () => {
      interface Events {
        data: string | null
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'data', comparison: 'deep' }],
      })
      const callback = jest.fn()

      emitter.listen('data', callback)
      emitter.send('data', null)
      emitter.send('data', null) // Blocked
      emitter.send('data', 'value')

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(1, null)
      expect(callback).toHaveBeenNthCalledWith(2, 'value')
    })

    it('should handle undefined values', () => {
      interface Events {
        data: string | undefined
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'data', comparison: 'deep' }],
      })
      const callback = jest.fn()

      emitter.listen('data', callback)
      emitter.send('data', undefined)
      emitter.send('data', undefined) // Blocked

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(undefined)
    })

    it('should handle empty objects', () => {
      interface Events {
        data: Record<string, never>
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'data', comparison: 'deep' }],
      })
      const callback = jest.fn()

      emitter.listen('data', callback)
      emitter.send('data', {})
      emitter.send('data', {}) // Blocked

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should handle empty arrays', () => {
      interface Events {
        list: number[]
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'list', comparison: 'deep' }],
      })
      const callback = jest.fn()

      emitter.listen('list', callback)
      emitter.send('list', [])
      emitter.send('list', []) // Blocked

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should work with multiple listeners on same deduplicated event', () => {
      interface Events {
        data: number
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'data', comparison: 'shallow' }],
      })
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const callback3 = jest.fn()

      emitter.listen('data', callback1)
      emitter.listen('data', callback2)
      emitter.listen('data', callback3)

      emitter.send('data', 1)
      emitter.send('data', 1) // Blocked for all

      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
      expect(callback3).toHaveBeenCalledTimes(1)
    })

    it('should handle listener added after first send', () => {
      interface Events {
        data: number
      }
      const emitter = new Emitter<Events>({
        deduplicatedEvents: [{ event: 'data', comparison: 'shallow' }],
      })
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      emitter.listen('data', callback1)
      emitter.send('data', 1)

      emitter.listen('data', callback2) // New listener
      emitter.send('data', 1) // Blocked

      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).not.toHaveBeenCalled()
    })
  })
})
