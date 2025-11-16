# Emittify Refactoring Guide for Example Components

This guide explains how to refactor example components from React state management to Emittify event emitters. Follow this pattern when converting other example components.

## 📋 Overview

The example website demonstrates Emittify's capabilities through interactive examples. However, many examples currently use plain React `useState` hooks. This guide shows how to properly showcase Emittify by using it internally within these examples.

## 🎯 Goals

1. **Showcase the Library**: Examples should actually use Emittify, not just show code snippets
2. **Type Safety**: Maintain TypeScript type safety throughout
3. **Reusability**: Share event definitions across components
4. **Clarity**: Make it obvious how Emittify improves the code

## 🏗️ Architecture

### Centralized Events File

All example events are defined in a single file: `example/events/index.ts`

**Benefits:**

- Single source of truth for event types
- Easy to see all events at a glance
- Prevents duplicate event names
- Shared emitter instance across components

**Structure:**

```typescript
// example/events/index.ts
import Emitter from '@colorfy-software/emittify/react'

// Define all event types in one interface
interface ExampleEvents {
  // Event name: payload type
  'mouse-position': { x: number; y: number; timestamp: number }
  theme: 'light' | 'dark' | 'auto'
  notification: { id: number; message: string; type: string }
  // ... more events
}

// Create and export the emitter instance
export const exampleEmitter = new Emitter<ExampleEvents>({
  // Configure which events should be cached
  cachedEvents: ['theme', 'user-preferences'],

  // Configure which events should be deduplicated
  deduplicatedEvents: [
    { event: 'mouse-position', comparison: 'shallow' },
    { event: 'theme', comparison: 'shallow' },
  ],
})
```

## 🔄 Refactoring Pattern

### Before: Plain React State

```typescript
export function ExampleComponent() {
  const [value, setValue] = useState(initialValue)
  const [count, setCount] = useState(0)

  const handleUpdate = newValue => {
    setValue(newValue)
    setCount(prev => prev + 1)
  }

  return (
    <div>
      <div>Value: {value}</div>
      <div>Updates: {count}</div>
      <button onClick={() => handleUpdate('new')}>Update</button>
    </div>
  )
}
```

### After: With Emittify

```typescript
import { exampleEmitter } from '../../events'

export function ExampleComponent() {
  // Use the hook to subscribe to events
  const value = exampleEmitter.useEventListener('some-event', initialValue)
  const [count, setCount] = useState(0)

  const handleUpdate = newValue => {
    // Send event through Emittify
    exampleEmitter.send('some-event', newValue)
    setCount(prev => prev + 1)
  }

  return (
    <div>
      <div>Value: {value}</div>
      <div>Updates: {count}</div>
      <button onClick={() => handleUpdate('new')}>Update</button>
    </div>
  )
}
```

## 📝 Step-by-Step Refactoring Process

### Step 1: Identify State to Migrate

**Migrate to Emittify when:**

- ✅ State represents data that could be shared
- ✅ State changes frequently (demonstrates event emission)
- ✅ State updates should be tracked (event count)
- ✅ State benefits from caching or deduplication

**Keep as React state when:**

- ❌ Pure UI state (modals, dropdowns open/closed)
- ❌ Temporary/transient state
- ❌ State that doesn't demonstrate Emittify features

### Step 2: Add Event Types

Add your event types to `example/events/index.ts`:

```typescript
interface ExampleEvents {
  // Existing events...

  // Your new event
  'your-event-name': YourPayloadType
}
```

### Step 3: Configure Emitter (if needed)

If your event benefits from caching or deduplication:

```typescript
export const exampleEmitter = new Emitter<ExampleEvents>({
  cachedEvents: [
    'theme',
    'your-cached-event', // Add here
  ],

  deduplicatedEvents: [
    { event: 'mouse-position', comparison: 'shallow' },
    { event: 'your-event', comparison: 'deep' }, // Add here
  ],
})
```

**Choose comparison type:**

- `'shallow'`: For primitives or flat objects (faster)
- `'deep'`: For nested objects or arrays (thorough)

### Step 4: Replace useState with useEventListener

**Before:**

```typescript
const [value, setValue] = useState(initialValue)
```

**After:**

```typescript
import { exampleEmitter } from '../../events'

const value = exampleEmitter.useEventListener('your-event', initialValue)
```

### Step 5: Replace State Updates with send()

**Before:**

```typescript
setValue(newValue)
```

**After:**

```typescript
exampleEmitter.send('your-event', newValue)
```

### Step 6: Keep Event Counters as React State

Event counters demonstrate emission frequency and should remain as React state:

```typescript
const [eventCount, setEventCount] = useState(0)

const handleAction = () => {
  exampleEmitter.send('your-event', data)
  setEventCount(prev => prev + 1) // Keep this!
}
```

## 🎨 Example: MouseTrailExample Refactoring

### Original State Management

```typescript
const [particles, setParticles] = useState<Particle[]>([])
const [eventCount, setEventCount] = useState(0)
const lastPosition = useRef({ x: 0, y: 0 })

const handleMouseMove = (e: React.MouseEvent) => {
  // ... position calculation ...

  lastPosition.current = { x, y }
  setEventCount(prev => prev + 1)

  setParticles(prev => [...prev, newParticle])
}
```

### Refactored with Emittify

```typescript
// In events/index.ts
interface ExampleEvents {
  'mouse-position': { x: number; y: number; timestamp: number }
  'mouse-particles': Particle[]
}

// In component
const particles = exampleEmitter.useEventListener('mouse-particles', [])
const position = exampleEmitter.useEventListener('mouse-position', { x: 0, y: 0, timestamp: 0 })
const [eventCount, setEventCount] = useState(0)

const handleMouseMove = (e: React.MouseEvent) => {
  // ... position calculation ...

  const newPosition = { x, y, timestamp: Date.now() }
  exampleEmitter.send('mouse-position', newPosition)
  setEventCount(prev => prev + 1)

  const newParticles = [...particles, newParticle]
  exampleEmitter.send('mouse-particles', newParticles)
}
```

## 💡 Best Practices

### 1. Event Naming Convention

Use kebab-case and be descriptive:

- ✅ `'mouse-position'`, `'user-preferences'`, `'notification-added'`
- ❌ `'pos'`, `'data'`, `'update'`

### 2. Type Safety

Always define payload types explicitly:

```typescript
// ✅ Good - explicit type
'notification': { id: number; message: string; type: 'info' | 'error' | 'success' }

// ❌ Bad - any type
'notification': any
```

### 3. Deduplication Strategy

**Use shallow comparison for:**

- Primitives (string, number, boolean)
- Flat objects with primitive values
- Performance-critical events

**Use deep comparison for:**

- Nested objects
- Arrays of objects
- Complex data structures

### 4. Caching Decision

Cache events when:

- New subscribers need immediate values (theme, user settings)
- State persists across component mounts
- Initial value is important for UX

Don't cache:

- Transient events (clicks, hovers)
- Events that represent actions, not state
- High-frequency events where only latest matters

## 🚀 Benefits Showcased

Each refactored example should demonstrate specific Emittify features:

| Example       | Feature Demonstrated                         |
| ------------- | -------------------------------------------- |
| MouseTrail    | Event emission frequency, real-time updates  |
| LiveStats     | Caching - new subscribers get instant values |
| ThemeSync     | Caching - shared state across components     |
| ApiPolling    | Deduplication - prevent redundant updates    |
| FormSync      | Event coordination across multiple inputs    |
| Notifications | Event queuing and handling                   |

## 🔍 Testing Checklist

After refactoring, verify:

- [ ] TypeScript types are correct (no `any` types)
- [ ] Component behavior is identical to before
- [ ] Event counter increments correctly
- [ ] Deduplication works if configured
- [ ] Caching works if configured
- [ ] Code example at bottom reflects actual usage
- [ ] Console has no errors or warnings

## 📚 Additional Resources

- [Emittify Documentation](../README.md)
- [Core Library Source](../src/index.ts)
- [React Hook Source](../src/react/index.ts)
- [Example Tests](../src/__tests__/examples.test.ts)

## 🤔 When to Ask for Help

If you encounter:

- Complex state interdependencies
- Performance issues after refactoring
- Unclear whether state should use Emittify
- Type errors that don't make sense

Open a discussion or ask in team chat!

---

**Remember:** The goal is to showcase Emittify's power while keeping the code clean and maintainable. Each example should teach developers something valuable about event-driven architecture.
