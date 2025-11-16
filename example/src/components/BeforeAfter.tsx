import { motion } from 'motion/react'
import { X, Check } from 'lucide-react'

export function BeforeAfter() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-center mb-4">Before & After</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Say goodbye to prop drilling and context complexity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-red-900/20 rounded-xl p-8 border border-red-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-red-300">Before: Prop Drilling</h3>
            </div>

            <div className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-800">
              <pre className="text-sm overflow-x-auto">
                <code className="text-gray-300">
                  <span className="text-purple-400">function</span> <span className="text-yellow-400">App</span>() {'{'}
                  {'\n'}
                  {'  '}
                  <span className="text-cyan-400">const</span> [count, setCount] ={' '}
                  <span className="text-cyan-400">useState</span>(<span className="text-orange-400">0</span>){'\n'}
                  {'  '}
                  <span className="text-purple-400">return</span> {'<'}
                  <span className="text-yellow-400">Parent</span> count={'{'}count{'}'} /{'>'}
                  {'\n'}
                  {'}'}
                  {'\n'}
                  {'\n'}
                  <span className="text-purple-400">function</span> <span className="text-yellow-400">Parent</span>(
                  {'{'} count {'}'}) {'{'}
                  {'\n'}
                  {'  '}
                  <span className="text-purple-400">return</span> {'<'}
                  <span className="text-yellow-400">Child</span> count={'{'}count{'}'} /{'>'}
                  {'\n'}
                  {'}'}
                  {'\n'}
                  {'\n'}
                  <span className="text-purple-400">function</span> <span className="text-yellow-400">Child</span>({'{'}{' '}
                  count {'}'}) {'{'}
                  {'\n'}
                  {'  '}
                  <span className="text-purple-400">return</span> {'<'}
                  <span className="text-yellow-400">GrandChild</span> count={'{'}count{'}'} /{'>'}
                  {'\n'}
                  {'}'}
                  {'\n'}
                  {'\n'}
                  <span className="text-purple-400">function</span> <span className="text-yellow-400">GrandChild</span>(
                  {'{'} count {'}'}) {'{'}
                  {'\n'}
                  {'  '}
                  <span className="text-purple-400">return</span> {'<'}div{'>'}
                  {'{'}count{'}'}
                  {'<'}/div{'>'}
                  {'\n'}
                  {'}'}
                </code>
              </pre>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-red-300">
                <X className="h-4 w-4" />
                Props passed through every level
              </div>
              <div className="flex items-center gap-2 text-sm text-red-300">
                <X className="h-4 w-4" />
                Tight coupling between components
              </div>
              <div className="flex items-center gap-2 text-sm text-red-300">
                <X className="h-4 w-4" />
                Hard to maintain and refactor
              </div>
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-green-900/20 rounded-xl p-8 border border-green-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-green-300">After: Emittify</h3>
            </div>

            <div className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-800">
              <pre className="text-sm overflow-x-auto">
                <code className="text-gray-300">
                  <span className="text-purple-400">function</span> <span className="text-yellow-400">App</span>() {'{'}
                  {'\n'}
                  {'  '}
                  <span className="text-cyan-400">const</span> [count, setCount] ={' '}
                  <span className="text-cyan-400">useState</span>(<span className="text-orange-400">0</span>){'\n'}
                  {'  '}emitter.<span className="text-cyan-400">send</span>(
                  <span className="text-green-400">'count'</span>, count){'\n'}
                  {'  '}
                  <span className="text-purple-400">return</span> {'<'}
                  <span className="text-yellow-400">Parent</span> /{'>'}
                  {'\n'}
                  {'}'}
                  {'\n'}
                  {'\n'}
                  <span className="text-purple-400">function</span> <span className="text-yellow-400">Parent</span>(){' '}
                  {'{'}
                  {'\n'}
                  {'  '}
                  <span className="text-purple-400">return</span> {'<'}
                  <span className="text-yellow-400">Child</span> /{'>'}
                  {'\n'}
                  {'}'}
                  {'\n'}
                  {'\n'}
                  <span className="text-purple-400">function</span> <span className="text-yellow-400">Child</span>(){' '}
                  {'{'}
                  {'\n'}
                  {'  '}
                  <span className="text-purple-400">return</span> {'<'}
                  <span className="text-yellow-400">GrandChild</span> /{'>'}
                  {'\n'}
                  {'}'}
                  {'\n'}
                  {'\n'}
                  <span className="text-purple-400">function</span> <span className="text-yellow-400">GrandChild</span>
                  () {'{'}
                  {'\n'}
                  {'  '}
                  <span className="text-cyan-400">const</span> count = emitter.
                  <span className="text-cyan-400">useEventListener</span>(
                  <span className="text-green-400">'count'</span>, <span className="text-orange-400">0</span>){'\n'}
                  {'  '}
                  <span className="text-purple-400">return</span> {'<'}div{'>'}
                  {'{'}count{'}'}
                  {'<'}/div{'>'}
                  {'\n'}
                  {'}'}
                </code>
              </pre>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-300">
                <Check className="h-4 w-4" />
                Direct communication between components
              </div>
              <div className="flex items-center gap-2 text-sm text-green-300">
                <Check className="h-4 w-4" />
                Loose coupling, better architecture
              </div>
              <div className="flex items-center gap-2 text-sm text-green-300">
                <Check className="h-4 w-4" />
                Easy to maintain and scale
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
