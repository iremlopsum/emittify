/**
 * Example tests demonstrating usage of test utilities
 * These serve as both tests and documentation
 */

import {
  createTestEmitter,
  createMockCallback,
  testCacheBehavior,
  testListenerLifecycle,
  createMultipleListeners,
  expectAllCallbacksCalled,
  testDataGenerators,
  createStressTestScenario,
} from './test-utils'

describe('Example Tests Using Test Utilities', () => {
  describe('Basic Emitter Usage', () => {
    it('demonstrates createTestEmitter utility', () => {
      interface Events {
        'user-login': { userId: number; username: string }
      }
      
      const emitter = createTestEmitter<Events>()
      const callback = createMockCallback<Events['user-login']>()
      
      emitter.listen('user-login', callback)
      emitter.send('user-login', { userId: 1, username: 'john' })
      
      expect(callback).toHaveBeenCalledWith({ userId: 1, username: 'john' })
    })

    it('demonstrates testListenerLifecycle utility', () => {
      interface Events {
        'notification': string
      }
      
      const emitter = createTestEmitter<Events>()
      const listener = testListenerLifecycle(
        emitter,
        'notification',
        'Test notification'
      )
      
      expect(listener.event).toBe('notification')
    })

    it('demonstrates testCacheBehavior utility', () => {
      interface Events {
        'counter': number
      }
      
      const emitter = createTestEmitter<Events>({ cachedEvents: ['counter'] })
      testCacheBehavior(emitter, 'counter', 42, 0)
    })
  })

  describe('Multiple Listeners', () => {
    it('demonstrates createMultipleListeners utility', () => {
      interface Events {
        'broadcast': string
      }
      
      const emitter = createTestEmitter<Events>()
      const { callbacks, listeners } = createMultipleListeners(
        emitter,
        'broadcast',
        5
      )
      
      emitter.send('broadcast', 'Hello everyone!')
      
      expectAllCallbacksCalled(callbacks, 1)
      callbacks.forEach(callback => {
        expect(callback).toHaveBeenCalledWith('Hello everyone!')
      })
      
      // Cleanup
      listeners.forEach(listener => listener.clearListener())
    })
  })

  describe('Stress Testing', () => {
    it('demonstrates stress test scenario', () => {
      interface Events {
        'counter': number
      }
      
      const emitter = createTestEmitter<Events>()
      const { callbacks } = createStressTestScenario(
        emitter,
        'counter',
        50, // 50 listeners
        100, // 100 events
        (i) => i // Value generator
      )
      
      expectAllCallbacksCalled(callbacks, 100)
    })
  })

  describe('Test Data Generators', () => {
    it('demonstrates using test data generators', () => {
      interface Events {
        'string-event': string
        'number-event': number
        'boolean-event': boolean
        'object-event': { id: number; value: string; timestamp: number }
      }
      
      const emitter = createTestEmitter<Events>()
      
      const stringCallback = createMockCallback<string>()
      const numberCallback = createMockCallback<number>()
      const booleanCallback = createMockCallback<boolean>()
      const objectCallback = createMockCallback<{ id: number; value: string; timestamp: number }>()
      
      emitter.listen('string-event', stringCallback)
      emitter.listen('number-event', numberCallback)
      emitter.listen('boolean-event', booleanCallback)
      emitter.listen('object-event', objectCallback)
      
      // Use generators
      emitter.send('string-event', testDataGenerators.randomString())
      emitter.send('number-event', testDataGenerators.randomNumber())
      emitter.send('boolean-event', testDataGenerators.randomBoolean())
      emitter.send('object-event', testDataGenerators.randomObject())
      
      expect(stringCallback).toHaveBeenCalledTimes(1)
      expect(numberCallback).toHaveBeenCalledTimes(1)
      expect(booleanCallback).toHaveBeenCalledTimes(1)
      expect(objectCallback).toHaveBeenCalledTimes(1)
      
      // Verify the types of generated data
      const stringArg = stringCallback.mock.calls[0][0]
      const numberArg = numberCallback.mock.calls[0][0]
      const booleanArg = booleanCallback.mock.calls[0][0]
      const objectArg = objectCallback.mock.calls[0][0]
      
      expect(typeof stringArg).toBe('string')
      expect(typeof numberArg).toBe('number')
      expect(typeof booleanArg).toBe('boolean')
      expect(objectArg).toHaveProperty('id')
      expect(objectArg).toHaveProperty('value')
      expect(objectArg).toHaveProperty('timestamp')
    })
  })

  describe('Real-world Scenario Examples', () => {
    it('simulates a notification system', () => {
      interface Events {
        'toast-notification': {
          message: string
          type: 'success' | 'error' | 'info' | 'warning'
          duration?: number
        }
      }
      
      const emitter = createTestEmitter<Events>()
      const notificationHandler = createMockCallback<Events['toast-notification']>()
      
      emitter.listen('toast-notification', notificationHandler)
      
      // Send different notification types
      emitter.send('toast-notification', {
        message: 'User logged in successfully',
        type: 'success',
        duration: 3000,
      })
      
      emitter.send('toast-notification', {
        message: 'Failed to save data',
        type: 'error',
      })
      
      expect(notificationHandler).toHaveBeenCalledTimes(2)
      expect(notificationHandler.mock.calls[0][0]).toMatchObject({
        message: 'User logged in successfully',
        type: 'success',
      })
      expect(notificationHandler.mock.calls[1][0]).toMatchObject({
        message: 'Failed to save data',
        type: 'error',
      })
    })

    it('simulates a chat message counter with caching', () => {
      interface Events {
        'unread-messages': number
      }
      
      const emitter = createTestEmitter<Events>({ cachedEvents: ['unread-messages'] })
      
      // Set initial unread count
      emitter.send('unread-messages', 5)
      
      // New listener should get cached value
      const callback = createMockCallback<number>()
      emitter.listen('unread-messages', callback)
      
      expect(callback).toHaveBeenCalledWith(5)
      
      // Update count
      emitter.send('unread-messages', 10)
      expect(callback).toHaveBeenCalledWith(10)
      
      // Get cached value
      expect(emitter.getCache('unread-messages', 0)).toBe(10)
    })

    it('simulates a global state management system', () => {
      interface Events {
        'user-data': { id: number; name: string; email: string } | null
        'theme': 'light' | 'dark'
        'sidebar-open': boolean
      }
      
      const emitter = createTestEmitter<Events>({
        cachedEvents: ['user-data', 'theme', 'sidebar-open'],
      })
      
      const userDataCallback = createMockCallback<Events['user-data']>()
      const themeCallback = createMockCallback<Events['theme']>()
      const sidebarCallback = createMockCallback<Events['sidebar-open']>()
      
      emitter.listen('user-data', userDataCallback)
      emitter.listen('theme', themeCallback)
      emitter.listen('sidebar-open', sidebarCallback)
      
      // Initialize app state
      emitter.send('user-data', { id: 1, name: 'John', email: 'john@example.com' })
      emitter.send('theme', 'dark')
      emitter.send('sidebar-open', true)
      
      expect(userDataCallback).toHaveBeenCalledWith({
        id: 1,
        name: 'John',
        email: 'john@example.com',
      })
      expect(themeCallback).toHaveBeenCalledWith('dark')
      expect(sidebarCallback).toHaveBeenCalledWith(true)
      
      // User logs out
      emitter.send('user-data', null)
      expect(userDataCallback).toHaveBeenLastCalledWith(null)
    })

    it('simulates a form validation system', () => {
      interface Events {
        'validation-errors': { field: string; message: string }[]
        'form-submitted': boolean
      }
      
      const emitter = createTestEmitter<Events>()
      const errorsCallback = createMockCallback<Events['validation-errors']>()
      const submitCallback = createMockCallback<Events['form-submitted']>()
      
      emitter.listen('validation-errors', errorsCallback)
      emitter.listen('form-submitted', submitCallback)
      
      // Validation fails
      emitter.send('validation-errors', [
        { field: 'email', message: 'Invalid email format' },
        { field: 'password', message: 'Password too short' },
      ])
      
      expect(errorsCallback).toHaveBeenCalledWith([
        { field: 'email', message: 'Invalid email format' },
        { field: 'password', message: 'Password too short' },
      ])
      
      // Fix errors and resubmit
      emitter.send('validation-errors', [])
      emitter.send('form-submitted', true)
      
      expect(submitCallback).toHaveBeenCalledWith(true)
    })
  })
})

