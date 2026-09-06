import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import TextReverserTool from './TextReverserTool';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Text Reverser — Kraviona Tools',
    description:
      'Reverse any text character by character, or reverse the order of lines or words. Useful for encoding, mirroring, or creative writing.',
    alternates: { canonical: absoluteUrl('/tools/text-reverser') },
    openGraph: {
      title: 'Text Reverser — Kraviona Tools',
      description: 'Reverse text character by character, word by word, or line by line.',
      url: absoluteUrl('/tools/text-reverser'),
    },
  };
}

export default function TextReverserPage() {
  const tool = getToolBySlug('text-reverser')!;
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
      <TextReverserTool />
      <div className="mt-10 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </div>
      <RelatedTools tools={related} />
    </div>
  );
}
