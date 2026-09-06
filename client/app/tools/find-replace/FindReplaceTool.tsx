'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import CopyButton from '@/components/tools/CopyButton';

export default function FindReplaceTool() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [output, setOutput] = useState('');
  const [count, setCount] = useState<number | null>(null);

  function handleReplaceAll() {
    if (!find) return;

    let result = text;
    let replacements = 0;

    const flags = caseSensitive ? 'g' : 'gi';
    const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, flags);
    result = text.replace(regex, () => {
      replacements++;
      return replace;
    });

    setOutput(result);
    setCount(replacements);
  }

  function handleClear() {
    setText('');
    setFind('');
    setReplace('');
    setOutput('');
    setCount(null);
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          rows={7}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Find</label>
          <input
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder="Text to find..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Replace with</label>
          <input
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            placeholder="Replacement text..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 rounded accent-purple-600"
          />
          Case sensitive
        </label>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleReplaceAll}
          disabled={!text.trim() || !find}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg,#6c3ce1,#8b5cf6)' }}
        >
          Replace All
        </button>
        {count !== null && (
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-purple-700">{count}</span> replacement{count !== 1 ? 's' : ''} made
          </span>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Result</label>
        <textarea
          readOnly
          value={output}
          rows={7}
          placeholder="Result will appear here..."
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
