import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, MessageSquare, User, Bell } from 'lucide-react'

import { Button } from '../ui/button'
import { ExampleWrapper } from '../ExampleWrapper'

import { exampleEmitter } from '../../../events'
import { SUBSCRIBER_CARD_MOTION, HOVER_SCALE_MEDIUM, SPRING_CONFIG } from '../../constants/animations'

interface Subscriber {
  id: number
}

// Subscriber component that uses Emittify hooks to demonstrate caching
function SubscriberCard({ id, onRemove }: { id: number; onRemove: (id: number) => void }) {
  // Each subscriber uses the hook independently - they receive cached values immediately!
  const messages = exampleEmitter.useEventListener('stats-messages', 42)
  const users = exampleEmitter.useEventListener('stats-users', 128)
  const alerts = exampleEmitter.useEventListener('stats-alerts', 7)

  return (
    <motion.div
      {...SUBSCRIBER_CARD_MOTION}
      transition={SPRING_CONFIG}
      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 relative group">
      <button
        onClick={() => onRemove(id)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
        ×
      </button>
      <div className="text-xs text-gray-500 mb-2">Subscriber #{id.toString().slice(-4)}</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Messages:</span>
          <span className="text-purple-300">{messages}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Users:</span>
          <span className="text-cyan-300">{users}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Alerts:</span>
          <span className="text-pink-300">{alerts}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-green-400">✓ Received cached values on mount</div>
    </motion.div>
  )
}

export function LiveStatsExample() {
  // Using Emittify hooks to manage stats - these are cached events
  const messages = exampleEmitter.useEventListener('stats-messages', 42)
  const users = exampleEmitter.useEventListener('stats-users', 128)
  const alerts = exampleEmitter.useEventListener('stats-alerts', 7)

  // Keep subscribers list as React state (UI-only)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])

  const addSubscriber = () => {
    const newSub: Subscriber = {
      id: Date.now(),
    }
    setSubscribers(prev => [...prev, newSub])
  }

  const removeSubscriber = (id: number) => {
    setSubscribers(prev => prev.filter(s => s.id !== id))
  }

  return (
    <ExampleWrapper
      title="📊 Live Stats Dashboard"
      subtitle="Cached events ensure new subscribers get instant values"
      badge="CACHING">
      <div className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={HOVER_SCALE_MEDIUM}
            transition={SPRING_CONFIG}
            className="bg-linear-to-br from-purple-500/20 to-purple-600/10 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <span className="text-gray-400">Messages</span>
            </div>
            <div className="text-4xl mb-4 text-purple-300">{messages}</div>
            <Button
              size="sm"
              onClick={() => exampleEmitter.send('stats-messages', messages + 1)}
              className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-white">
              Increment
            </Button>
          </motion.div>

          <motion.div
            whileHover={HOVER_SCALE_MEDIUM}
            transition={SPRING_CONFIG}
            className="bg-linear-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg p-6 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-5 w-5 text-cyan-400" />
              <span className="text-gray-400">Users</span>
            </div>
            <div className="text-4xl mb-4 text-cyan-300">{users}</div>
            <Button
              size="sm"
              onClick={() => exampleEmitter.send('stats-users', users + 1)}
              className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-white">
              Increment
            </Button>
          </motion.div>

          <motion.div
            whileHover={HOVER_SCALE_MEDIUM}
            transition={SPRING_CONFIG}
            className="bg-linear-to-br from-pink-500/20 to-pink-600/10 rounded-lg p-6 border border-pink-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="h-5 w-5 text-pink-400" />
              <span className="text-gray-400">Alerts</span>
            </div>
            <div className="text-4xl mb-4 text-pink-300">{alerts}</div>
            <Button
              size="sm"
              onClick={() => exampleEmitter.send('stats-alerts', alerts + 1)}
              className="w-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-white">
              Increment
            </Button>
          </motion.div>
        </div>

        {/* Add Subscriber Button */}
        <div className="flex justify-center">
          <Button
            onClick={addSubscriber}
            className="bg-linear-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Subscriber
          </Button>
        </div>

        {/* Subscribers - each uses Emittify hooks independently */}
        <AnimatePresence>
          {subscribers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {subscribers.map(sub => (
                <SubscriberCard key={sub.id} id={sub.id} onRemove={removeSubscriber} />
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="bg-[#1e1e2e] rounded-lg p-4 border border-gray-700">
          <code className="text-sm text-gray-300 whitespace-pre">
            <span className="text-purple-400">const</span> messages = emitter.
            <span className="text-cyan-400">useEventListener</span>(
            <span className="text-green-400">'stats-messages'</span>, 42){'\n'}
            emitter.<span className="text-cyan-400">send</span>(<span className="text-green-400">'stats-messages'</span>
            , {messages}){'\n'}
            <span className="text-gray-500">// New subscribers instantly get cached value!</span>
          </code>
        </div>
      </div>
    </ExampleWrapper>
  )
}
