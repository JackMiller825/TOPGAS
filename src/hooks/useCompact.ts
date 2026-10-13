import { useEffect, useState } from 'react'

function queryCompact() {
  return window.matchMedia('(max-width: 767px)').matches
}

export function useCompact() {
  const [compact, setCompact] = useState(queryCompact)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const onChange = () => setCompact(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return compact
}
