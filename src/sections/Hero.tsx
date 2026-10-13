import { useEffect, useState, type PointerEvent, type RefObject } from 'react'
import { token } from '../config/token.ts'
import { requestSpin, setPointerTilt, subscribeStadiumReady } from '../three/stadiumSignals.ts'
import { useTokenConfig } from '../components/ContractAddress.tsx'
import { ArtImage } from '../components/ArtImage.tsx'
import { trackCta } from '../analytics/tracker.ts'
import { OfficialLink } from '../components/OfficialLink.tsx'
import { Standings } from '../components/Standings.tsx'

type HeroProps = {
  ballRef: RefObject<HTMLDivElement | null>
  show3d: boolean
  saveData: boolean
  reduced: boolean
}

export function Hero({ ballRef, show3d, saveData, reduced }: HeroProps) {
  const config = useTokenConfig()
  const [ready, setReady] = useState(false)
  const [spinNote, setSpinNote] = useState('')

  useEffect(() => subscribeStadiumReady(() => setReady(true)), [])

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || reduced || !show3d) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    setPointerTilt(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      ((event.clientY - rect.top) / rect.height) * 2 - 1,
    )
  }

  function spinBall() {
    if (reduced || !show3d) {
      setSpinNote('Golden ball shown still.')
      return
    }
    setSpinNote('')
    requestSpin()
  }

  return (
    <section id="home" className="hero">
      <ArtImage
        filename="topgas-stadium-background.webp"
        alt=""
        width={2400}
        height={1350}
        className="hero-bg"
        eager
      />
      <div className="hero-scrim" />
      <div className="wrap hero-content">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Ethereum mainnet • 2026 edition</p>
            <h1>
              The Golden Ball.
              <br />
              The biggest
              <br />
              gas bill.
            </h1>
            <p className="lede">
              Goals win matches. Here, receipts win trophies. Welcome to Ballon Winner 2026 / {config.displayTicker}.
            </p>
            <p className="tagline">{config.tagline}</p>
            <p className="fine">A fictional football × Ethereum awards-night universe.</p>
            <div className="hero-actions">
              <a className="btn btn-gold" href="#story">
                Enter the stadium ↘
              </a>
              <a className="btn btn-ghost" href="#tokenomics">
                Token information
              </a>
              <OfficialLink
                className="btn btn-gold"
                href={config.links.buy}
                label={`Buy ${config.displayTicker}`}
                pendingLabel={`Buy ${config.displayTicker} · link pending`}
                onActivate={() => trackCta('buy')}
              />
              <OfficialLink
                className="btn btn-ghost"
                href={config.links.chart}
                label="View chart"
                pendingLabel="Chart · link pending"
                onActivate={() => trackCta('chart')}
              />
            </div>
            {show3d && (
              <button type="button" className="btn btn-ghost spin-btn" onClick={spinBall}>
                Spin the golden ball
              </button>
            )}
            <p className="sr-only" aria-live="polite">
              {spinNote}
            </p>
            {!show3d && (
              <p className="fallback-note">
                {saveData
                  ? '3D view paused to save data; all information remains accessible.'
                  : '3D view unavailable; all information remains accessible.'}
              </p>
            )}
          </div>
          <div className="hero-art">
            <div
              ref={ballRef}
              className="ball-slot"
              onPointerMove={onPointerMove}
              onPointerLeave={() => setPointerTilt(0, 0)}
            >
              {!show3d && (
                <ArtImage
                  filename="topgas-golden-trophy.png"
                  alt="Golden football trophy on a pedestal"
                  width={800}
                  height={1000}
                  className="trophy-still"
                  eager
                />
              )}
              {show3d && !ready && <p className="loading-stadium">Loading stadium…</p>}
            </div>
            <ArtImage
              filename="topgas-mascot-trophy-receipt.png"
              alt="Harry Kane caricature in a white kit and royal cape, holding a golden football trophy and a 20.26 ETH gas receipt."
              width={1600}
              height={1800}
              className="mascot"
              eager
            />
            <div className="art-labels">
              <p>The Golden Gas Award</p>
              <p className="nums">20.26 ETH</p>
              <p>Kane's signature gas bill</p>
            </div>
          </div>
        </div>
        <Standings variant="strip" />
        <ul className="score-strip">
          <li>2026 season</li>
          <li>Kane 20.26 ETH</li>
          <li>The receipt is the highlight reel</li>
          <li>{token.displayTicker}</li>
          <li>Forget goals. Show us your gas bill.</li>
        </ul>
      </div>
    </section>
  )
}
