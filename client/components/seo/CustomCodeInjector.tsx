"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface PublicCodeSnippet {
  code: string;
  scope: "sitewide" | "home_only" | "tools_only";
}

interface PublicCustomCode {
  head: PublicCodeSnippet | null;
  bodyStart: PublicCodeSnippet | null;
  bodyEnd: PublicCodeSnippet | null;
  gtm: { containerId: string } | null;
  ga4: { measurementId: string } | null;
  metaPixel: { pixelId: string } | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// In-memory cache to avoid repeated HTTP requests on every single route transition
let cachedCustomCode: PublicCustomCode | null = null;
let fetchPromise: Promise<PublicCustomCode | null> | null = null;

async function fetchPublicCode(): Promise<PublicCustomCode | null> {
  if (cachedCustomCode) return cachedCustomCode;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/custom-code/public`);
      if (res.ok) {
        const data = await res.json();
        cachedCustomCode = data;
        return data;
      }
    } catch {
      // Fail silently in client
    } finally {
      fetchPromise = null;
    }
    return null;
  })();

  return fetchPromise;
}

function matchesScope(scope: string, pathname: string): boolean {
  if (scope === "sitewide") return true;
  if (scope === "home_only") return pathname === "/";
  if (scope === "tools_only") return pathname.startsWith("/tools");
  return true;
}

function injectHtmlSnippet(rawHtml: string, targetContainer: HTMLElement, locationTag: string) {
  if (!rawHtml || typeof window === "undefined") return;

  const temp = document.createElement("div");
  temp.innerHTML = rawHtml.trim();

  Array.from(temp.childNodes).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;

      // Special handling for <script> tags: innerHTML doesn't execute scripts automatically
      if (el.tagName.toLowerCase() === "script") {
        const newScript = document.createElement("script");
        Array.from(el.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
        newScript.setAttribute("data-kraviona-custom-code", locationTag);
        newScript.text = el.innerHTML;
        targetContainer.appendChild(newScript);
      } else {
        const clone = el.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-kraviona-custom-code", locationTag);
        targetContainer.appendChild(clone);
      }
    }
  });
}

export default function CustomCodeInjector() {
  const pathname = usePathname();
  const currentPathRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. STRICT SECURITY: Never inject custom code into administrative routes
    if (!pathname || pathname.startsWith("/admin")) {
      // Remove any previously injected elements if user transitions into /admin
      document.querySelectorAll("[data-kraviona-custom-code]").forEach((el) => el.remove());
      return;
    }

    currentPathRef.current = pathname;

    async function applyCode() {
      const data = await fetchPublicCode();
      if (!data) return;

      // Verify the path hasn't changed during async fetch
      if (currentPathRef.current !== pathname) return;

      // Remove existing injected elements to cleanly re-evaluate scoped code
      document.querySelectorAll("[data-kraviona-custom-code]").forEach((el) => el.remove());

      // ── A. GTM PRESET ────────────────────────────────────────────────────────
      if (data.gtm?.containerId) {
        const gtmId = data.gtm.containerId;
        const headScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','${gtmId}');`;
        
        const scriptEl = document.createElement("script");
        scriptEl.setAttribute("data-kraviona-custom-code", "gtm-head");
        scriptEl.text = headScript;
        document.head.appendChild(scriptEl);

        const noscriptHtml = `<noscript data-kraviona-custom-code="gtm-body"><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
        injectHtmlSnippet(noscriptHtml, document.body, "gtm-body");
      }

      // ── B. GA4 PRESET ────────────────────────────────────────────────────────
      if (data.ga4?.measurementId) {
        const gaId = data.ga4.measurementId;
        const gaScriptTag = document.createElement("script");
        gaScriptTag.setAttribute("async", "");
        gaScriptTag.setAttribute("src", `https://www.googletagmanager.com/gtag/js?id=${gaId}`);
        gaScriptTag.setAttribute("data-kraviona-custom-code", "ga4-lib");
        document.head.appendChild(gaScriptTag);

        const gaInitScript = document.createElement("script");
        gaInitScript.setAttribute("data-kraviona-custom-code", "ga4-init");
        gaInitScript.text = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`;
        document.head.appendChild(gaInitScript);
      }

      // ── C. META PIXEL PRESET ─────────────────────────────────────────────────
      if (data.metaPixel?.pixelId) {
        const pixelId = data.metaPixel.pixelId;
        const pixelScript = document.createElement("script");
        pixelScript.setAttribute("data-kraviona-custom-code", "meta-pixel");
        pixelScript.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '${pixelId}'); fbq('track', 'PageView');`;
        document.head.appendChild(pixelScript);
      }

      // ── D. CUSTOM HEAD CODE ──────────────────────────────────────────────────
      if (data.head?.code && matchesScope(data.head.scope, pathname)) {
        injectHtmlSnippet(data.head.code, document.head, "custom-head");
      }

      // ── E. CUSTOM BODY START CODE ────────────────────────────────────────────
      if (data.bodyStart?.code && matchesScope(data.bodyStart.scope, pathname)) {
        // Prepend to body
        const container = document.createElement("div");
        container.setAttribute("data-kraviona-custom-code", "custom-body-start");
        container.style.display = "contents";
        injectHtmlSnippet(data.bodyStart.code, container, "custom-body-start-inner");
        if (document.body.firstChild) {
          document.body.insertBefore(container, document.body.firstChild);
        } else {
          document.body.appendChild(container);
        }
      }

      // ── F. CUSTOM BODY END CODE ──────────────────────────────────────────────
      if (data.bodyEnd?.code && matchesScope(data.bodyEnd.scope, pathname)) {
        injectHtmlSnippet(data.bodyEnd.code, document.body, "custom-body-end");
      }
    }

    applyCode();
  }, [pathname]);

  return null;
}
