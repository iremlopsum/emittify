/// <reference types="@testing-library/jest-dom" />
/// <reference types="jest" />

import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent(text: string): R
    }
  }
}

// Extend testing library types
declare module '@testing-library/react' {
  export * from '@testing-library/react'
  export function waitFor<T = void>(
    callback: () => T | Promise<T>,
    options?: {
      timeout?: number
      interval?: number
    }
  ): Promise<T>
  
  export const screen: {
    getByTestId: (id: string) => HTMLElement
    queryByTestId: (id: string) => HTMLElement | null
    findByTestId: (id: string) => Promise<HTMLElement>
  }
  
  export function act(callback: () => void | Promise<void>): Promise<void>
}

