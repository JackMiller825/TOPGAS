# Ballon Winner 2026 / $TOPGAS — single-page design proposal

All previews are static design mockups of the same document, route `/`. They are not working controls. Final production artwork waits for design feedback.

## Reference review
Reviewed supplied GOAL and Gazzetta page content and indexed Transfermarkt, kicker and BBC football pages. Some homepages blocked direct retrieval; no claim of a complete visual audit. Adapt editorial headlines, rankings, compact score strips and grouped statistics; retain original purple/gold identity rather than copying their branding.
References: https://www.transfermarkt.com/ https://www.goal.com/ https://www.gazzetta.it/ https://www.kicker.de/ https://www.bbc.com/sport/football

## Page sequence and copy
1. Hero `home`: Ballon Winner 2026 / $TOPGAS. “Forget goals. Show us your gas bill.” “The Golden Ball for the Biggest Gas Bill.” Buy $TOPGAS / View chart actions await confirmed destinations. Kane's 20.26 ETH receipt is central.
2. Story `story`: “20.26 ETH. One golden ball.” “They brought football stats. Kane brought the gas receipt. In our imaginary awards night, the biggest bill wins.” Editorial story cards: The contenders / The receipt / The golden ball.
3. Tokenomics `tokenomics`: Ethereum mainnet. Supply, tax and liquidity [TOKENOMICS]. Contract [CONTRACT_ADDRESS]. No inferred LP burn, renunciation, launch status or audit. Receipt amounts are story props, not tokenomics.
4. Buying `how-to-buy`: Create a wallet / Add ETH for purchase and network fees / Verify the official contract / Swap on the confirmed DEX. Exact DEX, pool and links pending. No wallet connection needed for informational site.
5. Community `community`: “Join the gas-side commentary.” Telegram matchday chat and X highlights [OFFICIAL_SOCIAL_LINKS]. No invented member counts.
6. FAQ `faq`: Is this official? Independent parody, no player or organizer endorsement. Why 20.26? It represents 2026. What is gas? Ethereum transaction fee, separate from token purchase value. Where is the contract? Pending confirmation.
7. Footer: Brand, repeated same-page anchors, confirmed external socials when supplied, independent fan-made parody and brief token-risk notice.

## Visual direction
Deep plum #210B38, violet #6D28D9, gold #F5C542, cream #FFF8E7, ink #21152B. Condensed sports display headings (e.g. locally hosted Barlow Condensed), clean sans body (e.g. Inter), monospace statistics. Content max width 1200px, desktop gutters 32px and mobile 20px. Gold accents carry the stadium hero into cream editorial spreads, tactical buying cards, violet community and calm FAQ. Avoid excessive ornamental UI; illustrations provide the gold spectacle.
Desktop hero split text/art with a compact fictional standings strip. Mobile stacks text, actions, art and standings. Story and buying grids become vertical; token cards become two columns then one at very narrow widths. Community cards stack. FAQ single column on mobile. Body minimum 16px and touch targets minimum 44px. Numerical receipts are decorative fiction: Kane 20.26 (12 + 8 + .26), Ronaldo 12.34, Messi 6.78, Mbappe 2.45, Haaland .89 ETH. Do not present as actual spending, football standings or confirmed winner.

## Navigation implementation requirements
| Label | href | section ID |
|---|---|---|
| Home | #home | home |
| Story | #story | story |
| Tokenomics | #tokenomics | tokenomics |
| How to Buy | #how-to-buy | how-to-buy |
| Community | #community | community |
| FAQ | #faq | faq |

Use real anchors in one document. No separate section routes. Smooth scrolling except immediate movement under prefers-reduced-motion. Use scroll-margin-top matching sticky header height plus 16px. IntersectionObserver updates aria-current and visible gold underline; direct hash URLs and browser history remain usable. Do not hijack wheel, touch, PageDown, Space or arrow-key scrolling. Add skip-to-content link and visible keyboard focus.
Desktop shows all links; mobile uses button with aria-expanded and aria-controls, same links in a labeled navigation panel. Close on selection and Escape, restore focus to toggle when dismissed. Use an accessible disclosure rather than modal focus trapping unless implemented as a true dialog. Account for sticky target offset on initial direct hash load.

## Interaction states and motion
Preview 09 shows active link, focus ring, open mobile menu and future copy-success state. Contract copy stays disabled while placeholder is present; after confirmation copy real address, report success in an aria-live region, and allow retry on failure. Unconfirmed buy/chart/social destinations are visibly pending and disabled, never fake links. FAQ uses keyboard-operable buttons with aria-expanded and associated panels.
Gold buttons change brightness on hover; focus stays equally visible. Optional trophy subtle 2D tilt <=4 degrees on pointer-capable devices only; reset on pointer exit. Optional slow hero confetti and 150ms card fade; stop all decorative motion under reduced motion. No scroll locking, autoplay media, mandatory 3D or heavy animation library. Mockups illustrate representative states, not functioning animation.

## Preview coverage
01 desktop entire page; 02 mobile entire page; 03–08 desktop hero/story/tokenomics/buying/community/FAQ; 09 desktop and mobile header/footer/menu states; 10 mobile hero; 11 contiguous mobile story/tokenomics; 12 mobile buying; 13 contiguous mobile community/FAQ/footer. Detailed panels supplement reduced-scale full-page overviews. All depict the same section order. Image-generated small copy is illustrative: this document is the authoritative build copy and behavior specification.

## Proposed production artwork — do not generate before feedback
| Filename | Dimensions | Transparency | Placement |
|---|---|---|---|
| topgas-mascot-trophy-receipt.png | 1600 x 1800 | Real alpha | Hero Kane with trophy and 20.26 receipt |
| topgas-contenders-lineup.png | 2000 x 900 | Real alpha | Story/fictional standings illustration |
| topgas-kane-portrait.png | 512 x 512 | Real alpha | Standing row/avatar |
| topgas-ronaldo-portrait.png | 512 x 512 | Real alpha | Standing row/avatar |
| topgas-messi-portrait.png | 512 x 512 | Real alpha | Standing row/avatar |
| topgas-mbappe-portrait.png | 512 x 512 | Real alpha | Standing row/avatar |
| topgas-haaland-portrait.png | 512 x 512 | Real alpha | Standing row/avatar |
| topgas-stadium-background.webp | 2400 x 1350 | Opaque | Hero backdrop |
| topgas-community-celebration.png | 1600 x 1000 | Real alpha | Community fan-zone |
| topgas-golden-trophy.png | 800 x 1000 | Real alpha | Story accents |
| topgas-social-preview.png | 1200 x 630 | Opaque | Sharing metadata |

Reuse existing topgas-logo-transparent.png (1024 square) in header/footer and approved banners where useful. Create simple pitch lines, dividers, receipt cards, interface icons and glows in CSS/SVG at build time. Keep all live copy/buttons as HTML, never bake UI into production imagery. No new final assets produced in this stage.

## Review clarifications
Mobile overview 02 is assembled from mobile detail panels in scroll order; 02a–02c are contiguous readable segments of that same page. Detail boards sometimes repeat hero/header context; do not repeat those sections in implementation. Header variations and tiny generated copy are illustrative; use the anchor, type and copy specification above as authoritative. Mobile collapsed header shows only compact logo and menu toggle (hide desktop links). Component board right-hand stacked footer is the mobile footer regardless of its generated label. Contract tooltips represent a future confirmed state only.
