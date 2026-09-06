"use client";

import { useState, useRef } from "react";
import { Upload, Download, RefreshCw, Shield } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import RelatedTools from "@/components/tools/RelatedTools";
import { getToolBySlug, getRelatedTools } from "@/lib/tools-registry";

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
}

interface ConverterPageProps {
  slug: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
  acceptAttr: string;
  acceptLabel: string;
  outputFormat: "image/webp" | "image/jpeg" | "image/png";
  outputExt: string;
  outputLabel: string;
  showQuality?: boolean;
  defaultQuality?: number;
  fillWhite?: boolean;
}

function ConverterPage({
  slug, title, description, breadcrumbLabel, acceptAttr, acceptLabel,
  outputFormat, outputExt, outputLabel, showQuality = true, defaultQuality = 82, fillWhite = false,
}: ConverterPageProps) {
  const tool = getToolBySlug(slug)!;
  const related = getRelatedTools(tool);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [origSize, setOrigSize] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [output, setOutput] = useState("");
  const [outSize, setOutSize] = useState(0);
  const [quality, setQuality] = useState(defaultQuality);
  const [converting, setConverting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setOutput(""); setFileName(f.name); setOrigSize(f.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setPreview(src);
      const img = new Image();
      img.onload = () => setDims({ w: img.width, h: img.height });
      img.src = src;
    };
    reader.readAsDataURL(f);
  };

  const convert = () => {
    if (!preview) return;
    setConverting(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      if (fillWhite || outputFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const q = outputFormat === "image/png" ? 1 : quality / 100;
      const dataUrl = canvas.toDataURL(outputFormat, q);
      setOutput(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setOutSize(Math.round((base64.length * 3) / 4));
      setConverting(false);
    };
    img.src = preview;
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = output;
    a.download = fileName.replace(/\.[^.]+$/, "") + "." + outputExt;
    a.click();
  };

  const reset = () => {
    setPreview(""); setOutput(""); setFileName(""); setOrigSize(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "Image Tools", href: "/tools/image" }, { label: breadcrumbLabel }]} />
      <div className="mt-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-green-800">
        <Shield className="w-4 h-4 shrink-0" /> 🔒 Your files are processed locally. Never uploaded to any server.
      </div>

      {!preview ? (
        <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${dragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"}`}>
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="font-medium text-gray-700 mb-1">Drop an image here or click to browse</p>
          <p className="text-xs text-gray-400">Accepts: {acceptLabel}</p>
          <input ref={fileRef} type="file" accept={acceptAttr} className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200"><p className="font-semibold text-gray-700 text-sm">Original</p></div>
              <div className="p-4">
                <img src={preview} alt="Original" className="w-full h-48 object-contain rounded-lg bg-gray-50" />
                <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                  <p><span className="font-medium">Name:</span> {fileName}</p>
                  <p><span className="font-medium">Size:</span> {formatBytes(origSize)}</p>
                  <p><span className="font-medium">Dimensions:</span> {dims.w} × {dims.h}px</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200"><p className="font-semibold text-gray-700 text-sm">Converted ({outputLabel})</p></div>
              <div className="p-4">
                {output ? (
                  <>
                    <img src={output} alt="Converted" className="w-full h-48 object-contain rounded-lg bg-gray-50" />
                    <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                      <p><span className="font-medium">Size:</span> {formatBytes(outSize)}</p>
                      {origSize > 0 && outSize > 0 && (
                        <p><span className="font-medium">Change:</span>{" "}
                          <span className={outSize <= origSize ? "text-green-600" : "text-orange-500"}>
                            {outSize <= origSize ? `-${Math.round((1 - outSize / origSize) * 100)}%` : `+${Math.round((outSize / origSize - 1) * 100)}%`}
                          </span>
                        </p>
                      )}
                    </div>
                  </>
                ) : <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 text-sm">Converted preview will appear here</div>}
              </div>
            </div>
          </div>

          {showQuality && (
            <div className="bg-gray-50 rounded-xl px-5 py-4">
              <div className="flex justify-between mb-2"><label className="text-sm font-medium text-gray-700">Quality</label><span className="text-sm font-bold text-purple-700">{quality}%</span></div>
              <input type="range" min={10} max={100} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); setOutput(""); }} className="w-full accent-purple-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Smaller file</span><span>Better quality</span></div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button onClick={convert} disabled={converting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity" style={{ background: "linear-gradient(135deg,#6c3ce1,#8b5cf6)" }}>
              {converting && <RefreshCw className="w-4 h-4 animate-spin" />}{converting ? "Converting..." : `Convert to ${outputLabel}`}
            </button>
            {output && <button onClick={download} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"><Download className="w-4 h-4" /> Download {outputLabel}</button>}
            <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"><RefreshCw className="w-4 h-4" /> Reset</button>
          </div>
        </div>
      )}
      <RelatedTools tools={related} />
    </div>
  );
}

export default function JpgToWebpPage() {
  return <ConverterPage slug="jpg-to-webp" title="JPG to WebP Converter" description="Convert JPG images to WebP format for significantly smaller file sizes without visible quality loss. WebP files are 25-35% smaller than JPG. Processed entirely in your browser — no uploads." breadcrumbLabel="JPG to WebP" acceptAttr=".jpg,.jpeg,image/jpeg" acceptLabel=".JPG, .JPEG" outputFormat="image/webp" outputExt="webp" outputLabel="WebP" showQuality defaultQuality={82} />;
}

export { ConverterPage };
