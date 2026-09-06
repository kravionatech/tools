"use client";

import { useState, useRef } from "react";
import { Upload, Shield, Copy, Check } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import RelatedTools from "@/components/tools/RelatedTools";
import { getToolBySlug, getRelatedTools } from "@/lib/tools-registry";

const tool = getToolBySlug("image-to-base64")!;
const related = getRelatedTools(tool);

export default function ImageToBase64Page() {
  const [preview, setPreview] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [base64Only, setBase64Only] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setDataUrl(result);
      setPreview(result);
      const parts = result.split(",");
      setMimeType(parts[0].replace("data:", "").replace(";base64", ""));
      setBase64Only(parts[1]);
    };
    reader.readAsDataURL(f);
  };

  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* fallback */ }
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => { setPreview(""); setDataUrl(""); setBase64Only(""); setFileName(""); if (fileRef.current) fileRef.current.value = ""; };

  const CopyBtn = ({ text, label, k }: { text: string; label: string; k: string }) => (
    <button onClick={() => copy(text, k)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${copied === k ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700"}`}>
      {copied === k ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied === k ? "Copied!" : label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "Image Tools", href: "/tools/image" }, { label: "Image to Base64" }]} />
      <div className="mt-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Image to Base64 Converter</h1>
        <p className="text-gray-500">Convert any image to a Base64 encoded string for embedding in HTML, CSS, or JSON without external file references. Fully processed in your browser.</p>
      </div>
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-green-800">
        <Shield className="w-4 h-4 shrink-0" /> 🔒 Your files are processed locally. Never uploaded to any server.
      </div>

      {!dataUrl ? (
        <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${dragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"}`}>
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="font-medium text-gray-700 mb-1">Drop an image here or click to browse</p>
          <p className="text-xs text-gray-400">Accepts any image format</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <img src={preview} alt={fileName} className="w-24 h-24 object-contain rounded-xl border border-gray-100 bg-gray-50" />
            <div>
              <p className="font-medium text-gray-800">{fileName}</p>
              <p className="text-sm text-gray-500">Type: {mimeType}</p>
              <p className="text-sm text-gray-500">Base64 length: {base64Only.length.toLocaleString()} characters</p>
              <button onClick={reset} className="mt-2 text-xs text-purple-600 hover:underline">Change image</button>
            </div>
          </div>

          {/* Data URL */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Data URL (full)</p>
              <CopyBtn text={dataUrl} label="Copy Data URL" k="dataurl" />
            </div>
            <textarea readOnly value={dataUrl} rows={3} className="w-full text-xs font-mono bg-white border border-gray-200 rounded-lg p-2 resize-none text-gray-600" />
          </div>

          {/* Base64 only */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Base64 string only</p>
              <CopyBtn text={base64Only} label="Copy Base64" k="b64" />
            </div>
            <textarea readOnly value={base64Only} rows={3} className="w-full text-xs font-mono bg-white border border-gray-200 rounded-lg p-2 resize-none text-gray-600" />
          </div>

          {/* HTML usage */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">HTML img tag</p>
              <CopyBtn text={`<img src="${dataUrl}" alt="${fileName}" />`} label="Copy HTML" k="html" />
            </div>
            <code className="text-xs text-gray-600 break-all">{`<img src="${dataUrl.slice(0, 80)}..." alt="${fileName}" />`}</code>
          </div>

          {/* CSS usage */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">CSS background-image</p>
              <CopyBtn text={`background-image: url('${dataUrl}');`} label="Copy CSS" k="css" />
            </div>
            <code className="text-xs text-gray-600">{`background-image: url('${dataUrl.slice(0, 60)}...');`}</code>
          </div>
        </div>
      )}
      <RelatedTools tools={related} />
    </div>
  );
}
