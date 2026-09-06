import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import WordCounterTool from './WordCounterTool';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Word Counter — Kraviona Tools',
    description:
      'Count words, characters, sentences, paragraphs, and estimate reading time in real time. Paste any text and get instant statistics.',
    alternates: { canonical: absoluteUrl('/tools/word-counter') },
    openGraph: {
      title: 'Word Counter — Kraviona Tools',
      description: 'Count words, characters, sentences, paragraphs, and estimate reading time in real time.',
      url: absoluteUrl('/tools/word-counter'),
    },
  };
}

export default function WordCounterPage() {
  const tool = getToolBySlug('word-counter')!;
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
      <WordCounterTool />
      <div className="mt-10 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </div>
      <RelatedTools tools={related} />
    </div>
  );
}
