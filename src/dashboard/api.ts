export type ApiResult<T> = { ok: boolean; status: number; data: T }

export async function api<T>(path: string, init: { method?: string; body?: unknown; csrf?: string } = {}): Promise<ApiResult<T>> {
  const headers = new Headers({ accept: 'application/json' })
  if (init.body !== undefined) headers.set('content-type', 'application/json')
  if (init.csrf) headers.set('x-csrf-token', init.csrf)
  try {
    const response = await fetch(path, {
      method: init.method ?? 'GET',
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      credentials: 'same-origin',
      cache: 'no-store',
    })
    const text = await response.text()
    let data = {} as T
    if (text) {
      try {
        data = JSON.parse(text) as T
      } catch {
        data = {} as T
      }
    }
    return { ok: response.ok, status: response.status, data }
  } catch {
    return { ok: false, status: 0, data: {} as T }
  }
}

export function errorMessage(status: number, data: unknown, fallback: string): string {
  const message = data && typeof data === 'object' && 'error' in data ? data.error : undefined
  if (typeof message === 'string' && message) return message
  if (status === 0 || status === 404) return 'The dashboard service is unavailable on this host.'
  return fallback
}
