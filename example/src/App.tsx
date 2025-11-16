import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emitter from './emitter'

function App() {
  const counter = emitter.useEventListener('counter', 0)
  const theme = emitter.useEventListener('theme', { theme: 'light' })
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: string }>>([])

  // Listen for notifications
  emitter.listen('notification', (data) => {
    const id = Math.random().toString(36)
    setNotifications(prev => [...prev, { id, ...data }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  })

  const isDark = theme.theme === 'dark'

  const incrementCounter = () => {
    emitter.send('counter', counter + 1)
    emitter.send('notification', { 
      message: `Counter increased to ${counter + 1}!`, 
      type: 'success' 
    })
  }

  const decrementCounter = () => {
    emitter.send('counter', Math.max(0, counter - 1))
    if (counter > 0) {
      emitter.send('notification', { 
        message: `Counter decreased to ${counter - 1}`, 
        type: 'info' 
      })
    } else {
      emitter.send('notification', { 
        message: 'Counter cannot go below 0!', 
        type: 'warning' 
      })
    }
  }

  const resetCounter = () => {
    emitter.send('counter', 0)
    emitter.send('notification', { 
      message: 'Counter reset!', 
      type: 'error' 
    })
  }

  const toggleTheme = () => {
    emitter.send('theme', { theme: isDark ? 'light' : 'dark' })
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'
    }`}>
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className={`px-4 py-3 rounded-lg shadow-lg ${
                notification.type === 'success' ? 'bg-green-500' :
                notification.type === 'error' ? 'bg-red-500' :
                notification.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              } text-white font-medium`}
            >
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🛩 Emittify Demo
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            A tiny event emitter with React hooks, animations & Tailwind CSS
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Counter Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-8 shadow-xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">Counter Example</h2>
            
            <motion.div
              key={counter}
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-center mb-8"
            >
              <div className={`text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}>
                {counter}
              </div>
            </motion.div>

            <div className="flex gap-3 flex-wrap justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={decrementCounter}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold shadow-lg hover:bg-red-600 transition-colors"
              >
                Decrement
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetCounter}
                className={`px-6 py-3 ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
                } rounded-lg font-semibold shadow-lg transition-colors`}
              >
                Reset
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={incrementCounter}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold shadow-lg hover:bg-green-600 transition-colors"
              >
                Increment
              </motion.button>
            </div>
          </motion.div>

          {/* Features Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className={`rounded-2xl p-8 shadow-xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2 className="text-2xl font-bold mb-6">Features</h2>
            
            <div className="space-y-4">
              {[
                { icon: '🎯', text: 'Type-safe events', color: 'from-blue-500 to-cyan-500' },
                { icon: '💾', text: 'Event caching', color: 'from-purple-500 to-pink-500' },
                { icon: '🎨', text: 'Deduplication', color: 'from-green-500 to-emerald-500' },
                { icon: '⚛️', text: 'React hooks', color: 'from-orange-500 to-red-500' },
                { icon: '✨', text: 'Framer Motion', color: 'from-yellow-500 to-orange-500' },
                { icon: '🎭', text: 'Tailwind CSS', color: 'from-indigo-500 to-blue-500' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <span className="text-3xl">{feature.icon}</span>
                  <span className={`font-semibold text-lg bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Theme Toggle Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className={`rounded-2xl p-8 shadow-xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } md:col-span-2`}
          >
            <h2 className="text-2xl font-bold mb-6">Theme Switcher</h2>
            
            <div className="flex items-center justify-center gap-6">
              <span className="text-4xl">{isDark ? '🌙' : '☀️'}</span>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-colors ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                }`}
              >
                Switch to {isDark ? 'Light' : 'Dark'} Mode
              </motion.button>
              
              <span className="text-4xl">{isDark ? '✨' : '🌟'}</span>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className={`mt-8 p-4 rounded-lg ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}
            >
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>Try this:</strong> The theme is cached! Refresh the page and your preference will be remembered. 
                This demonstrates Emittify's caching and deduplication features.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <p className={`${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Built with Vite + React + Tailwind CSS + Framer Motion
          </p>
          <p className={`mt-2 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
            Check the console to see event emissions in action! 🚀
          </p>
        </motion.footer>
      </div>
    </div>
  )
}

export default App

