import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import HtmlToTextTool from './HtmlToTextTool';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'HTML to Plain Text — Kraviona Tools',
    description:
      'Strip HTML tags from any HTML code and extract the plain text content. Useful for cleaning up copied web content or processing HTML emails.',
    alternates: { canonical: absoluteUrl('/tools/html-to-text') },
    openGraph: {
      title: 'HTML to Plain Text — Kraviona Tools',
      description: 'Remove HTML tags and extract plain text from any HTML code.',
      url: absoluteUrl('/tools/html-to-text'),
    },
  };
}

export default function HtmlToTextPage() {
  const tool = getToolBySlug('html-to-text')!;
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
      <HtmlToTextTool />
      <div className="mt-10 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </div>
      <RelatedTools tools={related} />
    </div>
  );
}
