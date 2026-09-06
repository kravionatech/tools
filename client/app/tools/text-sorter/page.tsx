import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import TextSorterTool from './TextSorterTool';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Text Sorter — Kraviona Tools',
    description:
      'Sort lines of text alphabetically (A-Z or Z-A), by length, numerically, or randomly. Great for sorting lists and keywords.',
    alternates: { canonical: absoluteUrl('/tools/text-sorter') },
    openGraph: {
      title: 'Text Sorter — Kraviona Tools',
      description: 'Sort lines alphabetically, by length, or numerically.',
      url: absoluteUrl('/tools/text-sorter'),
    },
  };
}

export default function TextSorterPage() {
  const tool = getToolBySlug('text-sorter')!;
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
      <TextSorterTool />
      <div className="mt-10 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </div>
      <RelatedTools tools={related} />
    </div>
  );
}
