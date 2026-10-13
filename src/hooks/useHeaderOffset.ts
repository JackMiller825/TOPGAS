import { useEffect } from 'react'

export function useHeaderOffset() {
  useEffect(() => {
    const header = document.querySelector('.site-header')
    if (!(header instanceof HTMLElement)) return

    const apply = () => {
      document.documentElement.style.setProperty('--header-offset', `${header.getBoundingClientRect().height}px`)
    }

    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(header)
    window.addEventListener('resize', apply)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', apply)
    }
  }, [])
}
