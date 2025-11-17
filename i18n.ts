import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Supported locales
export const locales = ['en', 'zh', 'ko', 'ja', 'es', 'de'] as const;
export type Locale = (typeof locales)[number];

// Default locale (English)
export const defaultLocale: Locale = 'en';

// Locale names for display
export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '简体中文',
  ko: '한국어',
  ja: '日本語',
  es: 'Español',
  de: 'Deutsch',
};

export default getRequestConfig(async ({ locale }) => {
  // Normalise locale: default to 'en' when undefined (e.g. root path on static export)
  const effectiveLocale = (locale || defaultLocale) as Locale;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(effectiveLocale)) notFound();

  return {
    locale: effectiveLocale,
    messages: (await import(`./messages/${effectiveLocale}.json`)).default
  } as any;
});

