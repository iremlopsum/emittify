/**
 * Compile-time type tests. ts-jest type-checks this file, so a wrong type fails the suite.
 */
import Emitter from '../index'
import ReactEmitter from '../react/index'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
const expectType = <T extends true>(_assertion?: T) => undefined

interface Events {
  count: number
  user: { name: string }
}

describe('types', () => {
  it('getCache() without a fallback may return undefined', () => {
    const emitter = new Emitter<Events>({ cachedEvents: ['count'] })
    const value = emitter.getCache('count')

    expectType<Equal<typeof value, number | undefined>>()
  })

  it('getCache() with a fallback returns the event type', () => {
    const emitter = new Emitter<Events>({ cachedEvents: ['count'] })
    const value = emitter.getCache('count', 0)

    expectType<Equal<typeof value, number>>()
  })

  it('getCache() rejects a fallback of the wrong type', () => {
    const emitter = new Emitter<Events>()

    // @ts-expect-error - fallback must match the event type
    emitter.getCache('count', 'zero')
  })

  it('listen() returns event and clearListener only', () => {
    const emitter = new Emitter<Events>()
    const listener = emitter.listen('user', () => undefined)

    expectType<Equal<typeof listener, { event: 'user'; clearListener: () => void }>>()
  })

  it('clearAll() returns void', () => {
    const emitter = new Emitter<Events>()
    const result = emitter.clearAll()

    expectType<Equal<typeof result, void>>()
  })

  it('useEventListener() types follow getCache()', () => {
    const emitter = new ReactEmitter<Events>()

    // Not rendered: only the inferred types are checked
    const withoutFallback = () => emitter.useEventListener('count')
    const withFallback = () => emitter.useEventListener('count', 0)

    expectType<Equal<ReturnType<typeof withoutFallback>, number | undefined>>()
    expectType<Equal<ReturnType<typeof withFallback>, number>>()
  })
})
