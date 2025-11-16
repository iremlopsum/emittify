/// <reference types="@testing-library/jest-dom" />

declare namespace jest {
  interface Matchers<R> {
    toHaveTextContent(text: string): R
  }
}

