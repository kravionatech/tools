"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "SEO Tools", href: "/seo-tools" },
  { label: "Image Tools", href: "/tools/image-converter" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" onClick={() => setMobileOpen(false)}>
          <span className="brand-logo">K</span>
          <span className="brand-text">Kraviona</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="header-cta" href="/tools">
            Explore Tools
          </Link>
          <button
            type="button"
            className="mobile-toggle"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <nav aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/tools"
              className="mobile-cta"
              onClick={() => setMobileOpen(false)}
            >
              All Tools Directory
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
