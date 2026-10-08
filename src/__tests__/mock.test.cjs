/**
 * Tests for the Jest mock module
 */

describe('EmittifyMock', () => {
  let EmittifyMock

  beforeEach(() => {
    jest.resetModules()
    EmittifyMock = require('../../mock.cjs').default
  })

  describe('Module shape', () => {
    it('exports the class as module.exports and as default', () => {
      const exported = require('../../mock.cjs')

      expect(typeof exported).toBe('function')
      expect(exported.default).toBe(exported)
      expect(exported.__esModule).toBe(true)
    })
  })

  describe('Mock Module Structure', () => {
    it('should export a class', () => {
      expect(EmittifyMock).toBeDefined()
      expect(typeof EmittifyMock).toBe('function')
    })

    it('should be instantiable', () => {
      const mock = new EmittifyMock()
      expect(mock).toBeInstanceOf(EmittifyMock)
    })
  })

  describe('Mock Methods', () => {
    let mockInstance

    beforeEach(() => {
      mockInstance = new EmittifyMock()
    })

    it('should have send method as jest.fn()', () => {
      expect(mockInstance.send).toBeDefined()
      expect(jest.isMockFunction(mockInstance.send)).toBe(true)
    })

    it('should have listen method as jest.fn()', () => {
      expect(mockInstance.listen).toBeDefined()
      expect(jest.isMockFunction(mockInstance.listen)).toBe(true)
    })

    it('should have getCache method as jest.fn()', () => {
      expect(mockInstance.getCache).toBeDefined()
      expect(jest.isMockFunction(mockInstance.getCache)).toBe(true)
    })

    it('should have clearAll method as jest.fn()', () => {
      expect(mockInstance.clearAll).toBeDefined()
      expect(jest.isMockFunction(mockInstance.clearAll)).toBe(true)
    })

    it('should have clearCache method as jest.fn()', () => {
      expect(mockInstance.clearCache).toBeDefined()
      expect(jest.isMockFunction(mockInstance.clearCache)).toBe(true)
    })

    it('should have clearAllCache method as jest.fn()', () => {
      expect(mockInstance.clearAllCache).toBeDefined()
      expect(jest.isMockFunction(mockInstance.clearAllCache)).toBe(true)
    })
  })

  describe('Mock Method Behavior', () => {
    let mockInstance

    beforeEach(() => {
      mockInstance = new EmittifyMock()
    })

    it('should track calls to send()', () => {
      mockInstance.send('test-event', 'test-value')

      expect(mockInstance.send).toHaveBeenCalledTimes(1)
      expect(mockInstance.send).toHaveBeenCalledWith('test-event', 'test-value')
    })

    it('should track calls to listen()', () => {
      const callback = jest.fn()
      mockInstance.listen('test-event', callback)

      expect(mockInstance.listen).toHaveBeenCalledTimes(1)
      expect(mockInstance.listen).toHaveBeenCalledWith('test-event', callback)
    })

    it('should track calls to getCache()', () => {
      mockInstance.getCache('test-event', 'fallback')

      expect(mockInstance.getCache).toHaveBeenCalledTimes(1)
      expect(mockInstance.getCache).toHaveBeenCalledWith('test-event', 'fallback')
    })

    it('should track calls to clearAll()', () => {
      mockInstance.clearAll()

      expect(mockInstance.clearAll).toHaveBeenCalledTimes(1)
    })

    it('should track calls to clearCache()', () => {
      mockInstance.clearCache('test-event')

      expect(mockInstance.clearCache).toHaveBeenCalledTimes(1)
      expect(mockInstance.clearCache).toHaveBeenCalledWith('test-event')
    })

    it('should track calls to clearAllCache()', () => {
      mockInstance.clearAllCache()

      expect(mockInstance.clearAllCache).toHaveBeenCalledTimes(1)
    })

    it('should allow mocking return values', () => {
      mockInstance.getCache.mockReturnValue('mocked-value')

      const result = mockInstance.getCache('test-event')

      expect(result).toBe('mocked-value')
    })

    it('should allow mocking listen to return a listener object', () => {
      const mockListener = {
        id: 'mock-id',
        event: 'test-event',
        clearListener: jest.fn(),
      }

      mockInstance.listen.mockReturnValue(mockListener)

      const listener = mockInstance.listen('test-event', jest.fn())

      expect(listener).toEqual(mockListener)
    })

    it('should support mockImplementation for custom behavior', () => {
      mockInstance.send.mockImplementation((event, value) => {
        return `sent ${event} with ${value}`
      })

      const result = mockInstance.send('test-event', 'test-value')

      expect(result).toBe('sent test-event with test-value')
    })

    it('should support clearing mock calls', () => {
      mockInstance.send('event-1', 'value-1')
      mockInstance.send('event-2', 'value-2')

      expect(mockInstance.send).toHaveBeenCalledTimes(2)

      mockInstance.send.mockClear()

      expect(mockInstance.send).toHaveBeenCalledTimes(0)
    })
  })

  describe('Integration with jest.mock()', () => {
    it('should be usable as a mock in tests', () => {
      // This demonstrates how the mock would be used in actual tests
      // In real usage, users would do: jest.mock('@iremlopsum/emittify', () => require('@iremlopsum/emittify/mock'))
      const EmittifyMock = require('../../mock.cjs').default
      const instance = new EmittifyMock()

      expect(instance.send).toBeDefined()
      expect(jest.isMockFunction(instance.send)).toBe(true)
    })

    it('should work in a typical test scenario', () => {
      const mockEmitter = new EmittifyMock()

      // Mock the behavior
      const mockListener = {
        id: 'test-id',
        event: 'message',
        clearListener: jest.fn(),
      }
      mockEmitter.listen.mockReturnValue(mockListener)

      // Use it in a test
      const callback = jest.fn()
      const listener = mockEmitter.listen('message', callback)

      expect(listener.id).toBe('test-id')
      expect(listener.event).toBe('message')
      expect(mockEmitter.listen).toHaveBeenCalledWith('message', callback)
    })
  })

  describe('Multiple Instances', () => {
    it('should create independent mock instances', () => {
      const mock1 = new EmittifyMock()
      const mock2 = new EmittifyMock()

      mock1.send('event-1', 'value-1')
      mock2.send('event-2', 'value-2')

      expect(mock1.send).toHaveBeenCalledTimes(1)
      expect(mock1.send).toHaveBeenCalledWith('event-1', 'value-1')

      expect(mock2.send).toHaveBeenCalledTimes(1)
      expect(mock2.send).toHaveBeenCalledWith('event-2', 'value-2')
    })

    it('should not share state between instances', () => {
      const mock1 = new EmittifyMock()
      const mock2 = new EmittifyMock()

      mock1.send('event', 'value')

      expect(mock1.send).toHaveBeenCalledTimes(1)
      expect(mock2.send).toHaveBeenCalledTimes(0)
    })
  })

  describe('API Compatibility', () => {
    it('should have exactly the methods of the real React emitter', () => {
      const ReactEmitter = require('../react/index').default
      const methodsOf = instance =>
        Object.keys(instance)
          .filter(key => typeof instance[key] === 'function')
          .sort()

      expect(methodsOf(new EmittifyMock())).toEqual(methodsOf(new ReactEmitter()))
    })
  })

  describe('Default behaviour', () => {
    it('listen() returns a listener whose clearListener can be called', () => {
      const mockInstance = new EmittifyMock()
      const listener = mockInstance.listen('test-event', jest.fn())

      expect(listener.event).toBe('test-event')
      expect(() => listener.clearListener()).not.toThrow()
      expect(jest.isMockFunction(listener.clearListener)).toBe(true)
    })

    it('getCache() returns the fallback value', () => {
      expect(new EmittifyMock().getCache('test-event', 'fallback')).toBe('fallback')
    })

    it('useEventListener() returns the fallback value', () => {
      const mockInstance = new EmittifyMock()

      expect(mockInstance.useEventListener('test-event', 'fallback')).toBe('fallback')
      expect(jest.isMockFunction(mockInstance.useEventListener)).toBe(true)
    })

    it('accepts the real emitter options in place of a spy factory', () => {
      // Code under test calls `new Emittify(options)`, which reaches the mock's constructor
      const mockInstance = new EmittifyMock({ cachedEvents: ['test-event'] })

      expect(jest.isMockFunction(mockInstance.send)).toBe(true)
    })

    it('uses a given spy factory, e.g. vi.fn in Vitest', () => {
      const createSpy = jest.fn(implementation => jest.fn(implementation))
      const mockInstance = new EmittifyMock(createSpy)

      expect(createSpy).toHaveBeenCalled()
      expect(mockInstance.getCache('test-event', 'fallback')).toBe('fallback')
    })
  })
})
