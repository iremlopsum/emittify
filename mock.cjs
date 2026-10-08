/**
 * Test double for @iremlopsum/emittify and @iremlopsum/emittify/react. Every method is a spy.
 *
 * Spies are created with the given factory (e.g. `new EmittifyMock(vi.fn)`), or with `jest.fn` / a global
 * `vi.fn` when available. They are created per instance, at construction time.
 */
class EmittifyMock {
  constructor(createSpy) {
    const fn = createSpy || (typeof jest !== 'undefined' ? jest.fn : typeof vi !== 'undefined' ? vi.fn : undefined)

    if (typeof fn !== 'function') {
      throw new Error('EmittifyMock: no spy factory found. Pass one, e.g. new EmittifyMock(vi.fn)')
    }

    this.send = fn()
    this.listen = fn(event => ({ event, clearListener: fn() }))
    this.getCache = fn((event, fallbackValue) => fallbackValue)
    this.useEventListener = fn((event, fallbackValue) => fallbackValue)
    this.clearAll = fn()
    this.clearCache = fn()
    this.clearAllCache = fn()
    this.clearDeduplicationCache = fn()
    this.clearAllDeduplicationCache = fn()
  }
}

// `module.exports` is the class itself, so ESM `import EmittifyMock from '.../mock'` gets the class in Node.
// `.default` and `__esModule` keep `require('.../mock').default` and `jest.mock(..., () => require(...))` working.
module.exports = EmittifyMock
module.exports.default = EmittifyMock
Object.defineProperty(module.exports, '__esModule', { value: true })
