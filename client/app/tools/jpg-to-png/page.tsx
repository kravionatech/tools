'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, RefreshCw, Shield, ImageIcon } from 'lucide-react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RelatedTools from '@/components/tools/RelatedTools';
import { getToolBySlug, getRelatedTools } from '@/lib/tools-registry';

const tool = getToolBySlug('jpg-to-png')!;
const relatedTools = getRelatedTools(tool);

interface ImageInfo {
  name: string;
  size: number;
  width: number;
  height: number;
  dataUrl: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function convertImage(
  file: File,
  outputFormat: 'image/png' | 'image/jpeg' | 'image/webp',
  quality = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        if (outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL(outputFormat, quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function downloadImage(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export default function JpgToPngPage() {
  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [converted, setConverted] = useState<ImageInfo | null>(null);
  const [converting, setConverting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.match(/image\/(jpeg|jpg)/)) {
      alert('Please select a JPG/JPEG file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginal({
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
          dataUrl: e.target?.result as string,
        });
        setConverted(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleConvert = async () => {
    if (!original) return;
    setConverting(true);
    try {
      const res = await fetch(original.dataUrl);
      const blob = await res.blob();
      const file = new File([blob], original.name, { type: 'image/jpeg' });
      const dataUrl = await convertImage(file, 'image/png');
      const img = new Image();
      img.onload = () => {
        const outputName = original.name.replace(/\.(jpg|jpeg)$/i, '.png');
        const base64 = dataUrl.split(',')[1];
        const byteSize = Math.ceil((base64.length * 3) / 4);
        setConverted({
          name: outputName,
          size: byteSize,
          width: img.width,
          height: img.height,
          dataUrl,
        });
        setConverting(false);
      };
      img.src = dataUrl;
    } catch {
      setConverting(false);
    }
  };

  const handleReset = () => {
    setOriginal(null);
    setConverted(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Image Tools', href: '/tools/image' },
          { label: 'JPG to PNG Converter' },
        ]}
      />

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🖼️</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">JPG to PNG Converter</h1>
        </div>
        <p className="text-gray-500">
          Convert JPG/JPEG images to lossless PNG format entirely in your browser. No server uploads.
        </p>
      </div>

      {/* Privacy notice */}
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-green-800">
        <Shield className="w-4 h-4 shrink-0" />
        🔒 Your files are processed locally in your browser. They are never uploaded to any server.
      </div>

      {/* Drop zone */}
      {!original && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            dragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
        >
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-1">Drag & drop a JPG/JPEG file here</p>
          <p className="text-gray-400 text-sm">or click to browse</p>
          <p className="text-gray-400 text-xs mt-2">Accepts .jpg, .jpeg</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {/* Preview + convert */}
      {original && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Original */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <p className="font-semibold text-gray-700 text-sm">Original (JPG)</p>
              </div>
              <div className="p-4">
                <img
                  src={original.dataUrl}
                  alt="Original"
                  className="w-full h-48 object-contain rounded-lg bg-gray-100"
                />
                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <p>
                    <span className="font-medium text-gray-700">Name:</span> {original.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Size:</span>{' '}
                    {formatBytes(original.size)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Dimensions:</span> {original.width}{' '}
                    × {original.height}px
                  </p>
                </div>
              </div>
            </div>

            {/* Converted */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <p className="font-semibold text-gray-700 text-sm">Converted (PNG)</p>
              </div>
              <div className="p-4">
                {converted ? (
                  <>
                    <img
                      src={converted.dataUrl}
                      alt="Converted"
                      className="w-full h-48 object-contain rounded-lg bg-gray-100"
                    />
                    <div className="mt-3 space-y-1 text-xs text-gray-500">
                      <p>
                        <span className="font-medium text-gray-700">Name:</span> {converted.name}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Size:</span>{' '}
                        {formatBytes(converted.size)}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Dimensions:</span>{' '}
                        {converted.width} × {converted.height}px
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">PNG preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {!converted ? (
              <button
                onClick={handleConvert}
                disabled={converting}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-60"
              >
                {converting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Converting…
                  </>
                ) : (
                  <>Convert to PNG</>
                )}
              </button>
            ) : (
              <button
                onClick={() => downloadImage(converted.dataUrl, converted.name)}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>
            )}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>
      )}

      <RelatedTools tools={relatedTools} />
    </div>
  );
}
