# agentos.sh contact-form Worker

Cloudflare Worker that relays `agentos.sh/contact` form submissions to `team@frame.dev` via the Resend API.

## One-time deploy

You need:
- A Cloudflare account (free works) — the same one your zones live under.
- The Resend API key from `apps/wilds-ai/.env` (`RESEND_API_KEY=re_...`).
- `wrangler` CLI installed: `npm i -g wrangler`.

Steps from this directory:

```bash
cd apps/agentos.sh/workers/contact-form

# 1. Authenticate wrangler (browser OAuth, takes 30s)
wrangler login

# 2. Set the Resend API key as a Worker secret (paste when prompted)
wrangler secret put RESEND_API_KEY

# 3. Deploy
wrangler deploy
```

After deploy, wrangler prints a URL like:

```
https://contact-form.<your-cf-subdomain>.workers.dev
```

That URL is the Worker. Form POSTs go to `<that-url>/contact` (the `/contact` part is fine — the Worker accepts any path on POST).

## Bind to a stable hostname (recommended)

Two routes you might want:

| Public URL | Where to configure |
|---|---|
| `contact.frame.dev/contact` | Uncomment `[[routes]]` in `wrangler.toml`, then add a CNAME `contact -> contact-form.<account>.workers.dev` in the frame.dev zone (Cloudflare DNS, orange cloud / proxied). Re-run `wrangler deploy`. |
| `agentos.sh/api/contact` | Add `[[routes]] pattern = "agentos.sh/api/contact"` in `wrangler.toml`, since agentos.sh is also Cloudflare-proxied. |

Once a route is live, update `NEXT_PUBLIC_CONTACT_WORKER_URL` in `apps/agentos.sh/.env` and redeploy the static site so the form points at the production URL.

## What the form sends

```json
{
  "name": "string",
  "email": "string",
  "subject": "string (optional)",
  "message": "string (10-10000 chars)",
  "website": "string (honeypot — must be empty)"
}
```

The Worker re-validates server-side, drops honeypot-filled submissions silently, and rejects malformed payloads with HTTP 400.

## What recipients see

Email arrives at `team@frame.dev` with:
- **From:** `AgentOS Contact <noreply@frame.dev>` (override via `FROM_ADDRESS`).
- **Reply-To:** the submitter's email (so hitting reply works).
- **Subject:** `[agentos.sh] <user-provided subject or default>`.
- Plain-text body and styled HTML variant.

## Tail logs

```bash
wrangler tail
```

Then submit the form once from staging or production to see the Worker invocation in real time.

## Rotating the Resend key

```bash
wrangler secret delete RESEND_API_KEY
wrangler secret put RESEND_API_KEY
# paste the new key
```

No redeploy needed; secrets refresh on the next request.
