'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import CopyButton from '@/components/tools/CopyButton';

type ReverseMode = 'characters' | 'words' | 'lines';

const MODES: { key: ReverseMode; label: string }[] = [
  { key: 'characters', label: 'Reverse Characters' },
  { key: 'words', label: 'Reverse Words' },
  { key: 'lines', label: 'Reverse Lines' },
];

function reverseText(text: string, mode: ReverseMode): string {
  switch (mode) {
    case 'characters':
      return text.split('').reverse().join('');
    case 'words':
      return text
        .split('\n')
        .map((line) => line.split(/\s+/).reverse().join(' '))
        .join('\n');
    case 'lines':
      return text.split('\n').reverse().join('\n');
    default:
      return text;
  }
}

export default function TextReverserTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ReverseMode>('characters');
  const output = reverseText(input, mode);

  function handleClear() {
    setInput('');
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={7}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              mode === m.key
                ? 'border-purple-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:text-purple-700'
            }`}
            style={mode === m.key ? { background: 'linear-gradient(135deg,#6c3ce1,#8b5cf6)' } : {}}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Output (live preview)</label>
        <textarea
          readOnly
          value={output}
          rows={7}
          placeholder="Reversed text will appear here..."
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
