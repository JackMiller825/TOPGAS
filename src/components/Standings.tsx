import { barPercent, contenders } from '../config/standings.ts'
import { useContender } from '../state/ContenderContext.tsx'

export function Standings({ variant }: { variant: 'strip' | 'panel' }) {
  const { selectedId, select } = useContender()

  return (
    <div className={variant === 'strip' ? 'standings standings-strip' : 'standings standings-panel'}>
      {variant === 'panel' && (
        <>
          <h3>Fictional gas standings</h3>
          <p className="fine">Illustrative meme figures, not real wallet activity or official football rankings.</p>
        </>
      )}
      <div className="standing-grid" role="group" aria-label="Fictional gas standings">
        {contenders.map((contender) => {
          const selected = selectedId === contender.id
          return (
            <button
              key={contender.id}
              type="button"
              className={selected ? 'standing is-selected' : 'standing'}
              aria-pressed={selected}
              onClick={() => select(contender.id)}
            >
              <span className="place">{contender.place}</span>
              <span className="who">{contender.name}</span>
              <span className="nums">{contender.fees.total} ETH</span>
              <span className="bar" aria-hidden="true">
                <span style={{ width: `${barPercent(contender.fees.total)}%` }} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
