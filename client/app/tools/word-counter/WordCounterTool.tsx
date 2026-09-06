'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { countWords, countSentences, countParagraphs, estimateReadingTime } from '@/lib/utils';

export default function WordCounterTool() {
  const [text, setText] = useState('');

  const words = countWords(text);
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const readingTime = estimateReadingTime(words);

  const stats = [
    { label: 'Words', value: words },
    { label: 'Characters', value: chars },
    { label: 'Chars (no spaces)', value: charsNoSpaces },
    { label: 'Sentences', value: sentences },
    { label: 'Paragraphs', value: paragraphs },
    { label: 'Reading Time', value: `${readingTime} min` },
  ];

  return (
    <div className="space-y-6">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={10}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-gray-400"
        />
        {text && (
          <button
            onClick={() => setText('')}
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
            aria-label="Clear text"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setText('')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4" /> Clear
        </button>
      </div>
    </div>
  );
}
