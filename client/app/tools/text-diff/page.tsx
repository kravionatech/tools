import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import TextDiffTool from './TextDiffTool';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Text Diff / Compare — Kraviona Tools',
    description:
      'Compare two blocks of text side by side. Highlights added, removed, and changed lines with color coding for easy review.',
    alternates: { canonical: absoluteUrl('/tools/text-diff') },
    openGraph: {
      title: 'Text Diff / Compare — Kraviona Tools',
      description: 'Compare two texts and highlight differences line by line.',
      url: absoluteUrl('/tools/text-diff'),
    },
  };
}

export default function TextDiffPage() {
  const tool = getToolBySlug('text-diff')!;
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
      <TextDiffTool />
      <div className="mt-10 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </div>
      <RelatedTools tools={related} />
    </div>
  );
}
