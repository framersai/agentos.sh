'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// Microsoft Clarity Project ID from environment
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || '';

/**
 * Microsoft Clarity Analytics component with GDPR-compliant consent mode
 * 
 * This component:
 * 1. Loads Clarity script with default disabled state
 * 2. Waits for user consent before enabling tracking
 * 3. Integrates with the CookieConsent component
 * 4. Provides session recording and heatmaps for UX research
 */
export function MicrosoftClarity() {
  const [consentGiven, setConsentGiven] = useState(false);

  // Check for stored consent on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('agentos-cookie-consent');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.consent?.analytics) {
          setConsentGiven(true);
        }
      }
    } catch {
      // Ignore parsing errors
    }

    // Listen for consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'agentos-cookie-consent' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setConsentGiven(parsed.consent?.analytics || false);
        } catch {
          // Ignore parsing errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Don't render if no project ID
  if (!CLARITY_PROJECT_ID) {
    return null;
  }

  return (
    <>
      {consentGiven && (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `,
          }}
        />
      )}
    </>
  );
}

export default MicrosoftClarity;
