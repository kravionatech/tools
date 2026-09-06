import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import GenericTool from '@/components/tools/GenericTool';
import { getRelatedTools, getToolBySlug, tools } from '@/lib/tools-registry';
import { absoluteUrl } from '@/lib/site-config';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Kraviona Tools`,
    description: tool.description,
    alternates: { canonical: absoluteUrl(`/tools/${tool.slug}`) },
  };
}

export default async function GenericToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: `${tool.category[0].toUpperCase()}${tool.category.slice(1)} Tools`, href: `/tools/${tool.category}` }, { label: tool.name }]} />
      <div className="mb-8 mt-6"><h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{tool.name}</h1><p className="text-gray-500">{tool.description}</p></div>
      <GenericTool slug={tool.slug} />
      <div className="mt-10 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">All processing happens locally in your browser. No files are uploaded.</div>
      <RelatedTools tools={getRelatedTools(tool)} />
    </div>
  );
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}
