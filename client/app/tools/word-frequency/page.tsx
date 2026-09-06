import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import WordFrequencyTool from './WordFrequencyTool';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Word Frequency Counter — Kraviona Tools',
    description:
      'Analyze any text and get a frequency count of every word. See which words appear most often, sorted by frequency with percentage breakdowns.',
    alternates: { canonical: absoluteUrl('/tools/word-frequency') },
    openGraph: {
      title: 'Word Frequency Counter — Kraviona Tools',
      description: 'Count how often each word appears in your text with frequency rankings.',
      url: absoluteUrl('/tools/word-frequency'),
    },
  };
}

export default function WordFrequencyPage() {
  const tool = getToolBySlug('word-frequency')!;
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
      <WordFrequencyTool />
      <div className="mt-10 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </div>
      <RelatedTools tools={related} />
    </div>
  );
}
