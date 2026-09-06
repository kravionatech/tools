import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import KeywordDensityTool from './KeywordDensityTool';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Keyword Density Checker — Kraviona Tools',
    description:
      'Analyze keyword frequency and density in any text. Enter your target keyword and see how often it appears as a percentage of total words.',
    alternates: { canonical: absoluteUrl('/tools/keyword-density') },
    openGraph: {
      title: 'Keyword Density Checker — Kraviona Tools',
      description: 'Check keyword frequency and density percentage in any text.',
      url: absoluteUrl('/tools/keyword-density'),
    },
  };
}

export default function KeywordDensityPage() {
  const tool = getToolBySlug('keyword-density')!;
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
      <KeywordDensityTool />
      <div className="mt-10 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </div>
      <RelatedTools tools={related} />
    </div>
  );
}
