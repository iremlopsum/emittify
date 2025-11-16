import { motion } from 'motion/react'

import { Badge } from './ui/badge'

interface ExampleWrapperProps {
  title: string
  subtitle: string
  badge: string
  children: React.ReactNode
}

export function ExampleWrapper({ title, subtitle, badge, children }: ExampleWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-xl p-8 border border-gray-800">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h3>{title}</h3>
          <Badge className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/30 text-purple-300">
            {badge}
          </Badge>
        </div>
        <p className="text-gray-400">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  )
}
