import { motion } from 'motion/react'
import { useState, useRef, useEffect } from 'react'

import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { ExampleWrapper } from '../ExampleWrapper'

interface Particle {
  id: number
  x: number
  y: number
  timestamp: number
}

export function MouseTrailExample() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [eventCount, setEventCount] = useState(0)
  const [deduplication, setDeduplication] = useState(true)
  const canvasRef = useRef<HTMLDivElement>(null)
  const lastPosition = useRef({ x: 0, y: 0 })
  const particleId = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.timestamp < 2000))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Deduplication logic (only if positions change significantly)
    if (deduplication) {
      const dx = Math.abs(x - lastPosition.current.x)
      const dy = Math.abs(y - lastPosition.current.y)
      if (dx < 5 && dy < 5) return
    }

    lastPosition.current = { x, y }
    setEventCount(prev => prev + 1)

    setParticles(prev => [
      ...prev,
      {
        id: particleId.current++,
        x,
        y,
        timestamp: Date.now(),
      },
    ])
  }

  return (
    <ExampleWrapper
      title="🌟 Mouse Trail"
      subtitle="Real-time event emission with particle effects"
      badge="INTERACTIVE">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-400">Events sent:</span> <span className="text-cyan-400">{eventCount}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Active particles:</span>{' '}
              <span className="text-purple-400">{particles.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="dedup-trail" checked={deduplication} onCheckedChange={setDeduplication} />
            <Label htmlFor="dedup-trail" className="text-sm text-gray-400">
              Deduplication
            </Label>
          </div>
        </div>

        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-lg border border-gray-700 overflow-hidden cursor-crosshair"
          style={{ height: '500px' }}>
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">
            Move your mouse to create particles
          </div>
          {particles.map(particle => {
            const age = Date.now() - particle.timestamp
            const opacity = 1 - age / 2000
            const scale = 1 - age / 4000

            return (
              <motion.div
                key={particle.id}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 0 }}
                transition={{ duration: 2, ease: 'easeOut' }}
                className="absolute w-6 h-6 rounded-full pointer-events-none"
                style={{
                  left: particle.x - 12,
                  top: particle.y - 12,
                  background: `radial-gradient(circle, rgba(139, 92, 246, ${opacity}), rgba(6, 182, 212, ${
                    opacity * 0.5
                  }), transparent)`,
                  boxShadow: `0 0 20px rgba(139, 92, 246, ${opacity * 0.8})`,
                  transform: `scale(${scale})`,
                }}
              />
            )
          })}
        </div>

        <div className="bg-[#1e1e2e] rounded-lg p-4 border border-gray-700">
          <code className="text-sm text-gray-300">
            <span className="text-cyan-400">emitter.send</span>(<span className="text-green-400">'mouse-position'</span>
            , {'{'} x: <span className="text-orange-400">{lastPosition.current.x.toFixed(0)}</span>, y:{' '}
            <span className="text-orange-400">{lastPosition.current.y.toFixed(0)}</span> {'}'})
          </code>
        </div>
      </div>
    </ExampleWrapper>
  )
}
