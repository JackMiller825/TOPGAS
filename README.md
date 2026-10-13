# Ballon Winner 2026 / $TOPGAS

Single-page stadium site for the fictional Ballon Winner 2026 parody. Editable facts live in `src/config/token.ts`.

## Pending configuration

These values are intentionally empty until a verified source supplies them:

- Contract address
- Total supply
- Buy tax and sell tax
- Liquidity status
- Ownership status
- Launch status
- Official buy, chart, X, and Telegram links

The site renders `[CONTRACT_ADDRESS]`, `[TOKENOMICS]`, and `[OFFICIAL_SOCIAL_LINKS]` while those fields are null. Do not invent them.

## Deployment

Public site: https://topgas.online/

GitHub Pages publishes the `dist` build and redirects https://jackmiller825.github.io/TOPGAS/ to that domain. Vite `base` is `/` because the custom domain serves the site from the root. `public/CNAME` keeps the domain attached. Fragments such as `/#story` are handled by the browser.

Local checks:

```bash
npm run dev
npm run build
npm run lint
```

Dev server path: `http://localhost:5173/`. Add `?fixture=confirmed` in development to exercise copy-address and confirmed-link states. That fixture is removed from production builds.

## Visitor dashboard

GitHub Pages only serves the static site. It cannot check a password, keep a session, or store visitor records. The public Pages site stays at the URL above. The password dashboard runs only when this Node server is the host.

The server needs Node 24. One-time setup reads `DASHBOARD_PASSWORD` from the environment, stores a hash in `data/analytics.sqlite`, and writes generated session and encryption keys to `data/secrets.json`. Those files are not committed. Setup does not replace a password that is already stored.

```bash
npm run setup
npm run build
npm start
```

Local URLs when the server is running: `http://127.0.0.1:4173/` and `http://127.0.0.1:4173/dashboard`. `npm run dev` exposes the same API for local development. Development and localhost traffic is excluded from the default counts; use the dashboard toggle to include it.

If a TLS proxy terminates HTTPS in front of the Node process, set `TRUST_PROXY=1`, `TRUSTED_PROXIES` to that proxy's connecting address, and optionally `TRUSTED_IP_HEADER` (default `cf-connecting-ip`). Without that, visitor IPs are stored as unavailable and the session cookie is not marked Secure. This password does not replace a hosting platform's own sign-in.
