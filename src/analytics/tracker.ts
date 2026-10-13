import { apiOrigin, apiUrl } from '../dashboard/origin.ts'
import { isDashboardLocation } from '../dashboard/path.ts'

type CollectType = 'pageview' | 'heartbeat' | 'section' | 'click'
type Cta = 'buy' | 'chart' | 'telegram' | 'x'

let latestSection = 'home'
let pageViewSent = false

function trackingRefused(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string | null }
  if (nav.globalPrivacyControl) return true
  const dnt = nav.doNotTrack
  return dnt === '1' || dnt === 'yes'
}

function utmFields(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
  }
}

async function post(route: '/api/analytics/collect' | '/api/analytics/heartbeat', body: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch(apiUrl(route), {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
      credentials: apiOrigin() ? 'include' : 'same-origin',
      cache: 'no-store',
      keepalive: true,
    })
    return response.ok
  } catch {
    return false
  }
}

function payload(type: CollectType, eventId: string, click?: Cta): Record<string, unknown> {
  return {
    type,
    eventId,
    path: `${window.location.pathname}${window.location.search}`,
    section: latestSection,
    referrer: document.referrer,
    click,
    ...utmFields(),
  }
}

export function noteSection(section: string) {
  latestSection = section
}

export function trackCta(click: Cta) {
  if (isDashboardLocation() || trackingRefused()) return
  const eventId = crypto.randomUUID()
  void post('/api/analytics/collect', payload('click', eventId, click))
}

export function startPublicAnalytics(): () => void {
  if (isDashboardLocation() || trackingRefused()) return () => {}
  const hash = window.location.hash.replace('#', '')
  if (hash) latestSection = hash
  if (!pageViewSent) {
    pageViewSent = true
    const pageEventId = crypto.randomUUID()
    void post('/api/analytics/collect', payload('pageview', pageEventId)).then((ok) => {
      if (!ok) void post('/api/analytics/collect', payload('pageview', pageEventId))
      if (document.visibilityState === 'visible') beat()
    })
  }

  let heartbeatId = crypto.randomUUID()
  let timer = 0

  const beat = () => {
    if (document.visibilityState !== 'visible') return
    const id = heartbeatId
    void post('/api/analytics/heartbeat', payload('heartbeat', id)).then((ok) => {
      if (ok) heartbeatId = crypto.randomUUID()
    })
  }

  const arm = () => {
    window.clearInterval(timer)
    if (document.visibilityState !== 'visible') return
    timer = window.setInterval(beat, 30000)
  }

  const onSection = (event: Event) => {
    const section = (event as CustomEvent<string>).detail
    if (!section || section === latestSection) return
    latestSection = section
    void post('/api/analytics/collect', payload('section', crypto.randomUUID()))
  }

  const onVisibility = () => {
    if (document.visibilityState === 'visible') {
      beat()
      arm()
    }
    else window.clearInterval(timer)
  }

  window.addEventListener('topgas-section', onSection)
  document.addEventListener('visibilitychange', onVisibility)
  if (document.visibilityState === 'visible') arm()

  return () => {
    window.clearInterval(timer)
    window.removeEventListener('topgas-section', onSection)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}
