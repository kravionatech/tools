import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import FindReplaceTool from './FindReplaceTool';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Find & Replace Text — Kraviona Tools',
    description:
      'Find and replace words or phrases in any block of text. Supports plain text replacement and case-sensitive matching.',
    alternates: { canonical: absoluteUrl('/tools/find-replace') },
    openGraph: {
      title: 'Find & Replace Text — Kraviona Tools',
      description: 'Find and replace words or phrases in any text instantly.',
      url: absoluteUrl('/tools/find-replace'),
    },
  };
}

export default function FindReplacePage() {
  const tool = getToolBySlug('find-replace')!;
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
      <FindReplaceTool />
      <div className="mt-10 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </div>
      <RelatedTools tools={related} />
    </div>
  );
}
