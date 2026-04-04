# Project Guidelines

## Project Overview
- Mona Mayhem is an Astro v5 Node server app template with a minimal app surface: one page and one API route.
- Treat workshop content as reference material only; do not mirror workshop step instructions into code or docs unless explicitly requested.
- Keep changes focused on product code in src and shared assets in public unless a task explicitly targets docs.

## Architecture
- Astro page routes live under src/pages. The current page entry is src/pages/index.astro.
- API routes live under src/pages/api. The dynamic endpoint src/pages/api/contributions/[username].ts is the GitHub contribution data entry point.
- Server output is configured in astro.config.mjs with the Node adapter and standalone mode, so features should be implemented with server runtime compatibility in mind.

## Build And Dev Commands
- Install dependencies: npm install
- Start local dev server: npm run dev
- Create production build: npm run build
- Preview production build locally: npm run preview
- Run Astro CLI directly when needed: npm run astro

## Astro And TypeScript Best Practices
- Prefer Astro-first solutions for rendering and routing before introducing extra client-side complexity.
- Keep server logic in Astro API routes typed with Astro types such as APIRoute.
- For dynamic server endpoints, keep export const prerender = false unless static behavior is explicitly desired.
- Return explicit HTTP status codes and JSON content-type headers from API routes.
- Follow strict typing from tsconfig.json (astro/tsconfigs/strict) and avoid introducing any.
- Use import type for type-only imports in TypeScript files.

## Conventions
- Preserve existing formatting style in touched files (tabs in source files where already used).
- Keep instructions concise and link to existing docs instead of duplicating long explanations.
- Prefer updating README.md for user-facing setup details and docs/* for static workshop site content.

## Design Guide
- Theme direction: retro arcade with CRT-inspired atmosphere, neon accents, and dark sci-fi contrast.
- Primary background: #0a0a1a.
- Accent colors:
- Neon green: #5fed83.
- Neon purple: #8a2be2.
- Supporting neutrals: high-contrast light text for readability over dark panels; muted blue-gray copy for secondary text.
- Typography:
- Display font: Press Start 2P for headings, labels, badges, and high-emphasis UI text.
- Body font: keep a readable sans-serif for paragraphs and dense data text.
- Font usage rule: avoid using Press Start 2P for long body paragraphs due to legibility constraints.
- Animation style:
- Neon pulse and glow for hero/title elements.
- Subtle CRT scanline overlays and vignette effects for environmental depth.
- Gradient-shift motion for key game-like badges (for example, VS markers).
- Shimmer/shine overlays for result cards; keep intensity moderate to preserve text readability.
- Hover glow micro-interactions for contribution cells and key interactive controls.
- Motion principles:
- Favor smooth, purposeful loops over rapid flashing.
- Keep animation durations moderate and avoid stacking too many high-intensity effects simultaneously.
- Always include a prefers-reduced-motion fallback that disables non-essential animation.
- Accessibility and contrast:
- Maintain clear color contrast for text and controls against the dark background.
- Ensure animation does not obscure critical data (usernames, totals, status, date ranges).
- Preserve obvious focus states for keyboard navigation.

## Reference Docs
- See README.md for project setup, prerequisites, and stack summary.
- See astro.config.mjs and tsconfig.json for runtime and type-checking constraints.
- See docs/ for static workshop site assets and localized pages.