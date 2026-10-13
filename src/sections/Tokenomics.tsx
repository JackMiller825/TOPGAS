import { useRef } from 'react'
import { useGsapEnter } from '../hooks/useGsapEnter.ts'
import { ContractAddress } from '../components/ContractAddress.tsx'

export function Tokenomics({ reduced }: { reduced: boolean }) {
  const scope = useRef<HTMLElement>(null)
  useGsapEnter(scope, '.reveal', reduced)

  return (
    <section id="tokenomics" className="section section-dark" ref={scope}>
      <div className="wrap">
        <p className="eyebrow">02 / The scoreboard</p>
        <h2>
          Know the stats.
          <br />
          Check the contract.
        </h2>
        <ContractAddress />
      </div>
    </section>
  )
}
