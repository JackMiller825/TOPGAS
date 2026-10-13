export const navigation = [
  { id: 'home', href: '#home', label: 'Home' },
  { id: 'story', href: '#story', label: 'Story' },
  { id: 'tokenomics', href: '#tokenomics', label: 'Tokenomics' },
  { id: 'how-to-buy', href: '#how-to-buy', label: 'How to Buy' },
  { id: 'community', href: '#community', label: 'Community' },
] as const

export type SectionId = (typeof navigation)[number]['id']
