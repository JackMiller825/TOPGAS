import { useEffect, useMemo, useRef, useState } from 'react'
import { confirmedAddress, formatFact, resolveToken, token, type TokenConfig } from '../config/token.ts'

const UNPUBLISHED_ADDRESS = 'Coming Soon..'

function taxLabel(config: TokenConfig): string {
  const buy = formatFact(config.buyTax)
  const sell = formatFact(config.sellTax)
  return buy === sell ? buy : `${buy} / ${sell}`
}

export function useTokenConfig() {
  return useMemo(() => resolveToken(token), [])
}

export function ContractAddress() {
  const config = useTokenConfig()
  const address = confirmedAddress(config.contractAddress)
  const displayAddress = address ?? UNPUBLISHED_ADDRESS
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')
  const resetTimer = useRef<number | null>(null)

  useEffect(() => {
    if (config.contractAddress != null && !address) {
      console.error('Configured contract address does not match a 0x + 40 hex character shape.')
    }
  }, [address, config.contractAddress])

  useEffect(() => {
    return () => {
      if (resetTimer.current != null) window.clearTimeout(resetTimer.current)
    }
  }, [])

  function markCopied() {
    setState('copied')
    if (resetTimer.current != null) window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => {
      resetTimer.current = null
      setState('idle')
    }, 5000)
  }

  function copyWithSelection(text: string): boolean {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.top = '0'
    area.style.left = '0'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.focus()
    area.select()
    const copied = document.execCommand('copy')
    area.remove()
    return copied
  }

  async function copyAddress() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(displayAddress)
        markCopied()
        return
      }
    } catch {
      // The clipboard API can reject without a focused secure context. The selection fallback still copies.
    }
    try {
      if (copyWithSelection(displayAddress)) markCopied()
      else setState('error')
    } catch {
      setState('error')
    }
  }

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
        </article>
      </div>
      <article className="stat-card stat-facts reveal">
        <dl>
          <div>
            <dt>Buy / Sell tax</dt>
            <dd>{taxLabel(config)}</dd>
          </div>
          <div>
            <dt>LP status</dt>
            <dd>{formatFact(config.liquidityStatus)}</dd>
          </div>
          <div>
            <dt>Ownership</dt>
            <dd>{formatFact(config.ownershipStatus)}</dd>
          </div>
        </dl>
      </article>

      <div className="contract-strip">
        <p className="contract-label">Contract address</p>
        <p className="address">{displayAddress}</p>
        <button type="button" className="btn btn-gold" onClick={() => void copyAddress()}>
          {state === 'copied' ? 'Copied' : 'Copy Address'}
        </button>
      </div>
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
