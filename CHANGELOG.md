# Changelog

## 2.0.0

### 🧭 Migrating from 1.x

| 1.x                                                                   | 2.0.0                                                                                                                                      |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `listener.id`, `emitter.clear(id)`                                    | Use the `clearListener()` returned by `listen()`                                                                                           |
| `clearAll()` removed listeners only and returned a `Map`              | Removes listeners, cached values and deduplication state; returns `void`                                                                   |
| A throwing listener stopped later listeners and threw out of `send()` | Other listeners still run; `send()` doesn't throw; the error is re-thrown in a microtask                                                   |
| `getCache(key)` typed as `T`                                          | Typed as `T \| undefined`; `getCache(key, fallback)` is `T`                                                                                |
| `useEventListener(key)` typed as `T`                                  | Typed as `T \| undefined`; with a fallback it is `T`                                                                                       |
| React `>=16.8`                                                        | React `>=18` (the hook uses `useSyncExternalStore`)                                                                                        |
| CommonJS-looking package, Node `>=18`                                 | ESM-only (`"type": "module"`), Node `^20.19.0 \|\| >=22.12.0`; `require()` works via `require(esm)` and returns the namespace (`.default`) |
| `require('@iremlopsum/emittify/mock.js')` / `mock.js` path            | `@iremlopsum/emittify/mock` (file is `mock.cjs`)                                                                                           |
| Mock needed a global `jest`                                           | Pass a spy factory (`new EmittifyMock(vi.fn)`) or rely on `jest.fn` / a global `vi.fn`                                                     |

### ⚠️ Behaviour changes

- A listener added during a `send()` only receives later sends (previously it also received the current one). A
  listener cleared during a `send()` is not called.
- The same callback registered twice is called twice, and each registration is cleared on its own.
- `useEventListener()`: changing the event name behaves like a fresh mount (the new event's cached value or the
  fallback, never the previous event's value), and `send(key, undefined)` shows the fallback, matching `getCache()`.
- Deep comparison now compares `Map` and `Set` contents (previously any two Maps or Sets were equal) and objects from
  another realm such as jsdom or iframes.

### ✨ Improvements

- Zero runtime dependencies: `fast-deep-equal` is replaced by an inlined comparison.
- Smaller: core 1,243 → 894 B gzip, core + React 1,588 → 1,079 B (esbuild, minified).
- `@iremlopsum/emittify/react` now loads in plain Node ESM, not only through bundlers.
- `useEventListener()` is tear-free under concurrent rendering and has a server snapshot for SSR.
- The mock gains `useEventListener`, TypeScript types, Vitest support and sensible default return values.
- Empty listener sets are dropped, so dynamic event names no longer leak memory.
- Strict TypeScript, ES2020 output.

## 1.1.0

### ⚠️ Behaviour changes

- **A cached `undefined` now means "no value".** After `send(key, undefined)`, `getCache(key, fallback)` returns
  `fallback` (previously `undefined`), and `listen(key, cb)` does not replay `undefined` to new listeners. Use
  `send(key, undefined)` to clear a cached event. Live listeners still receive every `send()`, including `undefined`.
- **Falsy cached values are now replayed.** `listen()` replays a cached `0`, `false`, `''` or `null` to new listeners.
  Previously these were silently skipped.

### 🐛 Fixes

- `useEventListener()` starts from a cached `0`, `false`, `''` or `null` instead of the fallback value.
- `useEventListener()` stores function payloads as values instead of calling them as React state updaters.
- `useEventListener()` re-subscribes when the event name changes.
- Removed an accidental dependency of the package on itself.

### 📦 Packaging

- `react` is now an optional peer dependency (`>=16.8.0`). The core entry point has no React dependency, so non-React
  projects no longer get React auto-installed (npm 7+) or an unmet-peer warning (yarn). `@iremlopsum/emittify/react`
  is unchanged.
