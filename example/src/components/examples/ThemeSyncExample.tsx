import { useState } from 'react'
import { motion } from 'motion/react'
import { Sun, Moon, Monitor } from 'lucide-react'

import { Button } from '../ui/button'
import { ExampleWrapper } from '../ExampleWrapper'

type Theme = 'light' | 'dark' | 'auto'

export function ThemeSyncExample() {
  const [theme, setTheme] = useState<Theme>('dark')

  const themeColors = {
    light: {
      bg: 'from-gray-100 to-gray-200',
      text: 'text-gray-900',
      card: 'bg-white border-gray-300',
      accent: 'from-purple-400 to-pink-400',
    },
    dark: {
      bg: 'from-gray-900 to-gray-800',
      text: 'text-white',
      card: 'bg-gray-800 border-gray-700',
      accent: 'from-purple-500 to-pink-500',
    },
    auto: {
      bg: 'from-blue-900 to-purple-900',
      text: 'text-white',
      card: 'bg-blue-800/50 border-blue-700',
      accent: 'from-cyan-400 to-blue-400',
    },
  }

  const current = themeColors[theme]

  return (
    <ExampleWrapper title="🎨 Theme Sync" subtitle="Cached theme ensures all components stay in sync" badge="CACHING">
      <div className="space-y-6">
        {/* Theme Toggle */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => setTheme('light')}
            variant={theme === 'light' ? 'default' : 'outline'}
            className={theme === 'light' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}>
            <Sun className="mr-2 h-4 w-4" />
            Light
          </Button>
          <Button
            onClick={() => setTheme('dark')}
            variant={theme === 'dark' ? 'default' : 'outline'}
            className={theme === 'dark' ? 'bg-purple-500 hover:bg-purple-600' : ''}>
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </Button>
          <Button
            onClick={() => setTheme('auto')}
            variant={theme === 'auto' ? 'default' : 'outline'}
            className={theme === 'auto' ? 'bg-cyan-500 hover:bg-cyan-600' : ''}>
            <Monitor className="mr-2 h-4 w-4" />
            Auto
          </Button>
        </div>

        {/* Preview Components */}
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`bg-gradient-to-br ${current.bg} rounded-lg p-8 border border-gray-700`}>
          <div className={`${current.text} space-y-4`}>
            <h3 className={`bg-gradient-to-r ${current.accent} bg-clip-text text-transparent`}>
              Current Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} className={`${current.card} rounded-lg p-4 border`}>
                <div className="text-sm opacity-70 mb-2">Component A</div>
                <div className={`h-12 rounded bg-gradient-to-r ${current.accent}`}></div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className={`${current.card} rounded-lg p-4 border`}>
                <div className="text-sm opacity-70 mb-2">Component B</div>
                <div className={`h-12 rounded bg-gradient-to-r ${current.accent}`}></div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className={`${current.card} rounded-lg p-4 border`}>
                <div className="text-sm opacity-70 mb-2">Component C</div>
                <div className={`h-12 rounded bg-gradient-to-r ${current.accent}`}></div>
              </motion.div>
            </div>

            <div className={`${current.card} rounded-lg p-4 border`}>
              <p className="text-sm">
                All components receive the theme instantly through cached events. New components mounted after theme
                change get the current value immediately.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="bg-[#1e1e2e] rounded-lg p-4 border border-gray-700">
          <code className="text-sm text-gray-300">
            <span className="text-cyan-400">const</span> theme = emitter.
            <span className="text-cyan-400">useEventListener</span>(<span className="text-green-400">'theme'</span>,{' '}
            <span className="text-green-400">'dark'</span>){'\n'}
            emitter.<span className="text-cyan-400">send</span>(<span className="text-green-400">'theme'</span>,{' '}
            <span className="text-green-400">'{theme}'</span>)
          </code>
        </div>
      </div>
    </ExampleWrapper>
  )
}
