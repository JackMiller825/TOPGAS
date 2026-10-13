import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'

export function useGsapEnter(scope: RefObject<HTMLElement | null>, selector: string, reduced: boolean) {
  useEffect(() => {
    const root = scope.current
    if (!root || reduced) return

    let observer: IntersectionObserver | null = null
    const context = gsap.context(() => {
      const targets = root.querySelectorAll(selector)
      if (!targets.length) return
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          gsap.fromTo(
            targets,
            { y: 26 },
            { y: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', overwrite: 'auto' },
          )
          observer?.disconnect()
        },
        { threshold: 0.18 },
      )
      observer.observe(root)
    }, root)

    return () => {
      observer?.disconnect()
      context.revert()
    }
  }, [reduced, scope, selector])
}
