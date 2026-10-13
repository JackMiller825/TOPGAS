import { useEffect, useRef, useState } from 'react'
import { navigation } from '../config/navigation.ts'
import { useActiveSection } from '../hooks/useActiveSection.ts'
import { useHeaderOffset } from '../hooks/useHeaderOffset.ts'
import { ArtImage } from './ArtImage.tsx'

export function Header() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  useHeaderOffset()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="brand" href="#home">
          <ArtImage filename="topgas-logo-transparent.png" alt="" width={1024} height={1024} eager />
          <span className="brand-text">
            <span className="wordmark">TOPGAS</span>
            <span className="brand-sub">Ballon Winner 2026</span>
          </span>
        </a>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
        <nav id="primary-menu" className={open ? 'nav-panel is-open' : 'nav-panel'} aria-label="Primary">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.href}
              aria-current={active === item.id ? 'location' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <p className="edition">2026 Edition</p>
      </div>
    </header>
  )
}
