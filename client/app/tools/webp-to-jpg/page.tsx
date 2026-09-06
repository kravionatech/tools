"use client";
import { ConverterPage } from "../jpg-to-webp/page";
export default function WebpToJpgPage() {
  return <ConverterPage slug="webp-to-jpg" title="WebP to JPG Converter" description="Convert WebP images back to JPG format directly in your browser. Transparent areas are filled with white for JPEG compatibility. No file uploads — your images stay private." breadcrumbLabel="WebP to JPG" acceptAttr=".webp,image/webp" acceptLabel=".WEBP" outputFormat="image/jpeg" outputExt="jpg" outputLabel="JPG" showQuality defaultQuality={85} fillWhite />;
}
