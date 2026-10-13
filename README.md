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

GitHub Pages project site: https://jackmiller825.github.io/TOPGAS/

Vite `base` is `/TOPGAS/`. The workflow in `.github/workflows/pages.yml` publishes the `dist` build. Fragments such as `/#story` are handled by the browser. There is no custom domain.

Local checks:

```bash
npm run dev
npm run build
npm run lint
```

Dev server path: `http://localhost:5173/TOPGAS/`. Add `?fixture=confirmed` in development to exercise copy-address and confirmed-link states. That fixture is removed from production builds.
