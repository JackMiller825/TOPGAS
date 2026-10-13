import { useRef, type RefObject } from 'react'
import { contenders } from '../config/standings.ts'
import { useGsapEnter } from '../hooks/useGsapEnter.ts'
import { useContender } from '../state/ContenderContext.tsx'
import { ArtImage } from '../components/ArtImage.tsx'
import { Standings } from '../components/Standings.tsx'

type StoryProps = {
  pitchRef: RefObject<HTMLDivElement | null>
  show3d: boolean
  reduced: boolean
}

export function Story({ pitchRef, show3d, reduced }: StoryProps) {
  const scope = useRef<HTMLElement>(null)
  const { selected, selectedId, select } = useContender()
  useGsapEnter(scope, '.reveal', reduced)

  return (
    <section id="story" className="section section-cream" ref={scope}>
      <div className="wrap">
        <div className="story-lead">
          <div>
            <p className="eyebrow">01 / The matchday story</p>
            <h2>
              Five contenders.
              <br />
              One enormous receipt.
            </h2>
          </div>
          <div className="story-copy">
            <ArtImage
              filename="topgas-golden-trophy.png"
              alt=""
              width={800}
              height={1000}
              className="story-trophy"
            />
            <p>
              They brought goals, assists, and highlight reels. Kane brought 12.00 + 8.00 + 0.26 ETH in gas fees. In
              this fictional ceremony, that is the winning stat.
            </p>
            <p className="callout">20.26 ETH. One golden ball.</p>
            <p>They brought football stats. Kane brought the gas receipt. In our imaginary awards night, the biggest bill wins.</p>
          </div>
        </div>

        <ArtImage
          filename="topgas-contenders-lineup.png"
          alt="Five caricature contenders, Kane, Ronaldo, Messi, Mbappe, and Haaland, with their fictional gas receipts."
          width={2000}
          height={900}
          className="lineup reveal"
        />

        <div className="story-stage">
          <div className="pitch-column">
            <p className="pitch-label">Select a contender • Fictional gas standings</p>
            <div ref={pitchRef} className="pitch-slot" />
            {!show3d && <p className="fine">The pitch graphic stays available with the player controls below.</p>}
            <div className="player-row" role="group" aria-label="Select a contender">
              {contenders.map((contender) => {
                const pressed = selectedId === contender.id
                return (
                  <button
                    key={contender.id}
                    type="button"
                    className={pressed ? 'player-button is-selected reveal' : 'player-button reveal'}
                    aria-pressed={pressed}
                    onClick={() => select(contender.id)}
                  >
                    <ArtImage filename={contender.portrait} alt="" width={512} height={512} />
                    <span>{contender.name}</span>
                    <span className="nums">{contender.fees.total} ETH</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="receipt-card reveal">
            <p className="receipt-kicker">GAS d'OR / MATCHDAY RECEIPT</p>
            <h3 className="receipt-name">{selected.name}</h3>
            <dl className="receipt-rows">
              <div>
                <dt>Swap</dt>
                <dd className="nums">{selected.fees.swap} ETH</dd>
              </div>
              <div>
                <dt>Mint</dt>
                <dd className="nums">{selected.fees.mint} ETH</dd>
              </div>
              <div>
                <dt>Transfer</dt>
                <dd className="nums">{selected.fees.transfer} ETH</dd>
              </div>
              <div className="receipt-total">
                <dt>Total</dt>
                <dd className="nums">{selected.fees.total} ETH</dd>
              </div>
            </dl>
            <Standings variant="panel" />
          </div>
        </div>
      </div>
    </section>
  )
}
