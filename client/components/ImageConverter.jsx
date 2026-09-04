"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  ImagePlus,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Check,
  Lock,
  Unlock,
  AlertCircle,
  FileCheck,
} from "lucide-react";

const FORMAT_MAP = {
  webp: { label: "WebP", mime: "image/webp", ext: "webp", note: "Modern web standard with superior compression" },
  png: { label: "PNG", mime: "image/png", ext: "png", note: "Lossless quality with full transparency support" },
  jpg: { label: "JPG", mime: "image/jpeg", ext: "jpg", note: "Universal compatibility with adjustable lossy compression" },
  avif: { label: "AVIF", mime: "image/avif", ext: "avif", note: "Next-gen compression format for cutting-edge browsers" },
};

export default function ImageConverter({
  initialTargetFormat = "webp",
  presetSourceNote = "",
  presetTargetNote = "",
}) {
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });
  
  const [targetFormat, setTargetFormat] = useState(initialTargetFormat);
  const [quality, setQuality] = useState(85);
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  
  const fileInputRef = useRef(null);

  // Clean up object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);

  const handleFileSelection = (selectedFile) => {
    setError("");
    setResult(null);

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      return setError("Please select a valid image file (JPG, PNG, WebP, or AVIF).");
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      return setError("Maximum file size is 25 MB. Please select a smaller file.");
    }

    if (sourceUrl) URL.revokeObjectURL(sourceUrl);

    const objectUrl = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = () => {
      setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setCustomWidth(img.naturalWidth);
      setCustomHeight(img.naturalHeight);
    };
    img.src = objectUrl;

    setFile(selectedFile);
    setSourceUrl(objectUrl);
  };

  const handleWidthChange = (val) => {
    setCustomWidth(val);
    if (lockAspectRatio && naturalDimensions.width > 0 && val > 0) {
      const ratio = naturalDimensions.height / naturalDimensions.width;
      setCustomHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val) => {
    setCustomHeight(val);
    if (lockAspectRatio && naturalDimensions.height > 0 && val > 0) {
      const ratio = naturalDimensions.width / naturalDimensions.height;
      setCustomWidth(Math.round(val * ratio));
    }
  };

  const handleConvert = () => {
    if (!file || !sourceUrl) return;
    setConverting(true);
    setError("");

    const image = new Image();
    image.onload = () => {
      try {
        const targetW = Number(customWidth) > 0 ? Number(customWidth) : image.naturalWidth;
        const targetH = Number(customHeight) > 0 ? Number(customHeight) : image.naturalHeight;

        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Browser canvas context could not be initialized.");

        // If converting transparent image to JPG, fill white background to prevent black alpha matte
        if (targetFormat === "jpg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, targetW, targetH);
        }

        ctx.drawImage(image, 0, 0, targetW, targetH);

        const formatConfig = FORMAT_MAP[targetFormat] || FORMAT_MAP.webp;
        const mimeType = formatConfig.mime;
        const qualityDecimal = quality / 100;

        const dataUrl = canvas.toDataURL(mimeType, qualityDecimal);

        // Feature detection for AVIF canvas support
        if (targetFormat === "avif" && !dataUrl.startsWith("data:image/avif")) {
          throw new Error("AVIF export is not supported in this browser engine. WebP is recommended as an alternative.");
        }

        // Calculate approximate output size from Base64
        const stringLength = dataUrl.length - `data:${mimeType};base64,`.length;
        const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.562489633438363;

        const originalName = file.name.replace(/\.[^.]+$/, "");
        const outputFilename = `${originalName}.${formatConfig.ext}`;

        setResult({
          dataUrl,
          filename: outputFilename,
          formatLabel: formatConfig.label,
          width: targetW,
          height: targetH,
          originalBytes: file.size,
          outputBytes: Math.round(sizeInBytes),
        });
      } catch (conversionErr) {
        setError(conversionErr.message || "Failed to convert image. Please check format compatibility.");
      } finally {
        setConverting(false);
      }
    };

    image.onerror = () => {
      setError("Unable to decode source image file.");
      setConverting(false);
    };

    image.src = sourceUrl;
  };

  const handleReset = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    setFile(null);
    setSourceUrl("");
    setResult(null);
    setError("");
    setCustomWidth("");
    setCustomHeight("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) return "0 KB";
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const calculateSavings = (original, final) => {
    if (!original || !final) return null;
    const diff = original - final;
    const percent = Math.round((diff / original) * 100);
    return percent;
  };

  return (
    <div className="converter-widget">
      {/* Dropzone */}
      <div
        className={`dropzone-card ${file ? "has-file" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileSelection(e.dataTransfer.files[0]);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(e) => handleFileSelection(e.target.files[0])}
        />

        <div className="dropzone-content">
          <div className="dropzone-icon">
            <ImagePlus size={32} />
          </div>
          {file ? (
            <div className="file-info-badge">
              <span className="file-name">{file.name}</span>
              <span className="file-meta">
                {formatFileSize(file.size)} • {naturalDimensions.width} × {naturalDimensions.height} px
              </span>
            </div>
          ) : (
            <div className="dropzone-prompt">
              <strong>Drag & drop an image here or click to browse</strong>
              <p>Supports JPG, PNG, WebP, and AVIF up to 25 MB</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="status-banner error" role="alert">
          <AlertCircle size={20} />
          <div>
            <strong>Conversion Notice</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Configuration Controls */}
      {file && (
        <div className="converter-controls-panel">
          <div className="panel-header">
            <Sliders size={18} />
            <span>Output Settings</span>
          </div>

          <div className="controls-grid">
            {/* Format Selection */}
            <div className="control-group">
              <label htmlFor="format-select">Target Format</label>
              <select
                id="format-select"
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="select-input"
              >
                {Object.entries(FORMAT_MAP).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label} ({item.ext.toUpperCase()})
                  </option>
                ))}
              </select>
              <small className="control-hint">{FORMAT_MAP[targetFormat]?.note}</small>
            </div>

            {/* Quality Slider (for lossy formats) */}
            <div className="control-group">
              <div className="label-with-value">
                <label htmlFor="quality-slider">Quality Compression</label>
                <span className="val-badge">{quality}%</span>
              </div>
              <input
                id="quality-slider"
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="range-slider"
                disabled={targetFormat === "png"} // PNG is lossless
              />
              <small className="control-hint">
                {targetFormat === "png"
                  ? "PNG uses lossless compression (quality setting is bypassed)"
                  : "80%–85% provides optimal balance between visual fidelity and file size"}
              </small>
            </div>

            {/* Dimensions Control */}
            <div className="control-group dimensions-group">
              <div className="label-with-value">
                <label>Dimensions (Pixels)</label>
                <button
                  type="button"
                  className={`lock-ratio-btn ${lockAspectRatio ? "active" : ""}`}
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  title={lockAspectRatio ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                >
                  {lockAspectRatio ? <Lock size={14} /> : <Unlock size={14} />}
                  <span>{lockAspectRatio ? "Lock Ratio" : "Free Ratio"}</span>
                </button>
              </div>

              <div className="dimensions-inputs">
                <div className="dim-field">
                  <span>W:</span>
                  <input
                    type="number"
                    min="1"
                    value={customWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="Width"
                  />
                </div>
                <span className="dim-sep">×</span>
                <div className="dim-field">
                  <span>H:</span>
                  <input
                    type="number"
                    min="1"
                    value={customHeight}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="Height"
                  />
                </div>
              </div>
              <small className="control-hint">Leave at natural values or customize to resize image</small>
            </div>
          </div>

          <div className="converter-actions">
            <button
              type="button"
              className="button convert-btn"
              onClick={handleConvert}
              disabled={converting}
            >
              {converting ? "Processing..." : `Convert to ${FORMAT_MAP[targetFormat]?.label || "Format"}`}
            </button>
            <button type="button" className="button alt reset-btn" onClick={handleReset}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="conversion-result-card">
          <div className="result-preview">
            <img src={result.dataUrl} alt="Converted output preview" />
          </div>

          <div className="result-details">
            <div className="result-badge-row">
              <span className="success-tag">
                <FileCheck size={14} /> Ready for Download
              </span>
              {calculateSavings(result.originalBytes, result.outputBytes) !== null && (
                <span
                  className={`savings-tag ${
                    calculateSavings(result.originalBytes, result.outputBytes) > 0 ? "positive" : "neutral"
                  }`}
                >
                  {calculateSavings(result.originalBytes, result.outputBytes) > 0
                    ? `${calculateSavings(result.originalBytes, result.outputBytes)}% Smaller`
                    : "Converted Size"}
                </span>
              )}
            </div>

            <h4 className="result-filename">{result.filename}</h4>

            <div className="result-specs">
              <div>
                <span>Format:</span>
                <strong>{result.formatLabel}</strong>
              </div>
              <div>
                <span>Dimensions:</span>
                <strong>{result.width} × {result.height} px</strong>
              </div>
              <div>
                <span>Original Size:</span>
                <strong>{formatFileSize(result.originalBytes)}</strong>
              </div>
              <div>
                <span>Output Size:</span>
                <strong>{formatFileSize(result.outputBytes)}</strong>
              </div>
            </div>

            <a
              href={result.dataUrl}
              download={result.filename}
              className="button download-btn"
            >
              <Download size={18} />
              <span>Download {result.formatLabel} File</span>
            </a>
          </div>
        </div>
      )}

      {/* Privacy Guarantee Note */}
      <div className="privacy-guarantee">
        <ShieldCheck size={18} className="shield-icon" />
        <p>
          <strong>Privacy Guarantee:</strong> All image rendering and compression takes place 100% locally in your browser memory via the HTML5 Canvas engine. Files are never transmitted across the network.
        </p>
      </div>
    </div>
  );
}
