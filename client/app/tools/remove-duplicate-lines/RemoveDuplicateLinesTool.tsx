'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import CopyButton from '@/components/tools/CopyButton';

export default function RemoveDuplicateLinesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [sortResult, setSortResult] = useState(false);
  const [removedCount, setRemovedCount] = useState<number | null>(null);

  function handleProcess() {
    const lines = input.split('\n');
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    }

    const sorted = sortResult ? [...unique].sort((a, b) => a.localeCompare(b)) : unique;
    setOutput(sorted.join('\n'));
    setRemovedCount(lines.length - unique.length);
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setRemovedCount(null);
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

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 rounded accent-purple-600"
          />
          Case-sensitive
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
          <input
            type="checkbox"
            checked={sortResult}
            onChange={(e) => setSortResult(e.target.checked)}
            className="w-4 h-4 rounded accent-purple-600"
          />
          Sort result
        </label>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleProcess}
          disabled={!input.trim()}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg,#6c3ce1,#8b5cf6)' }}
        >
          Remove Duplicates
        </button>
        {removedCount !== null && (
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-purple-700">{removedCount}</span> duplicate{removedCount !== 1 ? 's' : ''} removed
          </span>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Output</label>
        <textarea
          readOnly
          value={output}
          rows={8}
          placeholder="Deduplicated lines will appear here..."
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
