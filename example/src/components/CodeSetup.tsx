import { motion } from 'motion/react'

import { FADE_UP_VIEW_MOTION, SPRING_CONFIG } from '../constants/animations'

export function CodeSetup() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div {...FADE_UP_VIEW_MOTION} viewport={{ once: true }} transition={{ ...SPRING_CONFIG, duration: 0.6 }}>
          <h2 className="text-center mb-4">Quick Setup</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            TypeScript-first configuration with full type safety
          </p>

          <div className="bg-[#1e1e2e] rounded-xl p-8 border border-gray-800 shadow-2xl">
            <pre className="text-sm overflow-x-auto">
              <code className="text-gray-300">
                <span className="text-purple-400">import</span> Emittify <span className="text-purple-400">from</span>{' '}
                <span className="text-green-400">'@colorfy-software/emittify/react'</span>
                {'\n'}
                {'\n'}
                <span className="text-gray-500">// Define your events interface</span>
                {'\n'}
                <span className="text-purple-400">interface</span> <span className="text-yellow-400">Events</span> {'{'}
                {'\n'}
                {'  '}
                <span className="text-cyan-400">'mouse-position'</span>: {'{'} x:{' '}
                <span className="text-yellow-400">number</span>; y: <span className="text-yellow-400">number</span>{' '}
                {'}'}
                {'\n'}
                {'  '}
                <span className="text-cyan-400">'message-count'</span>: <span className="text-yellow-400">number</span>
                {'\n'}
                {'  '}
                <span className="text-cyan-400">toast</span>: {'{'} message:{' '}
                <span className="text-yellow-400">string</span>; type: <span className="text-yellow-400">string</span>{' '}
                {'}'}
                {'\n'}
                {'}'}
                {'\n'}
                {'\n'}
                <span className="text-gray-500">// Create emitter with configuration</span>
                {'\n'}
                <span className="text-cyan-400">const</span> emitter = <span className="text-purple-400">new</span>{' '}
                <span className="text-yellow-400">Emittify</span>
                {'<'}
                <span className="text-yellow-400">Events</span>
                {'>'}({'{'}
                {'\n'}
                {'  '}
                <span className="text-gray-500">// Cache these events for late subscribers</span>
                {'\n'}
                {'  '}
                <span className="text-cyan-400">cachedEvents</span>: [
                <span className="text-green-400">'message-count'</span>],{'\n'}
                {'\n'}
                {'  '}
                <span className="text-gray-500">// Deduplicate these events</span>
                {'\n'}
                {'  '}
                <span className="text-cyan-400">deduplicatedEvents</span>: [{'\n'}
                {'    '}
                {'{'} <span className="text-cyan-400">event</span>: <span className="text-green-400">'toast'</span>,{' '}
                <span className="text-cyan-400">comparison</span>: <span className="text-green-400">'deep'</span> {'}'},
                {'\n'}
                {'  '}],{'\n'}
                {'}'}){'\n'}
                {'\n'}
                <span className="text-gray-500">// Use in React components</span>
                {'\n'}
                <span className="text-cyan-400">const</span> count = emitter.
                <span className="text-cyan-400">useEventListener</span>(
                <span className="text-green-400">'message-count'</span>, <span className="text-orange-400">0</span>)
                {'\n'}
                {'\n'}
                <span className="text-gray-500">// Send events anywhere</span>
                {'\n'}
                emitter.<span className="text-cyan-400">send</span>(
                <span className="text-green-400">'message-count'</span>, <span className="text-orange-400">10</span>)
                {'\n'}
                {'\n'}
                <span className="text-gray-500">// Listen outside React</span>
                {'\n'}
                <span className="text-cyan-400">const</span> unsubscribe = emitter.
                <span className="text-cyan-400">listen</span>(<span className="text-green-400">'message-count'</span>,
                (data) {'=> {'}
                {'\n'}
                {'  '}console.<span className="text-cyan-400">log</span>(
                <span className="text-green-400">'New count:'</span>, data){'\n'}
                {'}'}){'\n'}
                {'\n'}
                <span className="text-gray-500">// Clean up</span>
                {'\n'}
                <span className="text-cyan-400">unsubscribe</span>()
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
