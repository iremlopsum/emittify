import { useState } from 'react'
import { motion } from 'motion/react'

import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ExampleWrapper } from '../ExampleWrapper'

import { exampleEmitter } from '../../../events'
import { HOVER_SCALE_SMALL, SPRING_CONFIG } from '../../constants/animations'

interface FormData {
  name: string
  email: string
  message: string
}

export function FormSyncExample() {
  // Use Emittify to manage form state across both forms
  const formData = exampleEmitter.useEventListener('form-data', {
    name: '',
    email: '',
    message: '',
  })

  // Track event emissions to demonstrate deduplication
  const [eventCount, setEventCount] = useState(0)

  const updateField = (field: keyof FormData, value: string) => {
    const updatedData = { ...formData, [field]: value }
    exampleEmitter.send('form-data', updatedData)
    setEventCount(prev => prev + 1)
  }

  return (
    <ExampleWrapper
      title="🎯 Form Sync"
      subtitle="Two forms stay in sync with shallow comparison deduplication"
      badge="INTERACTIVE">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form 1 */}
          <motion.div
            whileHover={HOVER_SCALE_SMALL}
            transition={SPRING_CONFIG}
            className="bg-linear-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-6 border border-purple-500/30">
            <h4 className="mb-4 text-purple-300">Form A</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name1" className="text-gray-400">
                  Name
                </Label>
                <Input
                  id="name1"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Enter your name"
                  className="bg-gray-800/50 border-gray-700 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email1" className="text-gray-400">
                  Email
                </Label>
                <Input
                  id="email1"
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                  className="bg-gray-800/50 border-gray-700 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message1" className="text-gray-400">
                  Message
                </Label>
                <textarea
                  id="message1"
                  value={formData.message}
                  onChange={e => updateField('message', e.target.value)}
                  placeholder="Your message..."
                  className="w-full mt-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
              </div>
            </div>
          </motion.div>

          {/* Form 2 */}
          <motion.div
            whileHover={HOVER_SCALE_SMALL}
            transition={SPRING_CONFIG}
            className="bg-linear-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg p-6 border border-cyan-500/30">
            <h4 className="mb-4 text-cyan-300">Form B</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name2" className="text-gray-400">
                  Name
                </Label>
                <Input
                  id="name2"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Enter your name"
                  className="bg-gray-800/50 border-gray-700 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email2" className="text-gray-400">
                  Email
                </Label>
                <Input
                  id="email2"
                  type="email"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                  className="bg-gray-800/50 border-gray-700 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message2" className="text-gray-400">
                  Message
                </Label>
                <textarea
                  id="message2"
                  value={formData.message}
                  onChange={e => updateField('message', e.target.value)}
                  placeholder="Your message..."
                  className="w-full mt-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows={4}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Stats */}
          <motion.div layout className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-700">
            <h4 className="mb-3 text-gray-300">Event Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Updates:</span>
                <span className="text-2xl font-bold text-purple-400">{eventCount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">With shallow comparison, only actual changes emit events</p>
            </div>
          </motion.div>

          {/* JSON Preview */}
          <motion.div layout className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-700">
            <h4 className="mb-3 text-gray-300">Current State (JSON)</h4>
            <pre className="text-sm overflow-x-auto">
              <code className="text-gray-400">{JSON.stringify(formData, null, 2)}</code>
            </pre>
          </motion.div>
        </div>

        <div className="bg-[#1e1e2e] rounded-lg p-4 border border-gray-700">
          <code className="text-sm text-gray-300 whitespace-pre">
            <span className="text-gray-500">// Component usage with deduplication</span>
            {'\n'}
            <span className="text-purple-400">const</span> formData ={' '}
            <span className="text-cyan-400">exampleEmitter</span>.
            <span className="text-yellow-400">useEventListener</span>(
            <span className="text-green-400">'form-data'</span>, initialValue)
            {'\n'}
            <span className="text-cyan-400">exampleEmitter</span>.<span className="text-yellow-400">send</span>(
            <span className="text-green-400">'form-data'</span>, updatedData)
          </code>
        </div>
      </div>
    </ExampleWrapper>
  )
}
