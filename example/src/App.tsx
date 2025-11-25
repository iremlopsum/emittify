import { useEffect } from 'react'

import { Hero } from './components/Hero'
import { Footer } from './components/Footer'
import { Metrics } from './components/Metrics'
import { ApiCards } from './components/ApiCards'
import { CodeSetup } from './components/CodeSetup'
import GradualBlur from './components/GradualBlur'
import LiquidEther from './components/LiquidEther'
import { BeforeAfter } from './components/BeforeAfter'
import { FeaturesGrid } from './components/FeaturesGrid'
import { Installation } from './components/Installation'
import { FormSyncExample } from './components/examples/FormSyncExample'
import { LiveStatsExample } from './components/examples/LiveStatsExample'
import { ThemeSyncExample } from './components/examples/ThemeSyncExample'
import { MouseTrailExample } from './components/examples/MouseTrailExample'
import { ApiPollingExample } from './components/examples/ApiPollingExample'
import { ScrollParallaxExample } from './components/examples/ScrollParallaxExample'
import { SmartNotificationsExample } from './components/examples/SmartNotificationsExample'

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0a0a0f] to-[#1a1a2e] text-white relative pb-[25vh]">
      <div className="relative z-50">
        <Hero />
        <FeaturesGrid />
        <Installation />
        <ApiCards />

        {/* Interactive Examples Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center mb-4">Interactive Examples</h2>
            <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
              See Emittify in action with these live, interactive demos showcasing real-world use cases
            </p>

            <div className="space-y-16">
              <MouseTrailExample />
              <LiveStatsExample />
              <SmartNotificationsExample />
              <ThemeSyncExample />
              <ApiPollingExample />
              <FormSyncExample />
              <ScrollParallaxExample />
            </div>
          </div>
        </section>

        <CodeSetup />
        <BeforeAfter />
        <Metrics />
        <Footer />
      </div>
      <LiquidEther
        colors={['#5227FF', '#FF9FFC', '#B19EEF']}
        mouseForce={20}
        cursorSize={100}
        isViscous={false}
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />
      <GradualBlur
        target="page"
        position="bottom"
        height="25vh"
        strength={2}
        divCount={10}
        curve="bezier"
        exponential={true}
        opacity={1}
      />
    </div>
  )
}
