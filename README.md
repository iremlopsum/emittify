<h1 align="center">
  <a href="https://github.com/colorfy-software/emittify/" target="_blank" rel="noopener noreferrer">
    🛩 Emittify
  </a>
</h1>

<h4 align="center">
  <strong>A tiny event emitter.</strong>
</h4>

<p align="center">
  <a href="https://www.npmjs.org/package/@colorfy-software/emittify">
    <img src="https://badge.fury.io/js/@colorfy-software%2Femittify.svg" alt="Current npm package version." />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
</p>

## 🎯 Purpose

Emittify is a tiny event emitter written with first class Typescript support.
It supports caching, event deduplication, and has hooks for both React and Solid.

## 🏗️ Installation

```sh
yarn add @colorfy-software/emittify
```

## 💻 Usage

### 🆕 Creating an Emitter with types

```ts
// events-core.ts

// Import the emittify module.
import Emittify from '@colorfy-software/emittify'
// Importing toast notification component props type to use in the emittify module.
import type { ToastNotificationPropsType } from '@components/ToastNotification'

// Type for the emitter key is the name of the event and value is the type of the event.
interface EventsType {
  'direct-message-count': number
  'toast-notification': ToastNotificationPropsType
}

const emitter = new Emittify<EventsType>({
  // Cache is used to cache events and provide initial values to new listeners
  cachedEvents: ['direct-message-count'],

  // Deduplication prevents emitting events when values haven't changed
  deduplicatedEvents: [
    { event: 'direct-message-count', comparison: 'shallow' }, // For primitives/simple objects
    { event: 'toast-notification', comparison: 'deep' }, // For nested objects
  ],
})

export default emitter
```

### 📧 Sending and listening to events

```ts
// File where you want to use it
import emitter from './events-core'

// Register a listener for the 'toast-notification' event.
emitter.listen('toast-notification', data => {
  const { message, type } = data // All is typed and auto-completed

  console.log({ message, type })
}

// Emit the 'toast-notification' event.
// All is typed and auto-completed.
emitter.send('toast-notification', {
  message: 'Hello World',
  type: 'success'
}

// Emit the 'direct-message-count' event.
emitter.send('direct-message-count', 10)

// Get the cached event.
const cachedEvent = emitter.getCache('direct-message-count', 0) // Can provide second argument as default value if none is sent yet.
```

### 🎛️ Event Deduplication

Event deduplication prevents redundant emissions when the same value is sent multiple times. This is useful for reducing unnecessary re-renders, network calls, or other side effects.

#### Why Use Deduplication?

- **Performance**: Avoid triggering listeners when data hasn't actually changed
- **Spam Prevention**: Prevent rapid identical events from flooding your system
- **React Optimization**: Reduce unnecessary component re-renders
- **Network Efficiency**: Skip redundant API calls or state updates

#### Comparison Strategies

##### 🔍 Deep Comparison

Deep comparison recursively checks all nested properties. Use for complex objects and arrays.

```ts
interface EventsType {
  'user-profile': {
    id: number
    name: string
    settings: { theme: string; notifications: boolean }
  }
}

const emitter = new Emittify<EventsType>({
  deduplicatedEvents: [{ event: 'user-profile', comparison: 'deep' }],
})

// First send always emits
emitter.send('user-profile', {
  id: 1,
  name: 'John',
  settings: { theme: 'dark', notifications: true },
}) // ✅ Emitted

// Same nested values - blocked
emitter.send('user-profile', {
  id: 1,
  name: 'John',
  settings: { theme: 'dark', notifications: true },
}) // ❌ Blocked

// Changed nested value - emitted
emitter.send('user-profile', {
  id: 1,
  name: 'John',
  settings: { theme: 'light', notifications: true },
}) // ✅ Emitted (theme changed)
```

##### 📏 Shallow Comparison

Shallow comparison only checks first-level properties. Faster, but doesn't detect nested changes.

```ts
interface EventsType {
  counter: number
  status: { active: boolean; count: number }
}

const emitter = new Emittify<EventsType>({
  deduplicatedEvents: [
    { event: 'counter', comparison: 'shallow' },
    { event: 'status', comparison: 'shallow' },
  ],
})

// Primitives work the same as deep comparison
emitter.send('counter', 5) // ✅ Emitted
emitter.send('counter', 5) // ❌ Blocked
emitter.send('counter', 10) // ✅ Emitted

// Shallow only checks top-level properties
emitter.send('status', { active: true, count: 5 }) // ✅ Emitted
emitter.send('status', { active: true, count: 5 }) // ❌ Blocked (same values)
emitter.send('status', { active: false, count: 5 }) // ✅ Emitted (active changed)
```

#### When to Use Which Strategy?

| Use Case                             | Strategy  | Why                                  |
| ------------------------------------ | --------- | ------------------------------------ |
| Primitives (string, number, boolean) | `shallow` | Faster, works the same as deep       |
| Flat objects                         | `shallow` | 10x faster than deep                 |
| Nested objects                       | `deep`    | Detects changes in nested properties |
| Arrays                               | `deep`    | Compares array contents              |
| Large objects (>1000 keys)           | `shallow` | Better performance                   |

#### Working with Cached Events

Deduplication works seamlessly with caching:

```ts
const emitter = new Emittify<EventsType>({
  cachedEvents: ['counter'],
  deduplicatedEvents: [{ event: 'counter', comparison: 'shallow' }],
})

emitter.send('counter', 5) // ✅ Emitted and cached
emitter.send('counter', 5) // ❌ Blocked, but cache still updated

// New listeners get cached value
emitter.listen('counter', callback) // Receives 5 immediately
```

#### Clearing Deduplication State

Sometimes you want to reset deduplication to force re-emission:

```ts
// Clear for specific event
emitter.clearDeduplicationCache('counter')
emitter.send('counter', 5) // ✅ Will emit even if 5 was the previous value

// Clear for all events
emitter.clearAllDeduplicationCache()
```

#### Real-World Examples

##### API Polling with Deduplication

```ts
interface EventsType {
  'api-data': { users: User[]; timestamp: number }
}

const emitter = new Emittify<EventsType>({
  cachedEvents: ['api-data'],
  deduplicatedEvents: [{ event: 'api-data', comparison: 'deep' }],
})

// Poll API every 5 seconds
setInterval(async () => {
  const data = await fetchFromAPI()
  // Only emits if data actually changed
  emitter.send('api-data', data)
}, 5000)
```

##### Form State Management

```ts
interface EventsType {
  'form-state': { name: string; email: string; isValid: boolean }
}

const emitter = new Emittify<EventsType>({
  deduplicatedEvents: [{ event: 'form-state', comparison: 'deep' }],
})

// Multiple rapid updates
input.addEventListener('input', () => {
  const state = getFormState()
  // Only emits when state actually changes
  emitter.send('form-state', state)
})
```

### 🧪 Testing with Jest

If you don't already have a Jest setup file configured, please add the following to your [Jest configuration file](https://jestjs.io/docs/configuration) and create the new `jest.setup.js` file in project root:

```js
setupFiles: ['<rootDir>/jest.setup.js']
```

You can then add the following line to that setup file to mock the `NativeModule.RNPermissions`:

```js
jest.mock('@colorfy-software/emittify', () => require('@colorfy-software/emittify/mock'))
```

### 🪝 Hooks

#### React

```ts
import Emittify from '@colorfy-software/emittify/react'
```

#### Solid

```ts
import Emittify from '@colorfy-software/emittify/solid'
```

#### Usage

```tsx
// import previously created emitter
import emitter from '../core/events-core.ts'

const Component = () => {
  // Can provide second argument as default value if none is sent yet. Will as well return cached value as initial value if an event was previously sent and cached
  const count = emitter.useEventListener('direct-message-count', 0)

  return <button onClick={() => emitter.send('direct-message-count', 100)}>{count}</button>
}
```

### 🗂 Methods

#### `send()`

```ts
// Send an event with specified name and value.
emittify.send('event-name', value)
```

#### `listen()`

```ts
// Listen to events with specified name and triggers a callback on each event.
const listener = emittify.listen('event-name', callback)

// Listener is an object.
listener.id // Unique id for the listener
listener.event // Name of the event
listener.clearListener() // Clears the listener
```

#### `useEventListener()`

```ts
// Emits an event with specified name and value. Returns cached value if one exists, otherwise returns initial value if that is provided.
emittify.useEventListener('event-name', initialValue)
```

#### `getCache()`

```ts
// Gets the cached value for event name.
emittify.getCache('event-name', initialValue)
```

#### `clearCache()`

```ts
// Clears cache for given event name.
emittify.clearCache('event-name')
```

#### `clearAllCache()`

```ts
// Clears all of the cache.
emittify.clearAllCache()
```

#### `clear()`

```ts
// Clears listeners for given listener id.
emittify.clear('listener-id')
```

#### `clearDeduplicationCache()`

```ts
// Clears the previous value for a specific deduplicated event.
// The next send will always emit since there's no previous value to compare.
emittify.clearDeduplicationCache('event-name')
```

#### `clearAllDeduplicationCache()`

```ts
// Clears all previous values for deduplicated events.
// Next sends will always emit since there are no previous values to compare.
emittify.clearAllDeduplicationCache()
```

## 💖 Code of Conduct

This library has adopted a Code of Conduct that we expect project participants to adhere to. Please read the [full text](https://github.com/colorfy-software/localify/blob/master/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## 📰 License

localify is licensed under the [MIT License](https://github.com/colorfy-software/localify/blob/master/LICENSE).
