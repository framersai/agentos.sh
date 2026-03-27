<!-- BRANDING-LOGOS -->
<p align="center">
  <a href="https://agentos.sh"><img src="public/logos/agentos-primary-no-tagline.svg" alt="AgentOS" height="64" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://frame.dev"><img src="public/logos/frame-logo-no-subtitle.svg" alt="Frame.dev" height="40" /></a>
</p>

# AgentOS Site (agentos.sh)

Next.js + Tailwind marketing surface for the AgentOS runtime. This site is designed to live at `agentos.sh` and mirrors the Frame.dev aesthetic with light/dark theming, motion highlights, and roadmap callouts.

## Features

- App Router (Next 14) with server components + streaming-ready sections  
- Tailwind design system with utility helpers, glassmorphism treatment, and dark mode (`next-themes`)  
- Framer Motion animations on hero content  
- Lucide iconography and responsive layout tuned for product storytelling  
- Ready-to-link CTAs into GitHub, documentation, and marketing pipelines

## Commands

```bash
pnpm dev         # standard next dev server (no doc watcher)
pnpm dev:full    # next dev + TypeDoc watcher (doc search hot reload)
pnpm build       # regenerates docs, copies them to public/docs-generated, then next build
pnpm start       # serve production build
pnpm lint        # Next lint rules
pnpm typecheck   # TypeScript no-emit check
pnpm docs:watch  # (optional) run TypeDoc watcher without starting dev server
```

## Structure

- `app/page.tsx` – primary landing experience  
- `components/` – client-side helpers like the theme toggle provider  
- `tailwind.config.ts` – shared tokens (brand palette, glass shadow, etc.)

The landing site is intentionally decoupled from the proprietary Voice Chat Assistant frontend so it can be published or deployed independently.

## Documentation Search

The header search trigger (keyboard `/` or `Ctrl/⌘ + K`) now fetches a lightweight
`search-docs.json` manifest from `https://docs.agentos.sh` instead of pulling the
full local-search lunr bundle into the marketing site.

1. `apps/agentos-live-docs/plugins/search-manifest.js` walks the built docs HTML and writes `search-docs.json` during the docs-site build.  
2. `apps/agentos.sh/components/docs/DocSearch.tsx` fetches that manifest, scores title/content matches inline, and falls back to curated quick links if the manifest is unavailable.  
3. For local docs-site generation, run the docs app build (`npm run build` in `apps/agentos-live-docs`) so the manifest is regenerated alongside the published docs output.

The older TypeDoc search indexes under `public/docs-generated/.../search-index.json`
are still used for the API docs experience on `agentos.sh`, but the marketing-site
modal search no longer depends on them.

## Media Assets

Some sections render optional media. When files are missing, a placeholder explaining the expected filename/path appears so you can deploy safely:

| Location | Expected path | Notes |
|----------|---------------|-------|
| Hero loop | `public/media/landing/voice-hero-loop.mp4` (+ optional `.webm`, `voice-hero-poster.jpg`) | Short 8–12 s clip highlighting the voice pipeline. |
| Architecture diagram | `public/media/diagrams/agentos-architecture-light.png` and `...-dark.png` | Used in the architecture overview; supply both themes for best results. |
| GMI layers diagram | `public/media/diagrams/gmi-layers-light.png` and `...-dark.png` | Illustrates how a GMI combines persona, memory, guardrails, and tools. |
| Voice pipeline diagram | `public/media/landing/voice-pipeline-light.svg` and `...-dark.svg` | Shows the capture → AgentOS → tool flow on the Voice Chat Assistant landing. |

If you prefer different names, adjust the `heroVideoSources` / `pipelineImageSources` constants in `app/page.tsx` (AgentOS) and `frontend/src/views/PublicHome.vue` (voice UI).

## Links
- Website: https://frame.dev
- AgentOS: https://agentos.sh
- Marketplace: https://vca.chat
- GitHub: https://github.com/framersai/agentos.sh
- npm: https://www.npmjs.com/org/framers

## Contributing & Security
- Contributing: https://github.com/manicinc/voice-chat-assistant/blob/master/.github/CONTRIBUTING.md
- Code of Conduct: https://github.com/manicinc/voice-chat-assistant/blob/master/.github/CODE_OF_CONDUCT.md
- Security Policy: https://github.com/manicinc/voice-chat-assistant/blob/master/.github/SECURITY.md

---

<p align="center">
  <a href="https://frame.dev">
    <img src="public/logos/frame-logo-no-subtitle.svg" alt="Frame.dev" height="40" />
  </a>
</p>
