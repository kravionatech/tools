"use client";
import { ConverterPage } from "../jpg-to-webp/page";
export default function WebpToPngPage() {
  return <ConverterPage slug="webp-to-png" title="WebP to PNG Converter" description="Convert WebP images to PNG format in your browser. PNG output supports full transparency and is lossless. Your files are never uploaded — all processing runs locally." breadcrumbLabel="WebP to PNG" acceptAttr=".webp,image/webp" acceptLabel=".WEBP" outputFormat="image/png" outputExt="png" outputLabel="PNG" showQuality={false} />;
}
