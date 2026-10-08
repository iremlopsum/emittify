import { useEffect, useState } from 'react'

import BaseEmitter from '../index.js'

class Emitter<
  EventsType extends Record<keyof EventsType, EventsType[keyof EventsType]>,
> extends BaseEmitter<EventsType> {
  useEventListener = <K extends keyof EventsType, V extends EventsType[K] | undefined>(key: K, fallbackValue?: V) => {
    // Lazy initializer, so a function payload is stored as a value rather than called by React
    const [value, setValue] = useState<EventsType[K]>(() => this.getCache(key, fallbackValue as EventsType[K]))

    useEffect(() => {
      // Wrapped in an updater, so a function payload is stored as a value rather than called by React
      const listener = this.listen(key, next => setValue(() => next))

      return () => {
        listener.clearListener()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])

    return value
  }
}

export default Emitter
