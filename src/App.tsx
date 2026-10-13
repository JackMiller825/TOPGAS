import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { startPublicAnalytics } from './analytics/tracker.ts'
import { isDashboardLocation } from './dashboard/path.ts'
import { Header } from './components/Header.tsx'
import { Footer } from './components/Footer.tsx'
import { StadiumBoundary } from './components/StadiumBoundary.tsx'
import { Hero } from './sections/Hero.tsx'
import { Story } from './sections/Story.tsx'
import { Tokenomics } from './sections/Tokenomics.tsx'
import { HowToBuy } from './sections/HowToBuy.tsx'
import { Community } from './sections/Community.tsx'
import { ContenderProvider } from './state/ContenderContext.tsx'
import { useCompact } from './hooks/useCompact.ts'
import { useHashAlignment } from './hooks/useHashAlignment.ts'
import { useReducedMotion } from './hooks/useReducedMotion.ts'
import { useSaveData } from './hooks/useSaveData.ts'
import { detectWebGL } from './hooks/webgl.ts'

const StadiumExperience = lazy(() => import('./three/StadiumExperience.tsx'))
const Dashboard = lazy(() => import('./dashboard/Dashboard.tsx'))

export default function App() {
  const [dashboard, setDashboard] = useState(() => isDashboardLocation())

  useEffect(() => {
    const sync = () => setDashboard(isDashboardLocation())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  useEffect(() => {
    if (!dashboard) return
    const meta = document.querySelector('meta[name="robots"]')
    const previous = meta?.getAttribute('content') ?? null
    meta?.setAttribute('content', 'noindex, nofollow')
    const previousTitle = document.title
    document.title = 'Private Visitor Dashboard'
    return () => {
      if (previous) meta?.setAttribute('content', previous)
      document.title = previousTitle
    }
  }, [dashboard])

  if (dashboard) {
    return (
      <Suspense fallback={<main className="dash"><p>Loading dashboard…</p></main>}>
        <Dashboard />
      </Suspense>
    )
  }

  return <PublicSite />
}

function PublicSite() {
  const ballRef = useRef<HTMLDivElement>(null)
  const pitchRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const saveData = useSaveData()
  const compact = useCompact()
  const [webglOk, setWebglOk] = useState(detectWebGL)
  const show3d = webglOk && !saveData
  useHashAlignment()

  useEffect(() => startPublicAnalytics(), [])

  return (
    <ContenderProvider>
      <a className="skip" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Hero ballRef={ballRef} show3d={show3d} saveData={saveData} reduced={reduced} />
        <Story pitchRef={pitchRef} show3d={show3d} reduced={reduced} />
        <Tokenomics reduced={reduced} />
        <HowToBuy reduced={reduced} />
        <Community reduced={reduced} />
      </main>
      <Footer />
      {show3d && (
        <StadiumBoundary onFail={() => setWebglOk(false)}>
          <Suspense fallback={null}>
            <StadiumExperience ballRef={ballRef} pitchRef={pitchRef} reduced={reduced} compact={compact} />
          </Suspense>
        </StadiumBoundary>
      )}
    </ContenderProvider>
  )
}
