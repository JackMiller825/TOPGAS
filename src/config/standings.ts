export type FeeBreakdown = {
  swap: string
  mint: string
  transfer: string
  total: string
}

export type Contender = {
  id: string
  place: number
  name: string
  fees: FeeBreakdown
  portrait: string
}

/** Illustrative meme figures. They are not wallet activity, rankings, or tokenomics. */
export const contenders: readonly Contender[] = [
  {
    id: 'kane',
    place: 1,
    name: 'Kane',
    fees: { swap: '12.00', mint: '8.00', transfer: '0.26', total: '20.26' },
    portrait: 'topgas-kane-portrait.png',
  },
  {
    id: 'ronaldo',
    place: 2,
    name: 'Ronaldo',
    fees: { swap: '6.00', mint: '4.00', transfer: '2.34', total: '12.34' },
    portrait: 'topgas-ronaldo-portrait.png',
  },
  {
    id: 'messi',
    place: 3,
    name: 'Messi',
    fees: { swap: '3.00', mint: '2.00', transfer: '1.78', total: '6.78' },
    portrait: 'topgas-messi-portrait.png',
  },
  {
    id: 'mbappe',
    place: 4,
    name: 'Mbappe',
    fees: { swap: '1.00', mint: '1.00', transfer: '0.45', total: '2.45' },
    portrait: 'topgas-mbappe-portrait.png',
  },
  {
    id: 'haaland',
    place: 5,
    name: 'Haaland',
    fees: { swap: '0.40', mint: '0.30', transfer: '0.19', total: '0.89' },
    portrait: 'topgas-haaland-portrait.png',
  },
]

export const MAX_GAS_TOTAL = '20.26'

export function toHundredths(value: string): number {
  const [whole, fraction = ''] = value.split('.')
  const cents = `${fraction}00`.slice(0, 2)
  return Number(whole) * 100 + Number(cents)
}

export function feesMatch(contender: Contender): boolean {
  const { swap, mint, transfer, total } = contender.fees
  return toHundredths(swap) + toHundredths(mint) + toHundredths(transfer) === toHundredths(total)
}

export function barPercent(total: string): number {
  return (toHundredths(total) / toHundredths(MAX_GAS_TOTAL)) * 100
}

export function getContender(id: string): Contender {
  return contenders.find((contender) => contender.id === id) ?? contenders[0]
}

if (import.meta.env.DEV) {
  for (const contender of contenders) {
    if (!feesMatch(contender)) {
      console.error(`Standings fee mismatch for ${contender.name}`)
    }
  }
}
