import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import MarkdownToHTMLTool from './MarkdownToHTMLTool';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Markdown to HTML Converter — Kraviona Tools',
    description:
      'Convert Markdown text to clean HTML code instantly. Perfect for blog posts, documentation, and any content workflow.',
    alternates: { canonical: absoluteUrl('/tools/markdown-to-html') },
    openGraph: {
      title: 'Markdown to HTML Converter — Kraviona Tools',
      description: 'Convert Markdown to clean HTML in your browser.',
      url: absoluteUrl('/tools/markdown-to-html'),
    },
  };
}

export default function MarkdownToHTMLPage() {
  const tool = getToolBySlug('markdown-to-html')!;
  const related = getRelatedTools(tool);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
      <MarkdownToHTMLTool />
      <div className="mt-10 bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
        🔒 All processing happens locally in your browser. No files are uploaded to any server.
      </div>
      <RelatedTools tools={related} />
    </div>
  );
}
