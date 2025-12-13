# 🎯 Quick Start: Analytics Setup

## Your Tracking IDs (Use for BOTH sites)

```
Google Analytics: G-4KEEK15KWZ
Microsoft Clarity: ukky5yykaj
```

## Setup (2 minutes)

### 1. Create `.env.local` in `apps/agentos.sh/`

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-4KEEK15KWZ
NEXT_PUBLIC_CLARITY_PROJECT_ID=ukky5yykaj
```

### 2. Done! 

Everything else is already configured. No GitHub Actions secrets needed.

## What You Get

✅ **Google Analytics 4** - Page views, events, user insights  
✅ **Microsoft Clarity** - Session recordings, heatmaps, UX insights  
✅ **GDPR Compliant** - Cookie consent banner with opt-in  
✅ **Comprehensive Tracking** - Scroll depth, time on page, clicks, searches, errors  
✅ **Works on Both Sites** - agentos.sh AND docs.agentos.sh  

## Dashboards

- **Analytics**: https://analytics.google.com/
- **Clarity**: https://clarity.microsoft.com/

## Test It

```bash
cd apps/agentos.sh
pnpm dev
# Open localhost:3000, accept cookies, check DevTools Console
```

That's it! 🚀
