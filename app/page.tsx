import LocaleLayout, { resolveLocaleMetadata } from './[locale]/layout';
import LandingPage from './[locale]/page';

export async function generateMetadata() {
  return resolveLocaleMetadata('en');
}

export default async function RootPage() {
  return (
    <LocaleLayout params={{ locale: 'en' }}>
      <LandingPage />
    </LocaleLayout>
  );
}
