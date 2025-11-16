import { redirect } from 'next/navigation';

// Redirect root path to default locale (English)
export default function RootPage() {
  redirect('/en');
}
