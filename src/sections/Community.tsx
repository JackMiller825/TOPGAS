import { useEffect, useRef, useState } from 'react'
import { trackCta } from '../analytics/tracker.ts'
import { confirmedHttps } from '../config/token.ts'
import { useTokenConfig } from '../components/ContractAddress.tsx'
import { ArtImage } from '../components/ArtImage.tsx'
import { OfficialLink } from '../components/OfficialLink.tsx'
import { assetPath } from '../config/token.ts'

export function Community({ reduced }: { reduced: boolean }) {
  const config = useTokenConfig()
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])
  const [message, setMessage] = useState('')
  const cheering = useRef(false)
  const timer = useRef<number | null>(null)
  const telegram = confirmedHttps(config.links.telegram)
  const x = confirmedHttps(config.links.x)

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  function cheer() {
    if (cheering.current) return
    cheering.current = true
    setMessage("The supporters' end is cheering!")
    if (!reduced) setPieces(makeConfetti())
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      cheering.current = false
      setPieces([])
      timer.current = null
    }, 1600)
  }

  return (
    <section id="community" className="section section-fan">
      <div className="sweep" aria-hidden="true" />
      <div className="wrap community-grid">
        <div>
          <p className="eyebrow">04 / The supporters' end</p>
          <h2>
            Big receipts.
            <br />
            Louder supporters.
          </h2>
          <p className="lede">Bring your best football memes, your worst gas stories, and your matchday energy.</p>
          <p>Join the gas-side commentary.</p>
          <div className="hero-actions">
            <OfficialLink
              className="btn btn-gold"
              href={config.links.telegram}
              label="Join Telegram"
              pendingLabel="Telegram · link pending"
              onActivate={() => {
                trackCta('telegram')
                cheer()
              }}
            />
            <OfficialLink
              className="btn btn-ghost"
              href={config.links.x}
              label="Follow on X"
              pendingLabel="X · link pending"
              onActivate={() => {
                trackCta('x')
                cheer()
              }}
            />
            <button type="button" className="btn btn-gold" onClick={cheer}>
              Make some noise ⚽
            </button>
          </div>
          {!(telegram && x) && <p className="social-pending">[OFFICIAL_SOCIAL_LINKS]</p>}
          <p role="status" aria-live="polite">
            {message}
          </p>
          <details className="artwork">
            <summary>Matchday artwork</summary>
            <div className="artwork-grid">
              <figure>
                <ArtImage
                  filename="topgas-banner-3to1.png"
                  alt="Wide Ballon Winner 2026 campaign banner"
                  width={1500}
                  height={500}
                />
                <a href={assetPath('topgas-banner-3to1.png')} download>
                  Download wide banner
                </a>
              </figure>
              <figure>
                <ArtImage
                  filename="topgas-banner-1100x520.png"
                  alt="Telegram campaign banner for Ballon Winner 2026"
                  width={1100}
                  height={520}
                />
                <a href={assetPath('topgas-banner-1100x520.png')} download>
                  Download Telegram banner
                </a>
              </figure>
            </div>
          </details>
        </div>
        <div className="celebration">
          <Confetti pieces={pieces} />
          <ArtImage
            filename="topgas-community-celebration.png"
            alt="The five contenders celebrating, with Kane holding the golden trophy."
            width={1600}
            height={1000}
            className="celebration-art"
          />
        </div>
      </div>
    </section>
  )
}

type ConfettiPiece = {
  id: string
  left: number
  delay: number
  duration: number
  drift: number
  size: number
  rot: number
}

function makeConfetti(): ConfettiPiece[] {
  return Array.from({ length: 22 }, (_, index) => ({
    id: `${Date.now()}-${index}`,
    left: Math.random() * 100,
    delay: Math.random() * 0.12,
    duration: 0.9 + Math.random() * 0.55,
    drift: -30 + Math.random() * 60,
    size: 7 + Math.random() * 8,
    rot: Math.random() * 240,
  }))
}

function Confetti({ pieces }: { pieces: ConfettiPiece[] }) {
  if (!pieces.length) return null

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 0.55,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            ['--drift' as string]: `${piece.drift}px`,
            ['--rot' as string]: `${piece.rot}deg`,
          }}
        />
      ))}
    </div>
  )
}
