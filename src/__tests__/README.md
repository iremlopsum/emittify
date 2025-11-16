# Emittify Test Suite

This directory contains comprehensive tests for the emittify library.

## Test Structure

```
__tests__/
├── index.test.ts              # Core Emitter class tests
├── react/
│   └── index.test.tsx         # React integration tests
├── mock.test.js               # Mock module tests
├── test-utils.ts              # General test utilities
├── react-test-utils.tsx       # React-specific test utilities
└── README.md                  # This file
```

## Running Tests

### Run all tests
```bash
yarn test
```

### Run tests in watch mode
```bash
yarn test:watch
```

### Run tests with coverage
```bash
yarn test:coverage
```

### Run specific test file
```bash
yarn test index.test.ts
```

### Run tests matching a pattern
```bash
yarn test --testNamePattern="send()"
```

## Test Coverage

The test suite aims for 90%+ coverage across all areas:

- **Core Emitter**: 100% coverage of all methods and edge cases
- **React Integration**: Full coverage of hooks and lifecycle
- **Mock Module**: Complete API compatibility testing
- **TypeScript Types**: Type safety verification

## Test Categories

### 1. Core Emitter Tests (`index.test.ts`)

Tests for the base Emitter class including:
- Constructor & initialization
- `send()` method
- `listen()` method
- `getCache()` method
- `clear()` method
- `clearAll()` method
- `clearCache()` method
- `clearAllCache()` method
- Integration scenarios
- Edge cases

### 2. React Integration Tests (`react/index.test.tsx`)

Tests for React hooks:
- `useEventListener()` hook
- Component lifecycle
- Memory leak prevention
- Multiple components
- Cache integration

### 3. Mock Tests (`mock.test.js`)

Tests for the Jest mock module:
- Mock structure
- Method availability
- Call tracking
- Integration with `jest.mock()`

## Test Utilities

### General Utilities (`test-utils.ts`)

- `createTestEmitter()` - Create emitter with type safety
- `createMockCallback()` - Create typed mock callbacks
- `waitForNextTick()` - Async helper
- `createMultipleListeners()` - Create many listeners at once
- `testCacheBehavior()` - Test cache functionality
- `testListenerLifecycle()` - Test listener lifecycle
- And more...

### React Utilities (`react-test-utils.tsx`)

- `createTestComponent()` - Create test components
- `renderAndGetText()` - Render and query helper
- `testHookUpdate()` - Test hook updates
- `createCounterComponent()` - Common counter pattern
- `testCachedValueRestoration()` - Test cache with React
- And more...

## Using Test Utilities

### Example: Testing Core Emitter

```typescript
import { createTestEmitter, createMockCallback, testCacheBehavior } from './test-utils'

it('should cache events', () => {
  interface Events {
    'counter': number
  }
  
  const emitter = createTestEmitter<Events>({ cachedEvents: ['counter'] })
  testCacheBehavior(emitter, 'counter', 42, 0)
})
```

### Example: Testing React Integration

```typescript
import { createTestComponent, renderAndGetText } from './react-test-utils'

it('should update component', async () => {
  const emitter = new Emitter<{ count: number }>()
  const TestComponent = createTestComponent(emitter, 'count', 0)
  const { getText } = renderAndGetText(TestComponent)
  
  expect(getText()).toBe('0')
  
  act(() => emitter.send('count', 5))
  
  await waitFor(() => {
    expect(getText()).toBe('5')
  })
})
```

## Best Practices

1. **Always use TypeScript interfaces** for event types
2. **Use test utilities** to reduce boilerplate
3. **Test edge cases** (null, undefined, errors)
4. **Test memory leaks** for React components
5. **Test type safety** where applicable
6. **Use descriptive test names** that explain what's being tested
7. **Group related tests** using `describe()` blocks
8. **Clean up** listeners and components after tests

## Debugging Tests

### Run tests with verbose output
```bash
yarn test --verbose
```

### Run tests with debugging
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Check test coverage
```bash
yarn test:coverage
open coverage/lcov-report/index.html
```

## CI/CD Integration

Tests are automatically run on:
- Every pull request
- Every push to main branch
- Before releases

Coverage thresholds are enforced:
- Branches: 90%
- Functions: 90%
- Lines: 90%
- Statements: 90%

## Adding New Tests

When adding new features:

1. Write tests first (TDD approach)
2. Ensure tests cover happy path and edge cases
3. Add tests to appropriate file
4. Use existing test utilities where possible
5. Update this README if adding new test categories

## Common Issues

### Tests timing out
- Increase timeout: `jest.setTimeout(10000)`
- Use `waitFor()` for async operations

### Memory leak warnings
- Always call `unmount()` on rendered components
- Clear listeners in cleanup

### Type errors
- Ensure event interfaces match exactly
- Use type assertions sparingly

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library Documentation](https://testing-library.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

