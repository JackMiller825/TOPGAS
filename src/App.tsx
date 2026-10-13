import { lazy, Suspense, useRef, useState } from 'react'
import { Header } from './components/Header.tsx'
import { Footer } from './components/Footer.tsx'
import { FAQ } from './components/FAQ.tsx'
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

export default function App() {
  const ballRef = useRef<HTMLDivElement>(null)
  const pitchRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const saveData = useSaveData()
  const compact = useCompact()
  const [webglOk, setWebglOk] = useState(detectWebGL)
  const show3d = webglOk && !saveData
  useHashAlignment()

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
        <FAQ />
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
