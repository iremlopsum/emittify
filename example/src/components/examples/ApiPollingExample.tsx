import { motion } from 'motion/react'
import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { ExampleWrapper } from '../ExampleWrapper'

import { exampleEmitter } from '../../../events'

export function ApiPollingExample() {
  // Subscribe to both deduplicated and non-deduplicated events
  const dedupedData = exampleEmitter.useEventListener('api-data-deduped', {
    value: 42,
    status: 'idle',
  })
  const noDedupData = exampleEmitter.useEventListener('api-data-no-dedup', {
    value: 42,
    status: 'idle',
  })

  // UI state
  const [isPolling, setIsPolling] = useState(false)
  const [deduplication, setDeduplication] = useState(true)
  const [pollCount, setPollCount] = useState(0)
  const [updateCount, setUpdateCount] = useState(0)
  const [flashUpdate, setFlashUpdate] = useState(false)
  const [flashBlocked, setFlashBlocked] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout>()
  const prevDedupedData = useRef(dedupedData)
  const prevNoDedupData = useRef(noDedupData)

  // Listen to deduplicated event - increment counter only if deduplication is ON
  useEffect(() => {
    if (dedupedData !== prevDedupedData.current) {
      prevDedupedData.current = dedupedData

      if (deduplication) {
        setUpdateCount(prev => prev + 1)
        setFlashUpdate(true)
        setTimeout(() => setFlashUpdate(false), 300)
      }
    }
  }, [dedupedData, deduplication])

  // Listen to non-deduplicated event - increment counter only if deduplication is OFF
  useEffect(() => {
    if (noDedupData !== prevNoDedupData.current) {
      prevNoDedupData.current = noDedupData

      if (!deduplication) {
        setUpdateCount(prev => prev + 1)
        setFlashUpdate(true)
        setTimeout(() => setFlashUpdate(false), 300)
      }
    }
  }, [noDedupData, deduplication])

  // Flash blocked animation when deduplication blocks an update
  // This happens when noDedupData updates but dedupedData doesn't (while dedup is on)
  useEffect(() => {
    if (deduplication && noDedupData !== prevNoDedupData.current && dedupedData === prevDedupedData.current) {
      setFlashBlocked(true)
      const timer = setTimeout(() => setFlashBlocked(false), 300)
      return () => clearTimeout(timer)
    }
  }, [deduplication, dedupedData, noDedupData])

  // Polling logic - sends to both events
  useEffect(() => {
    if (isPolling) {
      intervalRef.current = setInterval(() => {
        setPollCount(prev => prev + 1)

        // Simulate API response (sometimes same, sometimes different)
        const shouldChange = Math.random() > 0.7
        const lastValue = deduplication ? dedupedData.value : noDedupData.value
        const newValue = shouldChange ? Math.floor(Math.random() * 100) : lastValue
        const newData = { value: newValue, status: 'active' }

        // Send to BOTH events - Emittify handles deduplication for dedupedData
        exampleEmitter.send('api-data-deduped', newData)
        exampleEmitter.send('api-data-no-dedup', newData)
      }, 2000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPolling, deduplication, dedupedData.value, noDedupData.value])

  const reset = () => {
    setIsPolling(false)
    setPollCount(0)
    setUpdateCount(0)

    // Reset both events to initial state
    const initialData = { value: 42, status: 'idle' }
    exampleEmitter.send('api-data-deduped', initialData)
    exampleEmitter.send('api-data-no-dedup', initialData)

    // Update refs
    prevDedupedData.current = initialData
    prevNoDedupData.current = initialData
  }

  // Get current data based on deduplication toggle
  const currentData = deduplication ? dedupedData : noDedupData

  return (
    <ExampleWrapper
      title="📡 API Polling"
      subtitle="Deduplication prevents unnecessary updates from unchanged data"
      badge="DEDUPLICATION">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={() => setIsPolling(!isPolling)}
            className={isPolling ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}>
            {isPolling ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Stop Polling
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Polling
              </>
            )}
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <Switch id="dedup-polling" checked={deduplication} onCheckedChange={setDeduplication} />
            <Label htmlFor="dedup-polling" className="text-sm text-gray-400">
              Deduplication
            </Label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            animate={{
              scale: flashBlocked ? [1, 1.05, 1] : 1,
            }}
            className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Total Polls</div>
            <div className="text-4xl text-gray-300">{pollCount}</div>
          </motion.div>
          <motion.div
            animate={{
              scale: flashUpdate ? [1, 1.05, 1] : 1,
              borderColor: flashUpdate ? '#10b981' : 'rgb(55, 65, 81)',
            }}
            className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Updates Emitted</div>
            <div className="text-4xl text-green-300">{updateCount}</div>
          </motion.div>
        </div>

        {/* Current Data Display */}
        <motion.div
          animate={{
            backgroundColor: flashUpdate
              ? 'rgba(16, 185, 129, 0.2)'
              : flashBlocked
              ? 'rgba(107, 114, 128, 0.2)'
              : 'rgba(31, 41, 55, 0.5)',
          }}
          className="rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h4>Current API Response</h4>
            {isPolling && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full"
              />
            )}
          </div>
          <div className="bg-[#1e1e2e] rounded-lg p-4 border border-gray-700">
            <pre className="text-sm">
              <code className="text-gray-300">
                {'{\n'}
                {'  '}"value": <span className="text-cyan-400">{currentData.value}</span>,{'\n'}
                {'  '}"status": <span className="text-green-400">"{currentData.status}"</span>
                {'\n'}
                {'}'}
              </code>
            </pre>
          </div>
        </motion.div>

        <div className="bg-[#1e1e2e] rounded-lg p-4 border border-gray-700">
          <code className="text-sm text-gray-300 whitespace-pre">
            <span className="text-gray-500">// Blocks duplicate API responses</span>
            {'\n'}
            <span className="text-purple-400">const</span> data = emitter.
            <span className="text-yellow-400">useEventListener</span>(
            <span className="text-green-400">'api-data-deduped'</span>, {'{'}
            {'}'}){'\n'}
            emitter.<span className="text-yellow-400">send</span>(
            <span className="text-green-400">'api-data-deduped'</span>, newData)
          </code>
        </div>
      </div>
    </ExampleWrapper>
  )
}
