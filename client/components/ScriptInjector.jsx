"use client";

import { useEffect } from "react";

/**
 * ScriptInjector executes any dynamic <script> tags injected via raw HTML
 * to guarantee that JavaScript tags (GA4, GTM, Pixel) execute in client-side navigation.
 */
export default function ScriptInjector({ headerScripts, bodyScripts }) {
  useEffect(() => {
    function executeScriptsFromHtml(htmlContent, targetElement) {
      if (!htmlContent || !targetElement) return;

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const scripts = doc.querySelectorAll("script");

      scripts.forEach((oldScript) => {
        // Prevent duplicate execution if script tag already exists with same src or id
        if (oldScript.src && document.querySelector(`script[src="${oldScript.src}"]`)) {
          return;
        }

        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        targetElement.appendChild(newScript);
      });
    }

    if (headerScripts) {
      executeScriptsFromHtml(headerScripts, document.head);
    }
    if (bodyScripts) {
      executeScriptsFromHtml(bodyScripts, document.body);
    }
  }, [headerScripts, bodyScripts]);

  return null;
}
