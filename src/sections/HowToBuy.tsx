import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { confirmedHttps } from '../config/token.ts'
import { useGsapEnter } from '../hooks/useGsapEnter.ts'
import { trackCta } from '../analytics/tracker.ts'
import { OfficialLink } from '../components/OfficialLink.tsx'
import { useTokenConfig } from '../components/ContractAddress.tsx'

export function HowToBuy({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null)
  const config = useTokenConfig()
  const buyUrl = confirmedHttps(config.links.buy)
  const [activeStep, setActiveStep] = useState(1)
  useGsapEnter(scope, '.pass', reduced)

  const steps = [
    {
      title: 'Prepare your wallet',
      body: 'Use an Ethereum-compatible wallet. Keep your recovery phrase private.',
    },
    {
      title: 'Fund with ETH',
      body: 'Add ETH on Ethereum mainnet and reserve enough for gas.',
    },
    {
      title: 'Verify the contract',
      body: 'Match the confirmed official address before opening the swap.',
    },
    {
      title: 'Review and swap',
      body: buyUrl
        ? 'Open the confirmed trading destination to review your swap.'
        : 'Check the token, amount, fees, and transaction details. Trading destination is pending.',
    },
  ]

  useEffect(() => {
    const root = scope.current
    if (!root) return
    const cards = Array.from(root.querySelectorAll('[data-step]'))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const step = visible[0]?.target.getAttribute('data-step')
        if (step) setActiveStep(Number(step))
      },
      { threshold: [0.45, 0.75] },
    )
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-to-buy" className="section section-cream" ref={scope}>
      <div className="wrap">
        <p className="eyebrow">03 / Your route to the pitch</p>
        <h2>
          Four passes.
          <br />
          You're in the game.
        </h2>
        <div className="route" style={{ '--step': activeStep } as CSSProperties}>
          <div className="route-line" aria-hidden="true">
            <span />
          </div>
          <ol className="passes">
            {steps.map((step, index) => (
              <li key={step.title} className={activeStep === index + 1 ? 'pass is-active' : 'pass'} data-step={index + 1}>
                <span className="step-no">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                {index === 3 && buyUrl && (
                  <OfficialLink
                    className="btn btn-dark"
                    href={config.links.buy}
                    label={`Buy ${config.displayTicker}`}
                    pendingLabel=""
                    onActivate={() => trackCta('buy')}
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
