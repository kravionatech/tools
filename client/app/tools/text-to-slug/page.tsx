import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import TextToSlugTool from './TextToSlugTool';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'URL Slug Generator — Kraviona Tools',
    description:
      'Convert any text or title into a clean, SEO-friendly URL slug. Removes special characters, replaces spaces with hyphens, and lowercases everything.',
    alternates: { canonical: absoluteUrl('/tools/text-to-slug') },
    openGraph: {
      title: 'URL Slug Generator — Kraviona Tools',
      description: 'Turn any title or phrase into a clean SEO-friendly URL slug.',
      url: absoluteUrl('/tools/text-to-slug'),
    },
  };
}

export default function TextToSlugPage() {
  const tool = getToolBySlug('text-to-slug')!;
  const related = getRelatedTools(tool);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Text Tools', href: '/tools/text' },
          { label: tool.name },
        ]}
      />
      <div className="mt-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
        <p className="text-gray-500">{tool.description}</p>
      </div>
      <TextToSlugTool />
      <div className="mt-10 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </div>
      <RelatedTools tools={related} />
    </div>
  );
}
