// Import jest-dom matchers
// Note: Install @testing-library/jest-dom if you need these matchers
// import '@testing-library/jest-dom'

// Add custom jest matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
  toHaveTextContent(element, text) {
    const pass = element.textContent === text
    if (pass) {
      return {
        message: () => `expected element not to have text content "${text}"`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected element to have text content "${text}" but got "${element.textContent}"`,
        pass: false,
      }
    }
  },
})

// Global test setup
global.beforeEach(() => {
  jest.clearAllMocks()
})
