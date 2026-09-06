"use client";

import { useState, useRef } from "react";
import { Upload, Download, RefreshCw, Shield, Lock, Unlock } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import RelatedTools from "@/components/tools/RelatedTools";
import { getToolBySlug, getRelatedTools } from "@/lib/tools-registry";

const tool = getToolBySlug("image-resizer")!;
const related = getRelatedTools(tool);

function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
}

export default function ImageResizerPage() {
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("image/jpeg");
  const [origSize, setOrigSize] = useState(0);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [newW, setNewW] = useState(0);
  const [newH, setNewH] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [output, setOutput] = useState("");
  const [outSize, setOutSize] = useState(0);
  const [resizing, setResizing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setOutput(""); setFileName(f.name); setOrigSize(f.size); setFileType(f.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setPreview(src);
      const img = new Image();
      img.onload = () => {
        setOrigW(img.width); setOrigH(img.height);
        setNewW(img.width); setNewH(img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(f);
  };

  const handleWidthChange = (val: number) => {
    setNewW(val);
    if (lockRatio && origW > 0) setNewH(Math.round(val * origH / origW));
    setOutput("");
  };

  const handleHeightChange = (val: number) => {
    setNewH(val);
    if (lockRatio && origH > 0) setNewW(Math.round(val * origW / origH));
    setOutput("");
  };

  const resize = () => {
    if (!preview || newW <= 0 || newH <= 0) return;
    setResizing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = newW; canvas.height = newH;
      const ctx = canvas.getContext("2d")!;
      const fmt = fileType.includes("webp") ? "image/webp" : fileType.includes("png") ? "image/png" : "image/jpeg";
      if (fmt === "image/jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, newW, newH); }
      ctx.drawImage(img, 0, 0, newW, newH);
      const dataUrl = canvas.toDataURL(fmt, 0.9);
      setOutput(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setOutSize(Math.round((base64.length * 3) / 4));
      setResizing(false);
    };
    img.src = preview;
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = output;
    a.download = "resized_" + fileName;
    a.click();
  };

  const reset = () => {
    setPreview(""); setOutput(""); setFileName(""); setOrigSize(0); setOrigW(0); setOrigH(0); setNewW(0); setNewH(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "Image Tools", href: "/tools/image" }, { label: "Image Resizer" }]} />
      <div className="mt-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Image Resizer</h1>
        <p className="text-gray-500">Resize any image to custom dimensions in your browser. Lock the aspect ratio to prevent distortion, or set width and height independently. No uploads required.</p>
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
          <p className="text-xs text-gray-400">Accepts .jpg, .jpeg, .png, .webp, .gif</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200"><p className="font-semibold text-gray-700 text-sm">Original — {origW} × {origH}px · {formatBytes(origSize)}</p></div>
              <div className="p-4"><img src={preview} alt="Original" className="w-full h-48 object-contain rounded-lg bg-gray-50" /></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200"><p className="font-semibold text-gray-700 text-sm">Resized{outSize > 0 ? ` — ${newW} × ${newH}px · ${formatBytes(outSize)}` : ""}</p></div>
              <div className="p-4">
                {output ? <img src={output} alt="Resized" className="w-full h-48 object-contain rounded-lg bg-gray-50" /> : <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 text-sm">Resized image will appear here</div>}
              </div>
            </div>
          </div>

          {/* Dimensions input */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Output Dimensions</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Width (px)</label>
                <input type="number" min={1} max={8000} value={newW || ""} onChange={(e) => handleWidthChange(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400" />
              </div>
              <button onClick={() => setLockRatio(!lockRatio)} className={`mt-5 p-2 rounded-lg border transition-colors ${lockRatio ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-gray-100 border-gray-200 text-gray-500"}`} title={lockRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}>
                {lockRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Height (px)</label>
                <input type="number" min={1} max={8000} value={newH || ""} onChange={(e) => handleHeightChange(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Original: {origW} × {origH}px · {lockRatio ? "🔒 Aspect ratio locked" : "🔓 Free resize"}</p>
          </div>

          {/* Preset sizes */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Quick presets:</p>
            <div className="flex flex-wrap gap-2">
              {[{ label: "800×600", w: 800, h: 600 }, { label: "1280×720", w: 1280, h: 720 }, { label: "1920×1080", w: 1920, h: 1080 }, { label: "512×512", w: 512, h: 512 }, { label: "1080×1080", w: 1080, h: 1080 }].map(p => (
                <button key={p.label} onClick={() => { setNewW(p.w); setNewH(p.h); setOutput(""); }} className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-colors">{p.label}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={resize} disabled={resizing || newW <= 0 || newH <= 0} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity" style={{ background: "linear-gradient(135deg,#6c3ce1,#8b5cf6)" }}>
              {resizing && <RefreshCw className="w-4 h-4 animate-spin" />}{resizing ? "Resizing..." : "Resize Image"}
            </button>
            {output && <button onClick={download} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"><Download className="w-4 h-4" /> Download</button>}
            <button onClick={reset} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"><RefreshCw className="w-4 h-4" /> Reset</button>
          </div>
        </div>
      )}
      <RelatedTools tools={related} />
    </div>
  );
}
