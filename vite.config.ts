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
      // Browsers that cached the previous /TOPGAS/ HTML still request these exact files.
      const assets = path.resolve('dist/assets')
      if (!fs.existsSync(assets)) return
      const legacy = path.resolve('dist/TOPGAS/assets')
      fs.mkdirSync(legacy, { recursive: true })
      const names = fs.readdirSync(assets)
      for (const name of names) {
        if (name.endsWith('.js')) fs.copyFileSync(path.join(assets, name), path.join(legacy, name))
      }
      const js = names.find((name) => /^index-.*\.js$/.test(name))
      const css = names.find((name) => /^index-.*\.css$/.test(name))
      if (js) {
        fs.copyFileSync(path.join(assets, js), path.join(legacy, 'index-CyUzMM2u.js'))
        for (const legacyName of ['index-BSCVoLQC.js', 'index-DTk6TEgC.js', 'index-C6lwwhIU.js', 'index-B3_Wx4lq.js', 'index-DY6EKBB7.js', 'index-DU7sgBGy.js', 'index-igq51qN5.js']) {
          if (js !== legacyName) fs.copyFileSync(path.join(assets, js), path.join(assets, legacyName))
        }
      }
      if (css) {
        fs.copyFileSync(path.join(assets, css), path.join(legacy, 'index-D85W7KUC.css'))
        for (const legacyName of ['index-CpIg0DWG.css', 'index-BAgfaOav.css', 'index-Ba6TQZqx.css', 'index-DoQxhyYE.css', 'index-CR_P6818.css']) {
          if (css !== legacyName) fs.copyFileSync(path.join(assets, css), path.join(assets, legacyName))
        }
      }
      const images = path.join(assets, 'topgas')
      if (fs.existsSync(images)) fs.cpSync(images, path.join(legacy, 'topgas'), { recursive: true })
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

// https://topgas.online/ serves this Pages site from the domain root.
export default defineConfig({
  plugins: [react(), dashboardApi(), pagesFallback()],
  base: '/',
})
