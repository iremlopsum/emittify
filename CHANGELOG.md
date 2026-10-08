# Changelog

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
