import { useEffect, useState } from 'react'

function readSaveData() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return Boolean(connection?.saveData)
}

export function useSaveData() {
  const [saveData, setSaveData] = useState(readSaveData)

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean }
    }).connection
    if (!connection) return
    const onChange = () => setSaveData(Boolean(connection.saveData))
    connection.addEventListener('change', onChange)
    return () => connection.removeEventListener('change', onChange)
  }, [])

  return saveData
}
