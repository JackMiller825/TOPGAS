import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function pagesFallback(): Plugin {
  return {
    name: 'pages-fallback',
    apply: 'build',
    closeBundle() {
      const index = path.resolve('dist/index.html')
      if (fs.existsSync(index)) fs.copyFileSync(index, path.resolve('dist/404.html'))
    },
  }
}

function dashboardApi(): Plugin {
  return {
    name: 'topgas-dashboard-api',
    async configureServer(server) {
      try {
        const loaded = (await server.ssrLoadModule('/server/attach.ts')) as {
          attachApi: (target: typeof server) => Promise<void>
        }
        await loaded.attachApi(server)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error'
        console.error(`Dashboard API did not start. The public site is still available. ${message}`)
      }
    },
  }
}

// Project-site base for https://jackmiller825.github.io/TOPGAS/
export default defineConfig({
  plugins: [react(), dashboardApi(), pagesFallback()],
  base: '/TOPGAS/',
})
