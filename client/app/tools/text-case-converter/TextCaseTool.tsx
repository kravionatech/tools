'use client';

import { useState } from 'react';
import { Download, X } from 'lucide-react';
import CopyButton from '@/components/tools/CopyButton';
import { downloadTextFile } from '@/lib/utils';

type CaseOption = {
  label: string;
  key: string;
};

const CASES: CaseOption[] = [
  { label: 'UPPERCASE', key: 'upper' },
  { label: 'lowercase', key: 'lower' },
  { label: 'Title Case', key: 'title' },
  { label: 'Sentence case', key: 'sentence' },
  { label: 'camelCase', key: 'camel' },
  { label: 'PascalCase', key: 'pascal' },
  { label: 'snake_case', key: 'snake' },
  { label: 'kebab-case', key: 'kebab' },
];

function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

function toCamelCase(text: string): string {
  const words = text.trim().split(/[\s_\-]+/);
  return words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}

function toPascalCase(text: string): string {
  return text
    .trim()
    .split(/[\s_\-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function toSnakeCase(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s\-]+/g, '_')
    .replace(/[^\w_]/g, '');
}

function toKebabCase(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]/g, '');
}

function convertCase(text: string, key: string): string {
  switch (key) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return toTitleCase(text);
    case 'sentence': return toSentenceCase(text);
    case 'camel': return toCamelCase(text);
    case 'pascal': return toPascalCase(text);
    case 'snake': return toSnakeCase(text);
    case 'kebab': return toKebabCase(text);
    default: return text;
  }
}

export default function TextCaseTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [activeCase, setActiveCase] = useState<string | null>(null);

  function handleCase(key: string) {
    setActiveCase(key);
    setOutput(convertCase(input, key));
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setActiveCase(null);
  }

  return (
    <div className="space-y-5">
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          if (activeCase) setOutput(convertCase(e.target.value, activeCase));
        }}
        placeholder="Paste or type your text here..."
        rows={6}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
      />

      <div className="flex flex-wrap gap-2">
        {CASES.map((c) => (
          <button
            key={c.key}
            onClick={() => handleCase(c.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              activeCase === c.key
                ? 'border-purple-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:text-purple-700'
            }`}
            style={activeCase === c.key ? { background: 'linear-gradient(135deg,#6c3ce1,#8b5cf6)' } : {}}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Output</label>
        <textarea
          readOnly
          value={output}
          rows={6}
          placeholder="Converted text will appear here..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <CopyButton text={output} />
        <button
          onClick={() => downloadTextFile(output, 'converted-text.txt')}
          disabled={!output}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" /> Download
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      </div>
    </div>
  );
}
