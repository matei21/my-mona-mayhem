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

## Reference Docs
- See README.md for project setup, prerequisites, and stack summary.
- See astro.config.mjs and tsconfig.json for runtime and type-checking constraints.
- See docs/ for static workshop site assets and localized pages.