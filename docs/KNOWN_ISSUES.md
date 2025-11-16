# Known Issues

## React Error #423 / Duplicate <html><body>
- Root layout must be the **only** component that renders <html> and <body>.
- Segment layouts (like pp/[locale]/layout.tsx) must return providers and markup **without** their own document wrapper.
- When error #423 appears, check for multiple <html> nodes or portals injecting into document.documentElement.

### Fix Applied (Nov 16, 2025)
- pp/layout.tsx now owns the single wrapper.
- Locale layout only mounts NextIntlClientProvider, ThemeProvider, site chrome.

## Flash of Unstyled Content (FOUC)
- Browsers paint raw HTML before fonts/tokens load, especially on low-bandwidth connections.
- A lightweight loader overlay (html.preload) masks the UI until window.load or a 2s fail-safe.
- Critical CSS lives in pp/layout.tsx so base colors, background and typography stay readable even without JS.

## Missing Favicon
- Browsers always request /favicon.ico.
- If the asset is absent youll see 404s in DevTools and some clients will show a blank tab icon.
- Keep public/favicon.ico synced with public/favicon.svg.
