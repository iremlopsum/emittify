import { motion } from 'motion/react'
import { Package, Zap, Shield, Star } from 'lucide-react'

import { Badge } from './ui/badge'

export function Metrics() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-center mb-4">Performance Metrics</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Built for production, optimized for developer experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-6 border border-purple-500/30 text-center">
            <Package className="h-8 w-8 mx-auto mb-3 text-purple-400" />
            <div className="text-3xl mb-2 text-purple-300">~2KB</div>
            <div className="text-sm text-gray-400">Gzipped Size</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-xl p-6 border border-cyan-500/30 text-center">
            <Zap className="h-8 w-8 mx-auto mb-3 text-cyan-400" />
            <div className="text-3xl mb-2 text-cyan-300">{'<1ms'}</div>
            <div className="text-sm text-gray-400">Event Emission</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 rounded-xl p-6 border border-pink-500/30 text-center">
            <Shield className="h-8 w-8 mx-auto mb-3 text-pink-400" />
            <div className="text-3xl mb-2 text-pink-300">100%</div>
            <div className="text-sm text-gray-400">Type Safe</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-6 border border-green-500/30 text-center">
            <Star className="h-8 w-8 mx-auto mb-3 text-green-400" />
            <div className="text-3xl mb-2 text-green-300">Zero</div>
            <div className="text-sm text-gray-400">Dependencies</div>
          </motion.div>
        </div>

        {/* Bundle Size Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-8 border border-gray-800">
          <h3 className="mb-8 text-center">Bundle Size Comparison</h3>

          <div className="space-y-4">
            {[
              { name: 'Emittify', size: 2, color: 'from-purple-500 to-pink-500' },
              { name: 'EventEmitter3', size: 3.2, color: 'from-blue-500 to-cyan-500' },
              { name: 'mitt', size: 0.4, color: 'from-green-500 to-emerald-500' },
              { name: 'Redux', size: 11.3, color: 'from-red-500 to-orange-500' },
              { name: 'Zustand', size: 3.7, color: 'from-yellow-500 to-amber-500' },
            ].map((lib, index) => (
              <motion.div
                key={lib.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-400">{lib.name}</div>
                <div className="flex-1 h-8 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(lib.size / 12) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${lib.color} flex items-center justify-end pr-3`}>
                    <span className="text-xs">{lib.size}KB</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            * All sizes are gzipped. Emittify offers the best balance of features and size.
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mt-12">
          <Badge className="bg-gray-800 border-gray-700">
            <img src="https://img.shields.io/npm/v/@colorfy-software/emittify.svg" alt="npm version" className="h-5" />
          </Badge>
          <Badge className="bg-gray-800 border-gray-700">
            <img src="https://img.shields.io/npm/dm/@colorfy-software/emittify.svg" alt="downloads" className="h-5" />
          </Badge>
          <Badge className="bg-gray-800 border-gray-700">
            <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license" className="h-5" />
          </Badge>
          <Badge className="bg-gray-800 border-gray-700">
            <img src="https://img.shields.io/badge/typescript-100%25-blue.svg" alt="typescript" className="h-5" />
          </Badge>
        </motion.div>
      </div>
    </section>
  )
}
