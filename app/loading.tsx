"use client";

/**
 * Route-level fallback for the landing experience.
 * Provides a branded skeleton state while Next.js loads the main bundles.
 */
export default function Loading() {
  const block = "bg-slate-200/60 dark:bg-slate-800/70";
  const panelBlock = "bg-slate-200/40 dark:bg-slate-800/60";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 pb-24 pt-20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto w-full max-w-7xl space-y-16">
        <header className="space-y-6 text-center">
          <div className={`mx-auto h-5 w-48 rounded-full ${block}`} aria-hidden="true" />
          <div className={`mx-auto h-16 w-3/4 rounded-2xl ${block}`} aria-hidden="true" />
          <div className={`mx-auto h-20 w-full max-w-2xl rounded-2xl ${panelBlock}`} aria-hidden="true" />
          <div className="flex animate-pulse flex-col gap-3 sm:flex-row sm:justify-center">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`hero-cta-${index}`}
                className={`h-12 w-full max-w-xs rounded-full ${block}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </header>

        <section className="grid animate-pulse gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`feature-card-${index}`}
              className="glass-panel space-y-4 border-slate-200/60 dark:border-slate-800/80"
              aria-hidden="true"
            >
              <div className={`h-12 w-12 rounded-2xl ${block}`} />
              <div className={`h-6 w-3/4 rounded-full ${block}`} />
              <div className={`h-20 w-full rounded-2xl ${panelBlock}`} />
            </div>
          ))}
        </section>

        <section className="space-y-8">
          <div className={`h-10 w-48 rounded-full ${block} animate-pulse`} aria-hidden="true" />
          <div className="grid animate-pulse gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`metric-card-${index}`}
                className="glass-panel space-y-4 border-slate-200/60 dark:border-slate-800/80"
                aria-hidden="true"
              >
                <div className={`h-5 w-24 rounded-full ${block}`} />
                <div className={`h-6 w-3/4 rounded-full ${block}`} />
                <div className={`h-16 w-full rounded-2xl ${panelBlock}`} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
