import Link from 'next/link';

const WILDS_DISCORD_URL = 'https://wilds.ai/discord';

/**
 * Discord call-to-action card pointing users at the official Wilds AI
 * Discord server, which doubles as the support and developer-onboarding
 * channel for AgentOS, Paracosm, and other Frame projects.
 *
 * Two layout variants are supported via the `variant` prop:
 *
 * * `compact` (default) — slim horizontal card meant for placement
 *   between the hero and the next major section on a marketing page,
 *   or anywhere a one-row CTA fits.
 * * `section` — taller block with the same content, slightly larger
 *   typography, and `<section>` semantics. Used as a standalone
 *   section on /about, /faq, and the blog index where it isn't
 *   neighbouring a hero.
 *
 * The component is a single static `<a>`/`<section>` (no client-side
 * state), so it ships in static HTML for crawlers and doesn't add
 * hydration cost.
 */
export type DiscordCTAVariant = 'compact' | 'section';

type Props = {
  /** Layout variant. Defaults to `compact`. */
  variant?: DiscordCTAVariant;
  /** Extra wrapper className for tuning page-specific spacing. */
  className?: string;
};

export function DiscordCTA({ variant = 'compact', className = '' }: Props) {
  const isSection = variant === 'section';

  const Wrapper: 'section' | 'div' = isSection ? 'section' : 'div';

  return (
    <Wrapper
      className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${
        isSection ? 'py-12' : 'py-4'
      } ${className}`}
      aria-label="Join the Wilds AI Discord — official community for AgentOS and Paracosm"
    >
      <Link
        href={WILDS_DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center gap-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-background-secondary)]/60 ${
          isSection ? 'p-6 sm:p-8' : 'p-4 sm:p-5'
        } backdrop-blur-sm transition-all hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/5`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/wilds-ai-icon.png"
          alt="Wilds AI"
          width={isSection ? 64 : 48}
          height={isSection ? 64 : 48}
          loading="lazy"
          decoding="async"
          className={`flex-shrink-0 rounded-lg ${
            isSection ? 'h-16 w-16' : 'h-12 w-12'
          }`}
        />
        <div className="flex-1 min-w-0">
          <div
            className={`font-semibold text-[var(--color-text-primary)] ${
              isSection ? 'text-lg sm:text-xl' : 'text-base'
            }`}
          >
            Join the Wilds AI Discord
          </div>
          <div
            className={`text-[var(--color-text-secondary)] ${
              isSection ? 'text-sm sm:text-base mt-1' : 'text-xs sm:text-sm'
            }`}
          >
            Official community for AgentOS and Paracosm support, developer onboarding, and questions.
          </div>
        </div>
        <span
          className={`flex-shrink-0 inline-flex items-center gap-1.5 font-semibold text-[var(--color-accent-primary)] transition-transform group-hover:translate-x-0.5 ${
            isSection ? 'text-base' : 'text-sm'
          }`}
          aria-hidden="true"
        >
          Join
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </Link>
    </Wrapper>
  );
}
