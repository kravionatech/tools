"use client";

import { useState, useRef } from "react";
import { Upload, Download, RefreshCw } from "lucide-react";
import { trackToolUsage } from "@/components/analytics/AnalyticsTracker";

interface ImageConverterProps {
  acceptedFormats: string; // e.g. ".jpg,.jpeg"
  outputFormat: "image/png" | "image/jpeg" | "image/webp";
  outputExtension: string; // e.g. "png"
  showQuality?: boolean;
  defaultQuality?: number;
  fillWhite?: boolean; // for JPEG output (no transparency)
}

export function ImageConverter({
  acceptedFormats,
  outputFormat,
  outputExtension,
  showQuality = false,
  defaultQuality = 85,
  fillWhite = false,
}: ImageConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [quality, setQuality] = useState(defaultQuality);
  const [converting, setConverting] = useState(false);
  const [origSize, setOrigSize] = useState(0);
  const [outSize, setOutSize] = useState(0);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setOutput("");
    setError("");
    setOrigSize(f.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setPreview(src);
      const img = new Image();
      img.onload = () => setDimensions({ w: img.width, h: img.height });
      img.src = src;
    };
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const convert = () => {
    if (!file) return;
    setConverting(true);
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          if (fillWhite || outputFormat === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          const q = outputFormat === "image/png" ? 1 : quality / 100;
          const dataUrl = canvas.toDataURL(outputFormat, q);
          setOutput(dataUrl);
          // Estimate output size from base64
          const base64 = dataUrl.split(",")[1];
          setOutSize(Math.round((base64.length * 3) / 4));
          trackToolUsage(`image-to-${outputExtension}`);
        } catch {
          setError("Conversion failed. Please try a different image.");
        }
        setConverting(false);
      };
      img.onerror = () => {
        setError("Could not read image. Please try another file.");
        setConverting(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const download = () => {
    if (!output || !file) return;
    const a = document.createElement("a");
    a.href = output;
    a.download = file.name.replace(/\.[^.]+$/, "") + "." + outputExtension;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setPreview("");
    setOutput("");
    setError("");
    setOrigSize(0);
    setOutSize(0);
    if (fileRef.current) fileRef.current.value = "";
  };

  const formatBytes = (b: number) =>
    b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(2) + " MB";

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
        >
          <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-medium text-gray-600 mb-1">Drop your image here or click to browse</p>
          <p className="text-sm text-gray-400">Accepts: {acceptedFormats.toUpperCase().replace(/\./g, "").replace(/,/g, ", ")}</p>
          <input
            ref={fileRef}
            type="file"
            accept={acceptedFormats}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Original</p>
            <img src={preview} alt="Original" className="w-full max-h-64 object-contain rounded-xl bg-white border border-gray-100" />
            <div className="mt-3 space-y-1 text-sm text-gray-500">
              <div className="flex justify-between"><span>File:</span><span className="font-medium text-gray-700 truncate max-w-[160px]">{file.name}</span></div>
              <div className="flex justify-between"><span>Size:</span><span className="font-medium text-gray-700">{formatBytes(origSize)}</span></div>
              <div className="flex justify-between"><span>Dimensions:</span><span className="font-medium text-gray-700">{dimensions.w} × {dimensions.h}</span></div>
            </div>
          </div>

          {/* Output */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Converted</p>
            {output ? (
              <>
                <img src={output} alt="Converted" className="w-full max-h-64 object-contain rounded-xl bg-white border border-gray-100" />
                <div className="mt-3 space-y-1 text-sm text-gray-500">
                  <div className="flex justify-between"><span>Format:</span><span className="font-medium text-gray-700">.{outputExtension.toUpperCase()}</span></div>
                  <div className="flex justify-between"><span>Size:</span><span className="font-medium text-gray-700">{formatBytes(outSize)}</span></div>
                  {origSize > 0 && outSize > 0 && (
                    <div className="flex justify-between"><span>Change:</span>
                      <span className={`font-medium ${outSize < origSize ? "text-green-600" : "text-orange-500"}`}>
                        {outSize < origSize ? "-" : "+"}{Math.abs(Math.round((outSize - origSize) / origSize * 100))}%
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full h-40 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 text-sm">
                Converted image will appear here
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      {/* Quality slider */}
      {file && showQuality && (
        <div className="bg-gray-50 rounded-xl px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Quality</label>
            <span className="text-sm font-bold text-purple-700">{quality}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Smaller file</span><span>Better quality</span>
          </div>
        </div>
      )}

      {/* Actions */}
      {file && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={convert}
            disabled={converting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6c3ce1, #8b5cf6)" }}
          >
            {converting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            {converting ? "Converting..." : `Convert to .${outputExtension.toUpperCase()}`}
          </button>
          {output && (
            <button
              onClick={download}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          )}
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5">
        🔒 Your files are processed locally in your browser. They are never uploaded to any server.
      </p>
    </div>
  );
}
