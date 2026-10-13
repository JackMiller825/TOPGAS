import path from 'node:path'
import { createApp } from '../server/createApp.ts'
import { ensureSecrets } from '../server/secrets.ts'

const dataDir = process.env.TOPGAS_DATA_DIR ?? path.join(process.cwd(), 'data')
ensureSecrets(dataDir)
const app = createApp({
  dataDir,
  nodeEnv: 'production',
  classifyLocalHost: false,
})
const ready = app.hasPassword()
app.close()

if (!ready) {
  console.error('Set DASHBOARD_PASSWORD and run setup again. No password was stored.')
  process.exit(1)
}

console.log('Server secrets are in data/secrets.json.')
console.log('Dashboard password is stored as a hash in the private database.')
console.log('Start the site with npm start after npm run build.')
