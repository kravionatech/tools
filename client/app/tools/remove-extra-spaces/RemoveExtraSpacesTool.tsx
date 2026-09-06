'use client';

import { useState } from 'react';
import { Download, X } from 'lucide-react';
import CopyButton from '@/components/tools/CopyButton';
import { downloadTextFile } from '@/lib/utils';

interface Options {
  trimEdges: boolean;
  collapseSpaces: boolean;
  removeBlankLines: boolean;
  trimEachLine: boolean;
}

function processText(text: string, opts: Options): string {
  let result = text;

  if (opts.trimEdges) {
    result = result.trim();
  }
  if (opts.trimEachLine) {
    result = result
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
  }
  if (opts.collapseSpaces) {
    result = result.replace(/[ \t]+/g, ' ');
  }
  if (opts.removeBlankLines) {
    result = result
      .split('\n')
      .filter((line) => line.trim() !== '')
      .join('\n');
  }

  return result;
}

export default function RemoveExtraSpacesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState<Options>({
    trimEdges: true,
    collapseSpaces: true,
    removeBlankLines: false,
    trimEachLine: false,
  });

  function handleApply() {
    setOutput(processText(input, options));
  }

  function handleClear() {
    setInput('');
    setOutput('');
  }

  const toggleOption = (key: keyof Options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checkboxes: { key: keyof Options; label: string }[] = [
    { key: 'trimEdges', label: 'Remove leading / trailing spaces' },
    { key: 'collapseSpaces', label: 'Collapse multiple spaces to one' },
    { key: 'removeBlankLines', label: 'Remove blank lines' },
    { key: 'trimEachLine', label: 'Trim each line individually' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here..."
          rows={7}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
        />
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-600 mb-3">Options</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {checkboxes.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => toggleOption(key)}
                className="w-4 h-4 rounded accent-purple-600"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-start">
        <button
          onClick={handleApply}
          disabled={!input.trim()}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg,#6c3ce1,#8b5cf6)' }}
        >
          Apply
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Output</label>
        <textarea
          readOnly
          value={output}
          rows={7}
          placeholder="Cleaned text will appear here..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <CopyButton text={output} />
        <button
          onClick={() => downloadTextFile(output, 'cleaned-text.txt')}
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
