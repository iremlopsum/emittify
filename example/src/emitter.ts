import Emittify from 'emittify/react'

export interface NotificationData {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export interface ThemeData {
  theme: 'light' | 'dark'
}

interface EventsType {
  'notification': NotificationData
  'counter': number
  'theme': ThemeData
  'animation-trigger': { id: string; animate: boolean }
}

const emitter = new Emittify<EventsType>({
  cachedEvents: ['counter', 'theme'],
  deduplicatedEvents: [
    { event: 'counter', comparison: 'shallow' },
    { event: 'theme', comparison: 'deep' },
  ],
})

export default emitter

