import { motion } from 'motion/react'
import { Github, Package } from 'lucide-react'

import { Button } from './ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full blur-[128px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="mb-6">
            <span className="text-6xl inline-block">🛩</span>
          </div>

          <h1 className="mb-6 bg-linear-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Emittify
          </h1>

          <p className="mb-4 text-gray-300">A Tiny Event Emitter</p>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">TypeScript-first with caching & deduplication</p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Button>
            <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800">
              <Package className="mr-2 h-5 w-5" />
              npm Package
            </Button>
          </div>

          {/* Animated code snippet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto">
            <div className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-800 shadow-2xl">
              <pre className="text-left text-sm overflow-x-auto">
                <code className="text-gray-300">
                  <span className="text-purple-400">import</span> Emittify <span className="text-purple-400">from</span>{' '}
                  <span className="text-green-400">'@colorfy-software/emittify'</span>
                  {'\n'}
                  {'\n'}
                  <span className="text-cyan-400">const</span> emitter = <span className="text-purple-400">new</span>{' '}
                  <span className="text-yellow-400">Emittify</span>(){'\n'}
                  {'\n'}
                  <span className="text-gray-500">// Send events</span>
                  {'\n'}
                  emitter.<span className="text-cyan-400">send</span>(
                  <span className="text-green-400">'user-login'</span>, {'{'} userId:{' '}
                  <span className="text-orange-400">123</span> {'}'}){'\n'}
                  {'\n'}
                  <span className="text-gray-500">// Listen for events</span>
                  {'\n'}
                  emitter.<span className="text-cyan-400">listen</span>(
                  <span className="text-green-400">'user-login'</span>, (data) {'=> {'}
                  {'\n'}
                  {'  '}console.<span className="text-cyan-400">log</span>(data.userId){'\n'}
                  {'}'})
                </code>
              </pre>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
