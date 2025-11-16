import { motion } from 'motion/react'
import { Code2, Database, GitCompare, Zap, Webhook, TestTube } from 'lucide-react'

const features = [
  {
    icon: Code2,
    emoji: '🎯',
    title: 'TypeScript First',
    description: 'Full autocomplete and type safety for all your events',
  },
  {
    icon: Database,
    emoji: '💾',
    title: 'Caching',
    description: 'Initial values for new listeners, no missed events',
  },
  {
    icon: GitCompare,
    emoji: '🔄',
    title: 'Deduplication',
    description: 'Deep and shallow comparison to prevent duplicate events',
  },
  {
    icon: Zap,
    emoji: '⚡',
    title: 'Tiny',
    description: '~2KB gzipped, zero dependencies',
  },
  {
    icon: Webhook,
    emoji: '🪝',
    title: 'React Hooks',
    description: 'Built-in useEventListener hook for seamless integration',
  },
  {
    icon: TestTube,
    emoji: '🧪',
    title: 'Test Ready',
    description: 'Jest mocking support out of the box',
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-center mb-4">Powerful Features</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Everything you need for event-driven architecture
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group">
              <div className="h-full bg-linear-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-8 border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                <div className="mb-4 text-4xl">{feature.emoji}</div>
                <h3 className="mb-3 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
