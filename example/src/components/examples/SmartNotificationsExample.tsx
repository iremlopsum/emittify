import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AlertCircle, CheckCircle, Info, Zap } from 'lucide-react'

import { Button } from '../ui/button'
import { ExampleWrapper } from '../ExampleWrapper'

import { exampleEmitter } from '../../../events'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  timestamp: number
}

export function SmartNotificationsExample() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [attempted, setAttempted] = useState(0)
  const [emitted, setEmitted] = useState(0)
  const toastId = useRef(0)

  // Listen for notification events from Emittify
  useEffect(() => {
    const listener = exampleEmitter.listen('notification', notification => {
      // Event was emitted (passed deduplication)
      setEmitted(prev => prev + 1)

      // Generate id and timestamp when displaying, not when sending
      const newToast: Toast = {
        id: toastId.current++,
        message: notification.message,
        type: notification.type,
        timestamp: Date.now(),
      }

      setToasts(prev => [...prev, newToast])

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id))
      }, 3000)
    })

    return () => listener.clearListener()
  }, [])

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    setAttempted(prev => prev + 1)

    // Send through Emittify - deduplication compares only message and type
    exampleEmitter.send('notification', {
      message,
      type,
    })
  }

  const spamNotifications = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        addToast('Duplicate notification!', 'info')
      }, i * 100)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'error':
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-300'
      case 'error':
        return 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-300'
      default:
        return 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-300'
    }
  }

  return (
    <ExampleWrapper
      title="🔔 Smart Notifications"
      subtitle="Deep deduplication prevents notification spam"
      badge="DEDUPLICATION">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => addToast('Operation successful!', 'success')}
            className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-white">
            Success Toast
          </Button>
          <Button
            onClick={() => addToast('Something went wrong', 'error')}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-white">
            Error Toast
          </Button>
          <Button
            onClick={() => addToast('Here is some info', 'info')}
            className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-white">
            Info Toast
          </Button>
          <Button
            onClick={spamNotifications}
            className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <Zap className="mr-2 h-4 w-4" />
            Spam Test
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Attempted</div>
            <div className="text-3xl text-gray-300">{attempted}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Emitted</div>
            <div className="text-3xl text-purple-300">{emitted}</div>
          </div>
        </div>

        {/* Toast Container */}
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none max-w-sm">
          <AnimatePresence>
            {toasts.map(toast => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                className={`bg-gradient-to-br ${getColors(
                  toast.type,
                )} rounded-lg p-4 border shadow-lg pointer-events-auto`}>
                <div className="flex items-start gap-3">
                  {getIcon(toast.type)}
                  <div className="flex-1">
                    <div className="text-sm">{toast.message}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="bg-[#1e1e2e] rounded-lg p-4 border border-gray-700">
          <code className="text-sm text-gray-300">
            <span className="text-purple-400">new</span> <span className="text-yellow-400">Emittify</span>({'{'}
            {'\n'}
            {'  '}
            <span className="text-cyan-400">deduplicatedEvents</span>: [{'{'}{' '}
            <span className="text-cyan-400">event</span>: <span className="text-green-400">'notification'</span>,{' '}
            <span className="text-cyan-400">comparison</span>: <span className="text-green-400">'deep'</span> {'}'}]
            {'\n'}
            {'}'})
          </code>
        </div>
      </div>
    </ExampleWrapper>
  )
}
