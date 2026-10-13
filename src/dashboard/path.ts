export function isDashboardLocation(pathname = window.location.pathname): boolean {
  let path = pathname
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path === '/dashboard' || path.endsWith('/dashboard')
}
