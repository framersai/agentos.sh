/**
 * Cloudflare Worker — agentos.sh contact form relay.
 *
 * Receives a JSON POST from the static contact page, validates, and
 * forwards the message to team@frame.dev via the Resend API.
 *
 * Deployment surface:
 *   POST https://contact.frame.dev/contact   (or whatever route you bind)
 *
 * Required Worker secrets (set via `wrangler secret put` or dashboard):
 *   RESEND_API_KEY   — re_...   (the existing manic.agency Resend key)
 *
 * Optional Worker variables (in wrangler.toml [vars]):
 *   ALLOWED_ORIGIN   — `https://agentos.sh` (default `*` accepts all,
 *                      preferred for production lockdown)
 *   FROM_ADDRESS     — `AgentOS Contact <noreply@frame.dev>` (default)
 *   TO_ADDRESS       — `team@frame.dev` (default)
 *
 * The Worker is intentionally framework-free — no Hono / itty-router —
 * because the surface is a single endpoint and zero dependencies keeps
 * cold-starts at ~0ms.
 */

interface Env {
  RESEND_API_KEY: string;
  ALLOWED_ORIGIN?: string;
  FROM_ADDRESS?: string;
  TO_ADDRESS?: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  /** Honeypot field. Real users don't fill this; bots do. */
  website?: string;
}

/** Min/max bounds for each field to reject malformed or abusive input. */
const LIMITS = {
  name: { min: 1, max: 200 },
  email: { min: 5, max: 320 },
  subject: { min: 0, max: 200 },
  message: { min: 10, max: 10_000 },
} as const;

/** RFC 5321 / 5322 doesn't fit a regex, so we use a permissive one. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(
  body: unknown,
  status: number,
  origin: string,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

/** Strip ASCII control characters that have no business in form data. */
function clean(value: unknown): string {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001F\u007F]/g, '').trim()
    : '';
}

function validate(payload: ContactPayload): { ok: true } | { ok: false; reason: string } {
  const name = clean(payload.name);
  const email = clean(payload.email);
  const message = clean(payload.message);

  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) {
    return { ok: false, reason: 'Name is required.' };
  }
  if (email.length < LIMITS.email.min || email.length > LIMITS.email.max || !EMAIL_RE.test(email)) {
    return { ok: false, reason: 'Valid email is required.' };
  }
  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) {
    return { ok: false, reason: 'Message must be 10–10000 characters.' };
  }
  return { ok: true };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowedOrigin = env.ALLOWED_ORIGIN ?? '*';
    const fromAddress = env.FROM_ADDRESS ?? 'AgentOS Contact <noreply@frame.dev>';
    const toAddress = env.TO_ADDRESS ?? 'team@frame.dev';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'method_not_allowed' }, 405, allowedOrigin);
    }

    let payload: ContactPayload;
    try {
      payload = (await request.json()) as ContactPayload;
    } catch {
      return jsonResponse({ error: 'invalid_json' }, 400, allowedOrigin);
    }

    // Honeypot: silently 200 so bots don't retry, but never email.
    if (clean(payload.website).length > 0) {
      return jsonResponse({ ok: true, swallowed: true }, 200, allowedOrigin);
    }

    const result = validate(payload);
    if (!result.ok) {
      return jsonResponse({ error: 'validation_failed', message: result.reason }, 400, allowedOrigin);
    }

    const name = clean(payload.name);
    const email = clean(payload.email);
    const subject = clean(payload.subject) || 'New AgentOS contact form message';
    const messageText = clean(payload.message);

    const resendBody = {
      from: fromAddress,
      to: [toAddress],
      reply_to: email,
      subject: `[agentos.sh] ${subject}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${messageText}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
<hr/>
<p style="white-space: pre-wrap; font-family: ui-sans-serif, system-ui, sans-serif;">${escapeHtml(messageText)}</p>`,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resendBody),
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      return jsonResponse(
        { error: 'send_failed', upstream_status: res.status, upstream_body: errorBody.slice(0, 400) },
        502,
        allowedOrigin,
      );
    }

    return jsonResponse({ ok: true }, 200, allowedOrigin);
  },
};

/** Minimal HTML escaper for the email body's HTML variant. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
