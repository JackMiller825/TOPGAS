import { useEffect, useRef, type ReactNode } from 'react'
import { confirmedAddress, confirmedHttps } from '../config/token.ts'
import { useTokenConfig } from './ContractAddress.tsx'

type FaqItem = {
  question: string
  answer: ReactNode
}

export function FAQ() {
  const config = useTokenConfig()
  const hasAddress = Boolean(confirmedAddress(config.contractAddress))
  const hasBuy = Boolean(confirmedHttps(config.links.buy))

  const items: FaqItem[] = [
    {
      question: 'What is TOPGAS?',
      answer: 'A football-and-Ethereum meme concept where the golden ball goes to the biggest fictional gas bill.',
    },
    {
      question: 'Why 20.26 ETH?',
      answer: "Kane's signature receipt spells out the project's 2026 theme: 12.00 + 8.00 + 0.26 = 20.26 ETH.",
    },
    {
      question: 'Is this an official award or player project?',
      answer: "No. This is a fictional parody concept with no claimed player endorsement or affiliation with the Ballon d'Or.",
    },
    {
      question: 'What is gas?',
      answer:
        'Gas is the network fee paid to process an Ethereum transaction. It is separate from the token purchase amount. A bigger gas bill does not mean a more profitable trade.',
    },
    {
      question: 'Where is the contract?',
      answer: hasAddress ? (
        <>
          The official contract address is shown in the <a href="#tokenomics">Tokenomics</a> section. Verify the
          complete address before trading.
        </>
      ) : (
        'The official contract address is pending confirmation. Once confirmed, it will appear in the Tokenomics section.'
      ),
    },
    {
      question: 'Can I buy the token here?',
      answer: hasBuy ? (
        <>
          Use the confirmed Buy {config.displayTicker} link to open the trading destination. This website does not
          execute swaps or ask for your recovery phrase.
        </>
      ) : (
        'A confirmed contract and trading link have not been supplied for this website. Buying controls remain unavailable until those details are confirmed.'
      ),
    },
  ]

  return (
    <section id="faq" className="section section-cream">
      <div className="wrap faq-wrap">
        <p className="eyebrow">05 / The post-match interview</p>
        <h2>Before the final whistle.</h2>
        <div className="faq-list">
          {items.map((item, index) => (
            <FaqRow key={item.question} question={item.question} answer={item.answer} initiallyOpen={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqRow({ question, answer, initiallyOpen }: { question: string; answer: ReactNode; initiallyOpen?: boolean }) {
  const ref = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (initiallyOpen && ref.current) ref.current.open = true
  }, [initiallyOpen])

  return (
    <details ref={ref}>
      <summary>
        <h3>{question}</h3>
      </summary>
      <div className="faq-answer">{answer}</div>
    </details>
  )
}
