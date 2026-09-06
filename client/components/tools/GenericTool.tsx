'use client';

import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { countSentences, countSyllables, countWords, downloadTextFile, fleschReadingEase, slugify } from '@/lib/utils';
import { trackToolUsage } from '@/components/analytics/AnalyticsTracker';

type GenericToolProps = { slug: string };

const LOREM = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ');

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function transformText(slug: string, input: string): string {
  if (!input) return '';
  switch (slug) {
    case 'html-to-text': {
      const doc = new DOMParser().parseFromString(input, 'text/html');
      return doc.body.textContent ?? '';
    }
    case 'text-cleaner':
      return input.replace(/[\\t ]+/g, ' ').replace(/[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]/g, '').replace(/\\n{3,}/g, '\\n\\n').trim();
    case 'text-to-slug':
      return slugify(input);
    case 'markdown-to-html':
      return input.split('\\n').map((line) => {
        if (line.startsWith('### ')) return `<h3>${escapeHtml(line.slice(4))}</h3>`;
        if (line.startsWith('## ')) return `<h2>${escapeHtml(line.slice(3))}</h2>`;
        if (line.startsWith('# ')) return `<h1>${escapeHtml(line.slice(2))}</h1>`;
        return line ? `<p>${escapeHtml(line)}</p>` : '';
      }).join('\\n');
    case 'markdown-previewer':
      return input.split('\\n').map((line) => line.replace(/^### (.*)$/, '<h3>$1</h3>').replace(/^## (.*)$/, '<h2>$1</h2>').replace(/^# (.*)$/, '<h1>$1</h1>')).join('\\n');
    case 'word-frequency': {
      const counts = new Map<string, number>();
      input.toLowerCase().match(/[\\p{L}\\p{N}]+/gu)?.forEach((word) => counts.set(word, (counts.get(word) ?? 0) + 1));
      return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([word, count]) => `${word}: ${count}`).join('\\n');
    }
    case 'text-diff':
      return input.split('\\n').map((line, index) => `${index + 1}: ${line}`).join('\\n');
    default:
      return input;
  }
}

function seoTemplate(slug: string, input: string): string {
  const value = input.trim();
  if (slug === 'meta-tag-generator') return `<title>${value}</title>\n<meta name="description" content="${value}">`;
  if (slug === 'og-tag-generator') return `<meta property="og:title" content="${value}">\n<meta property="og:description" content="${value}">`;
  if (slug === 'twitter-card-generator') return `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${value}">`;
  if (slug === 'robots-txt-generator') return `User-agent: *\nAllow: /\nSitemap: ${value || 'https://example.com/sitemap.xml'}`;
  if (slug === 'xml-sitemap-generator') return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${value}</loc></url>\n</urlset>`;
  if (slug === 'schema-generator') return JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: value || 'Your Website', url: value || 'https://example.com' }, null, 2);
  if (slug === 'utm-builder') {
    try { const url = new URL(value); url.searchParams.set('utm_source', ''); return url.toString(); } catch { return value; }
  }
  if (slug === 'hreflang-generator') return `<link rel="alternate" hreflang="en" href="${value}">`;
  if (slug === 'url-slug-generator') return slugify(value);
  return value;
}

async function convertImage(file: File, slug: string): Promise<{ url: string; name: string }> {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('Could not decode image'));
    element.src = source;
  });
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  if (slug.includes('jpg')) { context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height); }
  context.drawImage(image, 0, 0);
  const type = slug.includes('webp') ? 'image/webp' : slug.includes('jpg') ? 'image/jpeg' : 'image/png';
  const extension = type.split('/')[1];
  return { url: canvas.toDataURL(type, 0.9), name: `${file.name.replace(/\\.[^.]+$/, '')}.${extension}` };
}

export default function GenericTool({ slug }: GenericToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const isImage = ['png-to-jpg', 'jpg-to-webp', 'png-to-webp', 'webp-to-jpg', 'webp-to-png', 'image-compressor', 'image-resizer', 'image-to-base64', 'base64-to-image', 'favicon-generator', 'svg-to-png'].includes(slug);
  const isSeo = ['meta-tag-generator', 'og-tag-generator', 'twitter-card-generator', 'serp-preview', 'robots-txt-generator', 'xml-sitemap-generator', 'schema-generator', 'utm-builder', 'hreflang-generator', 'url-slug-generator'].includes(slug);

  function run() {
    trackToolUsage(slug);
    if (isSeo) setOutput(seoTemplate(slug, input));
    else if (slug === 'lorem-ipsum') setOutput(Array.from({ length: Math.max(1, Number(input) || 3) }, (_, paragraph) => Array.from({ length: 45 }, (_, index) => LOREM[(paragraph * 45 + index) % LOREM.length]).join(' ')).join('\\n\\n'));
    else if (slug === 'text-statistics') {
      const words = countWords(input);
      const syllables = input.split(/\\s+/).filter(Boolean).reduce((sum, word) => sum + countSyllables(word), 0);
      setOutput(`Words: ${words}\\nSentences: ${countSentences(input)}\\nSyllables: ${syllables}\\nReading ease: ${fleschReadingEase(input)}`);
    } else if (slug === 'keyword-density') {
      const keyword = input.split(/\\n/, 1)[0].trim().toLowerCase();
      const body = input.slice(input.indexOf('\\n') + 1).toLowerCase();
      const matches = keyword ? body.split(keyword).length - 1 : 0;
      setOutput(`Keyword: ${keyword}\\nOccurrences: ${matches}\\nDensity: ${body ? ((matches / countWords(body)) * 100).toFixed(2) : '0.00'}%`);
    } else setOutput(transformText(slug, input));
  }

  async function handleImage(file: File) {
    setImageFile(file);
    if (slug === 'image-to-base64') {
      const reader = new FileReader();
      reader.onload = () => setOutput(String(reader.result));
      reader.readAsDataURL(file);
      return;
    }
    try { const converted = await convertImage(file, slug); setImageUrl(converted.url); setOutput(converted.name); } catch { setOutput('Unable to process this image in the browser.'); }
  }

  if (isImage) return <div className="space-y-5"><label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-10 text-sm text-gray-600 hover:border-purple-400"><Upload className="h-5 w-5" /> Choose an image<input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleImage(file); }} /></label>{imageFile && <p className="text-sm text-gray-500">{imageFile.name}</p>}{imageUrl && <img src={imageUrl} alt="Converted preview" className="max-h-72 max-w-full rounded-lg border object-contain" />}{output && <button onClick={() => { const link = document.createElement('a'); link.href = imageUrl || output; link.download = output || 'converted-image'; link.click(); }} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white"><Download className="h-4 w-4" /> Download result</button>}</div>;

  return <div className="space-y-5"><textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={slug === 'keyword-density' ? 'First line: keyword\\nFollowing lines: text to analyze' : 'Enter text, URL, or values here...'} rows={9} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400" /><div className="flex flex-wrap gap-2"><button onClick={run} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white">Generate result</button>{output && <button onClick={() => downloadTextFile(output, `${slug}-result.txt`)} className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"><Download className="h-4 w-4" /> Download</button>}</div><textarea readOnly value={output} placeholder="Your result will appear here..." rows={9} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-800" /></div>;
}
