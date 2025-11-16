import { useState } from 'react'
import { motion } from 'motion/react'
import { Copy, Check } from 'lucide-react'

import { Button } from './ui/button'

export function Installation() {
  const [copied, setCopied] = useState(false)
  const installCommand = 'yarn add @colorfy-software/emittify'

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h2 className="text-center mb-8">Installation</h2>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-[#1e1e2e] rounded-lg p-6 border border-gray-800 flex items-center justify-between">
              <code className="text-lg text-gray-300">{installCommand}</code>
              <Button size="sm" variant="ghost" onClick={handleCopy} className="hover:bg-gray-700">
                {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            or <code className="text-gray-400">npm install @colorfy-software/emittify</code>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
