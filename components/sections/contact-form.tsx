'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Endpoint that relays the form to Resend. Lives on the wilds.ai
 * Next.js backend (`apps/wilds-ai/src/app/api/v1/contact/route.ts`),
 * which already holds the manic.agency Resend API key in its env.
 * The route is CORS-allowed for the agentos.sh origin. Override at
 * build time with `NEXT_PUBLIC_CONTACT_ENDPOINT` if you want to point
 * at staging or a different host.
 */
const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? 'https://wilds.ai/api/v1/contact';

type SubmitStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

/**
 * Contact form component.
 *
 * Submits to the wilds.ai contact relay (`CONTACT_ENDPOINT`) which
 * forwards the message to team@frame.dev via Resend. The form ships
 * with:
 *
 * * A honeypot `website` field hidden from real users; bots fill it,
 *   the relay sees a non-empty value, returns 200 (so bots don't
 *   retry), and silently drops the email.
 * * Client-side `required` + email validation as a UX layer; the
 *   relay re-validates server-side.
 * * Success and error UI states with appropriate ARIA live regions.
 */
export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>({ kind: 'idle' });

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: a real user never sees the `website` field.
    if ((data.get('website') as string)?.length) {
      setStatus({ kind: 'success' });
      return;
    }

    setStatus({ kind: 'submitting' });

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: 'agentos.sh',
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
          // Honeypot — sent so the server can confirm and reject.
          website: data.get('website'),
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        setStatus({
          kind: 'error',
          message: body || `Send failed (${res.status})`,
        });
        return;
      }

      setStatus({ kind: 'success' });
      form.reset();
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Network error. Try again.',
      });
    }
  }, []);

  if (status.kind === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-bold text-[var(--color-text-primary)]">
          Thanks — we&apos;ll get back to you within 1–2 business days.
        </h3>
        <p className="mt-3 text-[var(--color-text-secondary)]">
          For faster answers, the{' '}
          <a
            href="https://wilds.ai/discord"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--color-accent-primary)] hover:underline"
          >
            Wilds AI Discord
          </a>{' '}
          is the official AgentOS support channel.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: 'idle' })}
          className="mt-6 text-sm font-semibold text-[var(--color-accent-primary)] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            Name <span aria-hidden="true">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            disabled={status.kind === 'submitting'}
            className="mt-2 block w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)]/60 px-4 py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/30"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            Email <span aria-hidden="true">*</span>
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            disabled={status.kind === 'submitting'}
            className="mt-2 block w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)]/60 px-4 py-2.5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/30"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          Topic <span aria-hidden="true">*</span>
        </span>
        <select
          name="subject"
          required
          defaultValue=""
          disabled={status.kind === 'submitting'}
          className="mt-2 block w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)]/60 px-4 py-2.5 text-[var(--color-text-primary)] focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/30"
        >
          <option value="" disabled>
            Pick the closest match…
          </option>
          <option value="General inquiry">General inquiry</option>
          <option value="Partnership / collaboration">Partnership / collaboration</option>
          <option value="Investment / VC">Investment / VC</option>
          <option value="Business / enterprise">Business / enterprise</option>
          <option value="Press / media">Press / media</option>
          <option value="Security disclosure">Security disclosure</option>
          <option value="Hiring / careers">Hiring / careers</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          Message <span aria-hidden="true">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={6}
          disabled={status.kind === 'submitting'}
          className="mt-2 block w-full rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)]/60 px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/30"
          placeholder="Tell us what you're working on or what you'd like help with."
        />
      </label>

      {/* Honeypot field — visually and assistively hidden but parseable
          by spam bots that fill every text input. Real submissions have
          this empty; the relay drops anything else. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px]">
        <label>
          Website (leave empty)
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.kind === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <div>
            <strong>Send failed.</strong>{' '}
            <span className="opacity-80">{status.message}</span>
            <p className="mt-1 opacity-80">
              You can also email{' '}
              <a href="mailto:team@frame.dev" className="font-semibold underline">
                team@frame.dev
              </a>{' '}
              directly.
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={status.kind === 'submitting'}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent-primary)] px-7 py-3 font-semibold text-white dark:text-slate-950 shadow-lg shadow-[var(--color-accent-primary)]/30 transition-all hover:translate-y-[-1px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status.kind === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
