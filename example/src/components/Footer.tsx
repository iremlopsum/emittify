import { motion } from 'motion/react'
import { Github, Package, Heart } from 'lucide-react'

import { Button } from './ui/button'

import { FADE_UP_VIEW_MOTION, SPRING_CONFIG } from '../constants/animations'

export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          {...FADE_UP_VIEW_MOTION}
          viewport={{ once: true }}
          transition={{ ...SPRING_CONFIG, duration: 0.6 }}>
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-4xl">🛩</span>
                <h3 className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Emittify</h3>
              </div>
              <p className="text-gray-400 mb-4">
                A tiny, TypeScript-first event emitter with caching, deduplication, and React hooks.
              </p>
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="border-gray-700">
                  <Github className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-gray-700">
                  <Package className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Examples
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    NPM Package
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Report Issues
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Contributing Guide
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">© 2025 Emittify. Released under the MIT License.</div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
              <span>by</span>
              <a href="https://colorfy.me" className="text-purple-400 hover:text-purple-300 transition-colors">
                Colorfy Software
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
