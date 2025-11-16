import { motion } from 'motion/react'
import { useState, useEffect, useRef } from 'react'

import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { ExampleWrapper } from '../ExampleWrapper'

import { exampleEmitter } from '../../../events'
import { SPRING_CONFIG } from '../../constants/animations'

export function ScrollParallaxExample() {
  const scrollData = exampleEmitter.useEventListener('scroll-position', { y: 0, progress: 0 })
  const [eventCount, setEventCount] = useState(0)
  const [throttle, setThrottle] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastEmit = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollHeight = container.scrollHeight - container.clientHeight
      const progress = (container.scrollTop / scrollHeight) * 100
      const y = container.scrollTop

      if (throttle) {
        const now = Date.now()
        if (now - lastEmit.current < 50) return // 50ms throttle
        lastEmit.current = now
      }

      exampleEmitter.send('scroll-position', { y, progress })
      setEventCount(prev => prev + 1)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [throttle])

  const bgOpacity = scrollData.progress / 100
  const bgPosition = scrollData.progress * 2

  return (
    <ExampleWrapper
      title="🌊 Scroll Parallax"
      subtitle="High-frequency scroll events with optional throttling"
      badge="INTERACTIVE">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm">
              <span className="text-gray-400">Scroll Progress:</span>{' '}
              <span className="text-cyan-400">{scrollData.progress.toFixed(1)}%</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Events emitted:</span>{' '}
              <span className="text-purple-400">{eventCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="throttle" checked={throttle} onCheckedChange={setThrottle} />
            <Label htmlFor="throttle" className="text-sm text-gray-400">
              Throttle (50ms)
            </Label>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-purple-500 via-cyan-500 to-pink-500"
            style={{ width: `${scrollData.progress}%` }}
            transition={{ ...SPRING_CONFIG, duration: 0.1 }}
          />
        </div>

        {/* Scrollable Container */}
        <div
          ref={containerRef}
          className="relative h-96 overflow-y-scroll rounded-lg border border-gray-700"
          style={{
            background: `linear-gradient(180deg, rgba(139, 92, 246, ${bgOpacity * 0.2}) 0%, rgba(6, 182, 212, ${
              bgOpacity * 0.3
            }) ${bgPosition}%, rgba(236, 72, 153, ${bgOpacity * 0.2}) 100%)`,
          }}>
          <div className="p-8 space-y-8">
            {[...Array(10)].map((_, i) => {
              const offset = ((scrollData.progress - i * 10) / 100) * 50
              return (
                <motion.div
                  key={i}
                  style={{
                    transform: `translateY(${offset}px)`,
                  }}
                  className="bg-gray-800/70 rounded-lg p-6 border border-gray-700 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full"
                      style={{
                        background: `linear-gradient(${i * 36}deg, #8b5cf6, #06b6d4)`,
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="mb-2">Parallax Element {i + 1}</h4>
                      <p className="text-sm text-gray-400">
                        This element moves at a different speed as you scroll, creating a parallax effect. Offset:{' '}
                        {offset.toFixed(1)}px
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="bg-[#1e1e2e] rounded-lg p-4 border border-gray-700">
          <code className="text-sm text-gray-300 whitespace-pre">
            <span className="text-gray-500">// High-frequency scroll events with deduplication</span>
            {'\n'}
            emitter.<span className="text-cyan-400">send</span>(
            <span className="text-green-400">'scroll-position'</span>, {'{'} y:{' '}
            <span className="text-orange-400">{scrollData.y.toFixed(0)}</span>, progress:{' '}
            <span className="text-orange-400">{scrollData.progress.toFixed(1)}</span> {'}'})
          </code>
        </div>
      </div>
    </ExampleWrapper>
  )
}
