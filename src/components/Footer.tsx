import { trackCta } from '../analytics/tracker.ts'
import { navigation } from '../config/navigation.ts'
import { confirmedHttps } from '../config/token.ts'
import { useTokenConfig } from './ContractAddress.tsx'
import { ArtImage } from './ArtImage.tsx'

export function Footer() {
  const config = useTokenConfig()
  const telegram = confirmedHttps(config.links.telegram)
  const x = confirmedHttps(config.links.x)

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <a className="brand" href="#home">
            <ArtImage filename="topgas-logo-transparent.png" alt="" width={1024} height={1024} />
            <span className="wordmark">TOPGAS</span>
          </a>
          <p className="footer-name">Ballon Winner 2026</p>
          <p>{config.tagline}</p>
        </div>
        <div className="footer-social">
          {telegram && (
            <a href={telegram} target="_blank" rel="noopener noreferrer" onClick={() => trackCta('telegram')}>
              Join Telegram
            </a>
          )}
          {x && (
            <a href={x} target="_blank" rel="noopener noreferrer" onClick={() => trackCta('x')}>
              Follow on X
            </a>
          )}
          <a className="back-top" href="#home">
            Back to kickoff ↑
          </a>
        </div>
        <nav aria-label="Footer">
          {navigation.map((item) => (
            <a key={item.id} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
