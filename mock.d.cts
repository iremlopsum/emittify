/**
 * Test double for @iremlopsum/emittify and @iremlopsum/emittify/react. Every method is a spy created with
 * `createSpy` (e.g. `vi.fn`), or with `jest.fn` / a global `vi.fn` when available.
 */
type SpyFactory = (implementation?: (...args: any[]) => any) => (...args: any[]) => any

declare class EmittifyMock {
  constructor(createSpy?: SpyFactory)

  send: any
  listen: any
  getCache: any
  useEventListener: any
  clearAll: any
  clearCache: any
  clearAllCache: any
  clearDeduplicationCache: any
  clearAllDeduplicationCache: any
}

declare namespace EmittifyMock {
  export { EmittifyMock as default }
}

export = EmittifyMock
