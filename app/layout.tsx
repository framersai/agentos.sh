import { Inter, Space_Grotesk } from "next/font/google";
import "../styles/tokens.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

const criticalStyles = `
  :root {
    color-scheme: dark;
    background-color: #030014;
  }
  body {
    margin: 0;
    min-height: 100vh;
    background: var(--color-background-primary, #030014);
    color: var(--color-text-primary, #f5f0ff);
  }
  html.preload body {
    overflow: hidden;
  }
  .app-shell-loader {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: radial-gradient(circle at top, rgba(25,12,56,0.9), rgba(5,3,20,0.95));
    color: #f5f0ff;
    font-family: var(--font-grotesk, "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
    transition: opacity 0.25s ease, visibility 0.25s ease;
  }
  html.preload .app-shell-loader {
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
    animation: loaderFailsafe 0s linear forwards;
    animation-delay: 3s;
  }
  .app-shell-loader .loader-orb {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    background: linear-gradient(135deg, #c084fc, #7c3aed);
    filter: blur(0.5px);
    animation: pulse 1.2s ease-in-out infinite;
  }
  .app-shell-loader .loader-label {
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.8;
  }
  @keyframes pulse {
    0% { transform: scale(0.85); opacity: 0.7; }
    50% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.85); opacity: 0.7; }
  }
  @keyframes loaderFailsafe {
    to { opacity: 0; visibility: hidden; pointer-events: none; }
  }
`;

const removePreloadScript = `
(function () {
  var removePreload = function () {
    document.documentElement.classList.remove('preload');
    var loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      loader.style.pointerEvents = 'none';
    }
  };
  if (document.readyState === 'complete') {
    removePreload();
  } else {
    window.addEventListener('load', removePreload, { once: true });
    setTimeout(removePreload, 2000);
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="preload">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
      </head>
      <body className={`${inter.variable} ${grotesk.variable} grainy min-h-screen antialiased transition-theme bg-background-primary text-text-primary`}>
        <div id="initial-loader" className="app-shell-loader" aria-hidden="true">
          <span className="loader-orb" />
          <span className="loader-label">Loading AgentOS…</span>
        </div>
        {children}
          <script
            dangerouslySetInnerHTML={{
            __html: removePreloadScript,
          }}
        />
      </body>
    </html>
  );
}
