'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { locales, localeNames, type Locale } from '../i18n';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const switchLocale = (newLocale: Locale) => {
    if (!pathname) return;

    // Normalise: ensure we don't duplicate locale segments.
    let subPath = pathname;
    const segments = pathname.split('/');
    const first = segments[1] as Locale | undefined;

    if (first && locales.includes(first)) {
      // Strip existing locale segment from the front
      subPath = '/' + segments.slice(2).join('/');
      if (subPath === '//') subPath = '/';
    }

    // Build new path. Default locale ('en') stays at root.
    let targetPath: string;
    if (newLocale === 'en') {
      targetPath = subPath || '/';
    } else {
      targetPath = `/${newLocale}${subPath === '/' ? '' : subPath}`;
    }

    // Optional: lightweight debug trace
    // In dev, log path transitions for debugging mis-routed locales.
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && 'console' in window) {
      window.console.debug('[LanguageSwitcher] locale change', {
        from: locale,
        to: newLocale,
        pathname,
        subPath,
        targetPath,
      });
    }

    // For static export (GitHub Pages), we need a hard reload to pick up the new locale
    // because middleware doesn't run on static hosts
    if (typeof window !== 'undefined') {
      // Save preference
      try {
        localStorage.setItem('preferred-locale', newLocale);
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
      } catch {
        // ignore if localStorage blocked
      }
      // Hard reload to the new locale path
      window.location.href = targetPath;
    } else {
      router.push(targetPath);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl glass-morphism hover:bg-accent-primary/10 transition-all min-h-[44px] min-w-[44px]"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">
          {localeNames[locale]}
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 rounded-xl glass-morphism shadow-modern overflow-hidden z-50 border border-border-subtle"
          role="menu"
          aria-orientation="vertical"
        >
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-all ${
                loc === locale
                  ? 'bg-accent-primary/10 text-accent-primary font-semibold'
                  : 'text-text-secondary hover:bg-accent-primary/5 hover:text-accent-primary'
              }`}
              role="menuitem"
            >
              <span>{localeNames[loc]}</span>
              {loc === locale && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

