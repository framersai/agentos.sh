/**
 * Root not-found page for Next.js.
 *
 * During static export this generates `out/404/index.html`.
 * The actual 404 served by Vercel / Netlify / GitHub Pages is
 * `public/404.html` (copied to `out/404.html`). This component
 * is kept in sync as a fallback for dev-mode and any host that
 * serves the Next.js-generated version.
 */
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--color-background-primary, hsl(240,20%,3%))',
        color: 'var(--color-text-primary, hsl(220,30%,98%))',
      }}
    >
      <h1
        style={{
          fontSize: '5rem',
          fontWeight: 800,
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, hsl(250,100%,70%), hsl(280,100%,65%))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '0.75rem',
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--color-text-muted, hsl(220,15%,60%))',
          maxWidth: 480,
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}
      >
        The page you are looking for does not exist or has been moved.
      </p>
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <a
          href="/"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            background: 'var(--color-accent-primary, hsl(250,100%,70%))',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Go Home
        </a>
        <a
          href="https://docs.agentos.sh"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border-subtle, hsl(260,20%,18%))',
            color: 'var(--color-text-primary, hsl(220,30%,98%))',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          View Docs
        </a>
        <a
          href="https://github.com/wearetheframers/agentos"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border-subtle, hsl(260,20%,18%))',
            color: 'var(--color-text-primary, hsl(220,30%,98%))',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
