"use client";
import { ConverterPage } from "../jpg-to-webp/page";
export default function PngToWebpPage() {
  return <ConverterPage slug="png-to-webp" title="PNG to WebP Converter" description="Convert PNG images to WebP format for better web performance. WebP files are typically 25-35% smaller than PNG. Transparent backgrounds are preserved in WebP. Processed entirely in your browser — no uploads." breadcrumbLabel="PNG to WebP" acceptAttr=".png,image/png" acceptLabel=".PNG" outputFormat="image/webp" outputExt="webp" outputLabel="WebP" showQuality defaultQuality={82} />;
}
