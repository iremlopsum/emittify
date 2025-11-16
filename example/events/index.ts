/**
 * Centralized Emittify event definitions for example website
 *
 * This file contains all event types and the shared emitter instance
 * used across the example components to demonstrate Emittify's capabilities.
 */

import Emitter from 'emittify/react'

/**
 * Particle type for mouse trail visualization
 */
export interface Particle {
  id: number
  x: number
  y: number
  timestamp: number
}

/**
 * All events used in the example website
 * Event names use kebab-case convention
 * Each event has a typed payload for type safety
 */
export interface ExampleEvents {
  // Mouse Trail Example
  'mouse-position': { x: number; y: number; timestamp: number }
  'mouse-particles': Particle[]

  // Live Stats Example (for future refactoring)
  'stats-messages': number
  'stats-users': number
  'stats-alerts': number

  // Theme Sync Example (for future refactoring)
  theme: 'light' | 'dark' | 'auto'

  // Form Sync Example (for future refactoring)
  'form-state': {
    name: string
    email: string
    message: string
    isValid: boolean
  }

  // API Polling Example - two events to demonstrate deduplication
  'api-data-deduped': { value: number; status: string }
  'api-data-no-dedup': { value: number; status: string }

  // Smart Notifications Example - only message and type for deduplication
  notification: {
    message: string
    type: 'info' | 'success' | 'error'
  }

  // Scroll Parallax Example (for future refactoring)
  'scroll-position': {
    y: number
    progress: number
  }
}

/**
 * Shared emitter instance for all example components
 *
 * Configuration:
 * - cachedEvents: Events that should retain their last value for new subscribers
 * - deduplicatedEvents: Events that should only emit when values actually change
 */
export const exampleEmitter = new Emitter<ExampleEvents>({
  // Cached events - new subscribers immediately receive the last emitted value
  cachedEvents: [
    'theme', // Theme should persist for new components
    'stats-messages', // Dashboard stats should show current values
    'stats-users',
    'stats-alerts',
    'form-state', // Form state should persist
    'api-data-deduped', // API data should show last fetched values
    'api-data-no-dedup', // Non-deduplicated API data
  ],

  // Deduplicated events - only emit when values actually change
  deduplicatedEvents: [
    // Mouse position: shallow comparison (flat object with primitives)
    { event: 'mouse-position', comparison: 'shallow' },

    // Particles: deep comparison (array of objects)
    { event: 'mouse-particles', comparison: 'deep' },

    // Theme: shallow comparison (primitive string)
    { event: 'theme', comparison: 'shallow' },

    // Stats: shallow comparison (primitives)
    { event: 'stats-messages', comparison: 'shallow' },
    { event: 'stats-users', comparison: 'shallow' },
    { event: 'stats-alerts', comparison: 'shallow' },

    // Form state: deep comparison (nested validation state)
    { event: 'form-state', comparison: 'deep' },

    // API data: deep comparison - only the deduplicated version
    { event: 'api-data-deduped', comparison: 'deep' },

    // Notification: deep comparison (prevents duplicate toast spam)
    { event: 'notification', comparison: 'deep' },

    // Scroll: shallow comparison (flat object)
    { event: 'scroll-position', comparison: 'shallow' },
  ],
})
