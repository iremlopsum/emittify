# Testing Guide for Emittify

This document provides a comprehensive guide to testing the emittify library.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [Test Utilities](#test-utilities)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## 🚀 Quick Start

### Install Dependencies

```bash
yarn install
```

### Run Tests

```bash
# Run all tests
yarn test

# Run with coverage
yarn test:coverage

# Run in watch mode
yarn test:watch
```

## 📁 Test Structure

```
src/__tests__/
├── index.test.ts              # Core Emitter tests (130+ tests)
├── react/
│   └── index.test.tsx         # React integration tests (20+ tests)
├── mock.test.js               # Mock module tests (15+ tests)
├── examples.test.ts           # Example tests using utilities
├── test-utils.ts              # General test utilities
├── react-test-utils.tsx       # React-specific utilities
└── README.md                  # Test documentation
```

## 🧪 Test Coverage

Current test coverage goals:

| Area | Target | Tests |
|------|--------|-------|
| Core Emitter | 100% | 130+ |
| React Integration | 100% | 20+ |
| Mock Module | 100% | 15+ |
| **Overall** | **90%+** | **165+** |

### Coverage Thresholds

```javascript
{
  branches: 90,
  functions: 90,
  lines: 90,
  statements: 90
}
```

## 🏃 Running Tests

### Basic Commands

```bash
# All tests
yarn test

# With coverage report
yarn test:coverage

# Watch mode for development
yarn test:watch

# Specific test file
yarn test index.test.ts

# Tests matching pattern
yarn test --testNamePattern="send()"

# Verbose output
yarn test --verbose

# Update snapshots
yarn test -u
```

### Debug Tests

```bash
# With Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# With VS Code
# Add breakpoint and press F5 (with Jest debug config)
```

## ✍️ Writing Tests

### Basic Test Structure

```typescript
import Emitter from '../index'

describe('Feature Name', () => {
  describe('Method Name', () => {
    it('should do something specific', () => {
      // Arrange
      interface Events {
        'test-event': string
      }
      const emitter = new Emitter<Events>()
      
      // Act
      const callback = jest.fn()
      emitter.listen('test-event', callback)
      emitter.send('test-event', 'test-value')
      
      // Assert
      expect(callback).toHaveBeenCalledWith('test-value')
    })
  })
})
```

### Using Test Utilities

```typescript
import {
  createTestEmitter,
  createMockCallback,
  testCacheBehavior,
  testListenerLifecycle,
} from './test-utils'

it('should cache events correctly', () => {
  interface Events {
    'counter': number
  }
  
  const emitter = createTestEmitter<Events>({ cachedEvents: ['counter'] })
  testCacheBehavior(emitter, 'counter', 42, 0)
})
```

### React Component Tests

```typescript
import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import Emitter from '../react/index'

it('should update component on event', async () => {
  interface Events {
    'count': number
  }
  const emitter = new Emitter<Events>()
  
  const Component = () => {
    const count = emitter.useEventListener('count', 0)
    return <div data-testid="count">{count}</div>
  }
  
  render(<Component />)
  
  act(() => {
    emitter.send('count', 5)
  })
  
  await waitFor(() => {
    expect(screen.getByTestId('count')).toHaveTextContent('5')
  })
})
```

## 🛠 Test Utilities

### General Utilities (`test-utils.ts`)

| Utility | Description |
|---------|-------------|
| `createTestEmitter<T>()` | Create typed emitter instance |
| `createMockCallback<T>()` | Create typed mock callback |
| `waitForNextTick()` | Wait for next event loop tick |
| `createMultipleListeners()` | Create multiple listeners at once |
| `testCacheBehavior()` | Test caching functionality |
| `testListenerLifecycle()` | Test listener lifecycle |
| `createStressTestScenario()` | Create stress test with many events |
| `testDataGenerators` | Generate random test data |

### React Utilities (`react-test-utils.tsx`)

| Utility | Description |
|---------|-------------|
| `createTestComponent()` | Create test component with hook |
| `renderAndGetText()` | Render and query helper |
| `testHookUpdate()` | Test hook value updates |
| `createCounterComponent()` | Create counter test component |
| `createMessageComponent()` | Create message test component |
| `testCachedValueRestoration()` | Test cache with React |
| `createMemoryLeakTest()` | Test for memory leaks |

### Example Usage

See `src/__tests__/examples.test.ts` for comprehensive examples of:
- Basic emitter usage
- Multiple listeners
- Stress testing
- Real-world scenarios (notifications, state management, forms)

## 🔄 CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Before releases

### Workflow

```yaml
# .github/workflows/test.yml
- Test on Node 20.x, 22.x and 24.x
- Run full test suite
- Generate coverage report
- Upload coverage to Codecov
- Build verification
```

### Status Badges

Add to README:

```markdown
![Tests](https://github.com/colorfy-software/emittify/workflows/Test/badge.svg)
[![codecov](https://codecov.io/gh/colorfy-software/emittify/branch/main/graph/badge.svg)](https://codecov.io/gh/colorfy-software/emittify)
```

## 📝 Best Practices

### 1. Test Organization

- ✅ Group related tests with `describe()`
- ✅ Use descriptive test names
- ✅ Follow Arrange-Act-Assert pattern
- ✅ One assertion per test (when possible)

### 2. Type Safety

```typescript
// ✅ Good - Type-safe
interface Events {
  'user-login': { userId: number }
}
const emitter = new Emitter<Events>()

// ❌ Bad - No types
const emitter = new Emitter()
```

### 3. Cleanup

```typescript
// ✅ Good - Cleanup after test
afterEach(() => {
  emitter.clearAll()
  jest.clearAllMocks()
})

// ❌ Bad - No cleanup
// Tests may interfere with each other
```

### 4. React Testing

```typescript
// ✅ Good - Proper async handling
await waitFor(() => {
  expect(screen.getByTestId('value')).toHaveTextContent('5')
})

// ❌ Bad - Not waiting for updates
expect(screen.getByTestId('value')).toHaveTextContent('5')
```

### 5. Memory Leaks

```typescript
// ✅ Good - Cleanup listener
const listener = emitter.listen('event', callback)
// ... test code ...
listener.clearListener()

// ✅ Good - Unmount component
const { unmount } = render(<Component />)
// ... test code ...
unmount()
```

### 6. Mock Usage

```typescript
// ✅ Good - Use mock utilities
const callback = createMockCallback<string>()

// ✅ Good - Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})
```

## 🐛 Troubleshooting

### Tests Timing Out

```typescript
// Increase timeout
jest.setTimeout(10000)

// Or per test
it('slow test', async () => {
  // test code
}, 10000)
```

### Memory Warnings

```typescript
// Always cleanup
afterEach(() => {
  component?.unmount()
  listener?.clearListener()
})
```

### Type Errors

```typescript
// Ensure event interfaces match
interface Events {
  'event': string // Not number
}

emitter.send('event', 'string') // ✅ Good
emitter.send('event', 123)      // ❌ Type error
```

### Async Issues

```typescript
// ✅ Use act() for state updates
act(() => {
  emitter.send('event', value)
})

// ✅ Use waitFor() for async checks
await waitFor(() => {
  expect(element).toBeInTheDocument()
})
```

## 📊 Viewing Coverage Reports

### Generate Report

```bash
yarn test:coverage
```

### View HTML Report

```bash
# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html

# Windows
start coverage/lcov-report/index.html
```

### Coverage Formats

- `coverage/lcov-report/` - HTML report
- `coverage/lcov.info` - LCOV format
- `coverage/coverage-final.json` - JSON format
- `coverage/clover.xml` - Clover format

## 🎯 Test Checklist

When adding new features, ensure:

- [ ] Unit tests for core functionality
- [ ] Integration tests for interactions
- [ ] Edge cases covered (null, undefined, errors)
- [ ] React tests if applicable
- [ ] Type safety tests
- [ ] Memory leak tests for React
- [ ] Documentation updated
- [ ] Coverage threshold maintained (90%+)

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [TypeScript Testing](https://www.typescriptlang.org/docs/handbook/testing.html)

## 🤝 Contributing Tests

When contributing tests:

1. Follow existing patterns
2. Use test utilities where possible
3. Ensure tests are deterministic
4. Add comments for complex scenarios
5. Update documentation if needed

## 📞 Support

For testing questions or issues:
- Open an issue on GitHub
- Check existing tests for examples
- Review test utilities documentation

---

**Happy Testing! 🎉**

