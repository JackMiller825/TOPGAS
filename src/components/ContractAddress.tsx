import { useEffect, useMemo, useState } from 'react'
import { confirmedAddress, formatFact, resolveToken, token } from '../config/token.ts'

export function useTokenConfig() {
  return useMemo(() => resolveToken(token), [])
}

export function ContractAddress() {
  const config = useTokenConfig()
  const address = confirmedAddress(config.contractAddress)
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (config.contractAddress != null && !address) {
      console.error('Configured contract address does not match a 0x + 40 hex character shape.')
    }
  }, [address, config.contractAddress])

  useEffect(() => {
    if (state !== 'copied') return
    const timer = window.setTimeout(() => setState('idle'), 2000)
    return () => window.clearTimeout(timer)
  }, [state])

  async function copyAddress() {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setState('copied')
    } catch {
      setState('error')
    }
  }

  const extras = [
    config.buyTax != null ? `Buy tax ${formatFact(config.buyTax)}` : null,
    config.sellTax != null ? `Sell tax ${formatFact(config.sellTax)}` : null,
    config.ownershipStatus != null ? `Ownership ${formatFact(config.ownershipStatus)}` : null,
    config.liquidityStatus != null ? `Liquidity ${formatFact(config.liquidityStatus)}` : null,
  ].filter((item): item is string => Boolean(item))

  return (
    <div className="contract-block">
      <div className="scoreboard">
        <article className="stat-card reveal">
          <h3>Network</h3>
          <p className="stat-value">{config.network}</p>
          <p>Chain ID {config.chainId}.</p>
        </article>
        <article className="stat-card reveal">
          <h3>Ticker</h3>
          <p className="stat-value">{config.displayTicker}</p>
          <p>{config.name}.</p>
        </article>
        <article className="stat-card reveal">
          <h3>Total supply</h3>
          <p className="stat-value">{formatFact(config.totalSupply)}</p>
          <p>Confirmed supply will replace this placeholder.</p>
        </article>
        <article className="stat-card reveal">
          <h3>Tax / liquidity</h3>
          <p className="stat-value">{extras.length ? extras.join(' · ') : '[TOKENOMICS]'}</p>
          <p>Buy tax, sell tax, ownership, and liquidity appear only after confirmation.</p>
        </article>
      </div>

      <div className="contract-strip">
        <p className="contract-label">Contract address</p>
        <p className="address">{address ?? '[CONTRACT_ADDRESS]'}</p>
        {address ? (
          <button type="button" className="btn btn-gold" onClick={copyAddress}>
            {state === 'copied' ? 'Copied!' : state === 'error' ? 'Retry copy' : 'Copy address'}
          </button>
        ) : (
          <button type="button" className="btn btn-gold" disabled>
            Awaiting confirmation
          </button>
        )}
      </div>
      <p className="pending-note">
        Supply, taxes, liquidity, ownership, and official links require confirmation before launch.
      </p>
      {config.launchStatus != null && <p className="pending-note">Launch status: {formatFact(config.launchStatus)}</p>}
      <p className="sr-only" role="status" aria-live="polite">
        {state === 'copied' ? 'Contract address copied.' : ''}
        {state === 'error' ? "Couldn't copy. Select and copy the address manually." : ''}
      </p>
      {state === 'error' && (
        <p className="copy-error">Couldn't copy. Select and copy the address manually.</p>
      )}
    </div>
  )
}
