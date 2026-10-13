import { confirmedHttps } from '../config/token.ts'

type OfficialLinkProps = {
  href: string | null
  label: string
  pendingLabel: string
  className?: string
  onActivate?: () => void
}

export function OfficialLink({ href, label, pendingLabel, className, onActivate }: OfficialLinkProps) {
  const destination = confirmedHttps(href)
  if (!destination) {
    return (
      <button type="button" className={className} disabled>
        {pendingLabel}
      </button>
    )
  }

  return (
    <a
      className={className}
      href={destination}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onActivate}
    >
      {label}
    </a>
  )
}
