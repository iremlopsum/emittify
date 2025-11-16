import { motion } from 'motion/react'
import { useState, useRef, useEffect } from 'react'

import { ExampleWrapper } from '../ExampleWrapper'

import { exampleEmitter, type Particle } from '../../../events'
import { PARTICLE_MOTION, EASE_OUT_TRANSITION } from '../../constants/animations'

export function MouseTrailExample() {
  // Using Emittify hooks to manage particles and position
  const particles = exampleEmitter.useEventListener('mouse-particles', [])
  const position = exampleEmitter.useEventListener('mouse-position', { x: 0, y: 0, timestamp: 0 })

  // Keep UI state and counters as React state
  const [eventCount, setEventCount] = useState(0)

  const canvasRef = useRef<HTMLDivElement>(null)
  const particleId = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // Clean up old particles by emitting filtered array
      const activeParticles = particles.filter((p: Particle) => Date.now() - p.timestamp < 2000)
      if (activeParticles.length !== particles.length) {
        exampleEmitter.send('mouse-particles', activeParticles)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [particles])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const timestamp = Date.now()

    // Emit position through Emittify (deduplication handled by library)
    exampleEmitter.send('mouse-position', { x, y, timestamp })
    setEventCount(prev => prev + 1)

    // Emit updated particles array through Emittify
    const newParticle: Particle = {
      id: particleId.current++,
      x,
      y,
      timestamp,
    }
    exampleEmitter.send('mouse-particles', [...particles, newParticle])
  }

  return (
    <ExampleWrapper
      title="🌟 Mouse Trail"
      subtitle="Real-time event emission with particle effects"
      badge="INTERACTIVE">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-400">Events sent:</span> <span className="text-cyan-400">{eventCount}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Active particles:</span>{' '}
            <span className="text-purple-400">{particles.length}</span>
          </div>
        </div>

        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          className="relative bg-linear-to-br from-gray-900/80 to-gray-800/50 rounded-lg border border-gray-700 overflow-hidden cursor-crosshair"
          style={{ height: '500px' }}>
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">
            Move your mouse to create particles
          </div>
          {particles.map((particle: Particle) => {
            const age = Date.now() - particle.timestamp
            const opacity = 1 - age / 2000
            const scale = 1 - age / 4000

            return (
              <motion.div
                key={particle.id}
                {...PARTICLE_MOTION}
                transition={EASE_OUT_TRANSITION}
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
          <code className="text-sm text-gray-300 whitespace-pre">
            <span className="text-purple-400">const</span> particles = emitter.
            <span className="text-cyan-400">useEventListener</span>(
            <span className="text-green-400">'mouse-particles'</span>, []){'\n'}
            <span className="text-purple-400">const</span> position = emitter.
            <span className="text-cyan-400">useEventListener</span>(
            <span className="text-green-400">'mouse-position'</span>){'\n'}
            emitter.<span className="text-cyan-400">send</span>(<span className="text-green-400">'mouse-position'</span>
            , {'{'} x: <span className="text-orange-400">{position.x.toFixed(0)}</span>, y:{' '}
            <span className="text-orange-400">{position.y.toFixed(0)}</span> {'}'})
          </code>
        </div>
      </div>
    </ExampleWrapper>
  )
}
