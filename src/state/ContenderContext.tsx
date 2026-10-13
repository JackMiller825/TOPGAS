import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { contenders, getContender, type Contender } from '../config/standings.ts'

type ContenderContextValue = {
  selectedId: string
  selected: Contender
  select: (id: string) => void
}

const ContenderContext = createContext<ContenderContextValue | null>(null)

export function ContenderProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState(contenders[0].id)
  const [announcement, setAnnouncement] = useState('')
  const selected = getContender(selectedId)

  const select = useCallback((id: string) => {
    setSelectedId(id)
    const next = getContender(id)
    setAnnouncement(`${next.name}, place ${next.place}, ${next.fees.total} ETH`)
  }, [])

  const value = useMemo(
    () => ({ selectedId, selected, select }),
    [selected, selectedId, select],
  )

  return (
    <ContenderContext.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </ContenderContext.Provider>
  )
}

export function useContender() {
  const value = useContext(ContenderContext)
  if (!value) throw new Error('useContender must be used within ContenderProvider')
  return value
}
