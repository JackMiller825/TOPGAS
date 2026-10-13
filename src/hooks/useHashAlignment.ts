import { useEffect } from 'react'

export function useHashAlignment() {
  useEffect(() => {
    const align = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!id) return
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'auto' })
    }

    align()
    const timer = window.setTimeout(align, 80)
    const fonts = document.fonts?.ready.then(align)
    return () => {
      window.clearTimeout(timer)
      void fonts
    }
  }, [])
}
