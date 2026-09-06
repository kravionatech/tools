'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import CopyButton from '@/components/tools/CopyButton';

type SortMode = 'az' | 'za' | 'shortest' | 'longest' | 'random';

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'az', label: 'A → Z' },
  { key: 'za', label: 'Z → A' },
  { key: 'shortest', label: 'Shortest First' },
  { key: 'longest', label: 'Longest First' },
  { key: 'random', label: 'Random' },
];

function sortLines(lines: string[], mode: SortMode): string[] {
  const arr = [...lines];
  switch (mode) {
    case 'az':
      return arr.sort((a, b) => a.localeCompare(b));
    case 'za':
      return arr.sort((a, b) => b.localeCompare(a));
    case 'shortest':
      return arr.sort((a, b) => a.length - b.length);
    case 'longest':
      return arr.sort((a, b) => b.length - a.length);
    case 'random':
      return arr.sort(() => Math.random() - 0.5);
    default:
      return arr;
  }
}

export default function TextSorterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<SortMode>('az');

  function handleSort() {
    const lines = input.split('\n');
    const sorted = sortLines(lines, mode);
    setOutput(sorted.join('\n'));
  }

  function handleClear() {
    setInput('');
    setOutput('');
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Input (one item per line)</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your lines here..."
          rows={8}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setMode(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              mode === opt.key
                ? 'border-purple-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:text-purple-700'
            }`}
            style={mode === opt.key ? { background: 'linear-gradient(135deg,#6c3ce1,#8b5cf6)' } : {}}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex justify-start">
        <button
          onClick={handleSort}
          disabled={!input.trim()}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg,#6c3ce1,#8b5cf6)' }}
        >
          Sort Lines
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Sorted Output</label>
        <textarea
          readOnly
          value={output}
          rows={8}
          placeholder="Sorted lines will appear here..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <CopyButton text={output} />
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
