import { useEffect, useState } from 'react'
import { navigation, type SectionId } from '../config/navigation.ts'

function isSectionId(id: string): id is SectionId {
  return navigation.some((item) => item.id === id)
}

export function useActiveSection() {
  const [active, setActive] = useState<SectionId>('home')

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const header = document.querySelector('.site-header')
      const line = (header?.getBoundingClientRect().height ?? 84) + 24
      let current: SectionId = 'home'
      for (const item of navigation) {
        const section = document.getElementById(item.id)
        if (!section || !isSectionId(section.id)) continue
        if (section.getBoundingClientRect().top <= line) current = section.id
      }
      setActive(current)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    const timers = [window.setTimeout(update, 0), window.setTimeout(update, 150)]
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('hashchange', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('hashchange', update)
      timers.forEach((timer) => window.clearTimeout(timer))
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return active
}
