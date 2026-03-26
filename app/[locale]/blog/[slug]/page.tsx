import { redirect } from 'next/navigation';

/** Required for `output: 'export'` — no blog posts live here; all redirect to docs. */
export function generateStaticParams() {
  return [];
}

export default function BlogPostRedirect({ params }: { params: { slug: string } }) {
  redirect(`https://docs.agentos.sh/blog/${params.slug}`);
}
