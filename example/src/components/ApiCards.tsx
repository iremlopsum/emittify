import { useState, useEffect, useRef } from 'react'

const apiMethods = [
  {
    name: 'send()',
    signature: 'send<K>(event: K, data: Events[K])',
    description: 'Emit an event with typed data to all listeners',
    example: "emitter.send('user-login', { userId: 123 })",
  },
  {
    name: 'listen()',
    signature: 'listen<K>(event: K, callback: (data: Events[K]) => void)',
    description: 'Register a listener for an event. Returns unsubscribe function',
    example: "const unsub = emitter.listen('user-login', data => {...})",
  },
  {
    name: 'useEventListener()',
    signature: 'useEventListener<K>(event: K, initialValue: Events[K])',
    description: 'React hook that subscribes to events and returns current value',
    example: "const user = emitter.useEventListener('current-user', null)",
  },
  {
    name: 'getCache()',
    signature: 'getCache<K>(event: K): Events[K] | undefined',
    description: 'Retrieve the cached value for an event',
    example: "const cachedCount = emitter.getCache('message-count')",
  },
  {
    name: 'clearCache()',
    signature: 'clearCache<K>(event?: K)',
    description: 'Clear cached values for specific event or all events',
    example: "emitter.clearCache('message-count')",
  },
]

export function ApiCards() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          // Small delay to ensure stable render
          requestAnimationFrame(() => {
            setIsVisible(true)
          })
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
          <h2 className="text-center mb-4">API Reference</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">Simple, powerful, and fully typed</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {apiMethods.map((method, index) => (
            <div
              key={method.name}
              className={`bg-linear-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-6 border border-gray-800 hover:border-cyan-500/50 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
              }}>
              <h3 className="mb-2 text-cyan-400">{method.name}</h3>
              <code className="text-sm text-gray-500 block mb-4">{method.signature}</code>
              <p className="text-gray-400 mb-4">{method.description}</p>
              <div className="bg-[#1e1e2e] rounded-lg p-3 border border-gray-700">
                <code className="text-sm text-purple-300">{method.example}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
