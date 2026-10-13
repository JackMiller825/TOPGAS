/**
 * Confirmed project facts live here. Null fields are pending and must not be invented.
 *
 * Pending until a verified source is supplied:
 * - contractAddress
 * - totalSupply
 * - buyTax
 * - sellTax
 * - liquidityStatus
 * - ownershipStatus
 * - launchStatus
 * - links.buy, links.chart, links.x, links.telegram
 *
 * Deployment origin for this repository's GitHub Pages project site.
 * Sharing URLs use this origin. There is no custom domain.
 */
export type PendingValue = string | number | null

export type TokenLinks = {
  buy: string | null
  chart: string | null
  x: string | null
  telegram: string | null
}

export type TokenConfig = {
  name: string
  ticker: string
  displayTicker: string
  chainId: number
  network: string
  tagline: string
  secondaryHook: string
  contractAddress: PendingValue
  totalSupply: PendingValue
  buyTax: PendingValue
  sellTax: PendingValue
  liquidityStatus: PendingValue
  ownershipStatus: PendingValue
  launchStatus: PendingValue
  links: TokenLinks
  siteUrl: string | null
}

export const token: TokenConfig = {
  name: 'Ballon Winner 2026',
  ticker: 'TOPGAS',
  displayTicker: '$TOPGAS',
  chainId: 1,
  network: 'Ethereum mainnet',
  tagline: 'The Golden Ball for the Biggest Gas Bill.',
  secondaryHook: 'Forget goals. Show us your gas bill.',
  contractAddress: null,
  totalSupply: null,
  buyTax: null,
  sellTax: null,
  liquidityStatus: null,
  ownershipStatus: null,
  launchStatus: null,
  links: { buy: null, chart: null, x: null, telegram: null },
  siteUrl: 'https://jackmiller825.github.io/TOPGAS',
}

const ADDRESS_SHAPE = /^0x[a-fA-F0-9]{40}$/

export function confirmedAddress(value: PendingValue): string | null {
  if (typeof value !== 'string') return null
  return ADDRESS_SHAPE.test(value) ? value : null
}

export function confirmedHttps(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || !url.hostname) return null
    return url.toString()
  } catch {
    return null
  }
}

export function formatFact(value: PendingValue): string {
  if (value == null || value === '') return '[TOKENOMICS]'
  return String(value)
}

export function assetPath(filename: string): string {
  return `${import.meta.env.BASE_URL}assets/topgas/${filename}`
}

/** Local verification only. Vite removes this branch from production builds. */
export function resolveToken(source: TokenConfig = token): TokenConfig {
  if (!import.meta.env.DEV || typeof window === 'undefined') return source
  const fixture = new URLSearchParams(window.location.search).get('fixture')
  if (fixture !== 'confirmed') return source
  return {
    ...source,
    contractAddress: '0x1111111111111111111111111111111111111111',
    totalSupply: '1000000000',
    buyTax: '0',
    sellTax: '0',
    liquidityStatus: 'Local fixture only',
    ownershipStatus: 'Local fixture only',
    launchStatus: 'Local fixture only',
    links: {
      buy: 'https://example.com/topgas-buy-fixture',
      chart: 'https://example.com/topgas-chart-fixture',
      x: 'https://example.com/topgas-x-fixture',
      telegram: 'https://example.com/topgas-telegram-fixture',
    },
  }
}
