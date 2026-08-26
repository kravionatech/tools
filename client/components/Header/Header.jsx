"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Search,
  ChevronDown,
  ArrowUpRight,
  Menu,
  X,
  Sparkles,
  Wrench,
  Code2,
  Image as ImageIcon,
  FileText,
  BarChart3,
  ShieldCheck,
  CircleHelp,
  Globe2,
  BookOpen,
  Activity,
  Check,
  Command,
  ScanSearch,
} from "lucide-react";

import { MenuList } from "../../utility/MenuList";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState("EN");

  const searchInputRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | CATEGORY ICONS
  |--------------------------------------------------------------------------
  */

  const getCategoryIcon = (name) => {
    const icons = {
      "SEO Audit": ShieldCheck,
      "Keyword Research": Search,
      "On-Page SEO": FileText,
      "Technical SEO": Code2,
      "Schema & Structured Data": Code2,
      "Content SEO": FileText,
      "Links & Backlinks": ArrowUpRight,
      "SERP Tools": BarChart3,
      "Local SEO": Globe2,
      "E-commerce SEO": Wrench,
      "Image SEO": ImageIcon,
      "International SEO": Globe2,
      "AI & GEO SEO": Sparkles,
      "Analytics & Webmaster": BarChart3,
    };

    return icons[name] || Wrench;
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH DATA
  |--------------------------------------------------------------------------
  */

  const searchableTools = useMemo(() => {
    const results = [];

    MenuList.forEach((item) => {
      if (item.type === "link") {
        results.push({
          name: item.name,
          description: item.description || "Explore this tool",
          href: item.href,
          category: "Tools",
        });
      }

      if (item.type === "mega-menu") {
        item.categories?.forEach((category) => {
          category.tools?.forEach((tool) => {
            results.push({
              name: tool.name,
              description: tool.description || "",
              href: tool.href,
              category: category.name,
              badge: tool.badge,
            });
          });
        });
      }

      if (item.type === "dropdown") {
        item.children?.forEach((child) => {
          results.push({
            name: child.name,
            description: child.description || "",
            href: child.href,
            category: item.name,
          });
        });
      }
    });

    return results;
  }, []);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return searchableTools.slice(0, 8);
    }

    return searchableTools
      .filter((tool) => {
        return (
          tool.name?.toLowerCase().includes(query) ||
          tool.description?.toLowerCase().includes(query) ||
          tool.category?.toLowerCase().includes(query)
        );
      })
      .slice(0, 10);
  }, [searchQuery, searchableTools]);

  /*
  |--------------------------------------------------------------------------
  | MENU
  |--------------------------------------------------------------------------
  */

  const toggleMenu = (name) => {
    setActiveMenu(activeMenu === name ? null : name);

    setSearchOpen(false);
    setLanguageOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const openSearch = () => {
    setSearchOpen(true);
    setActiveMenu(null);
    setLanguageOpen(false);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  /*
  |--------------------------------------------------------------------------
  | LANGUAGE
  |--------------------------------------------------------------------------
  */

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setLanguageOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | KEYBOARD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setLanguageOpen(false);
        setActiveMenu(null);
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className="
        sticky top-0 z-[100]
        w-full
        bg-[var(--header-bg)]
      "
    >
      {/* =====================================================
          TOP SEO STATUS BAR
      ===================================================== */}

      <div
        className="
          border-b
          border-[var(--border)]
          bg-[var(--header-dark)]
        "
      >
        <div
          className="
            mx-auto
            flex h-9
            max-w-[1440px]
            items-center
            justify-between
            px-4 sm:px-6 lg:px-8
          "
        >
          {/* LEFT */}

          <div className="flex items-center gap-4">
            <div
              className="
                flex items-center gap-2
                text-[10px]
                text-[#BDC1C6]
              "
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="
                    absolute
                    h-full w-full
                    animate-ping
                    rounded-full
                    bg-[var(--seo-green)]
                    opacity-40
                  "
                />

                <span
                  className="
                    relative
                    h-2 w-2
                    rounded-full
                    bg-[var(--seo-green)]
                  "
                />
              </span>
              All systems operational
            </div>

            <span className="hidden h-3 w-px bg-[#5F6368] sm:block" />

            <a
              href="/seo-tools"
              className="
                hidden sm:flex
                items-center gap-1.5
                text-[10px]
                font-medium
                text-[#BDC1C6]
                transition
                hover:text-white
              "
            >
              <ScanSearch size={12} className="text-[var(--search-blue)]" />
              SEO Tools
              <ArrowUpRight size={10} />
            </a>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-1">
            <a
              href="/docs"
              className="
                hidden md:flex
                items-center gap-1.5
                rounded-md
                px-2.5 py-1.5
                text-[10px]
                text-[#BDC1C6]
                transition
                hover:bg-[#303134]
                hover:text-white
              "
            >
              <BookOpen size={11} />
              Docs
            </a>

            <a
              href="/help"
              className="
                hidden sm:flex
                items-center gap-1.5
                rounded-md
                px-2.5 py-1.5
                text-[10px]
                text-[#BDC1C6]
                transition
                hover:bg-[#303134]
                hover:text-white
              "
            >
              <CircleHelp size={11} />
              Help
            </a>

            {/* LANGUAGE */}

            <div className="relative">
              <button
                onClick={() => {
                  setLanguageOpen(!languageOpen);
                  setSearchOpen(false);
                  setActiveMenu(null);
                }}
                className="
                  flex items-center gap-1.5
                  rounded-md
                  px-2.5 py-1.5
                  text-[10px]
                  font-medium
                  text-[#BDC1C6]
                  transition
                  hover:bg-[#303134]
                  hover:text-white
                "
              >
                <Globe2 size={11} />

                {language}

                <ChevronDown
                  size={10}
                  className={`transition-transform ${
                    languageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageOpen && (
                <div
                  className="
                    absolute right-0 top-8
                    z-[200]
                    w-36
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#3C4043]
                    bg-[#303134]
                    p-1.5
                    shadow-2xl
                  "
                >
                  <p
                    className="
                      px-2.5 py-2
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#9AA0A6]
                    "
                  >
                    Language
                  </p>

                  {[
                    ["EN", "English"],
                    ["HI", "हिन्दी"],
                  ].map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => changeLanguage(code)}
                      className="
                        flex w-full
                        items-center
                        justify-between
                        rounded-lg
                        px-2.5 py-2
                        text-left
                        text-[10px]
                        text-[#E8EAED]
                        transition
                        hover:bg-[#3C4043]
                      "
                    >
                      {name}

                      {language === code && (
                        <Check size={12} className="text-[var(--seo-green)]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <nav
        className="
          border-b
          border-[var(--border)]
          bg-white
        "
      >
        <div
          className="
            mx-auto
            flex h-[76px]
            max-w-[1440px]
            items-center
            px-4 sm:px-6 lg:px-8
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <a
            href="/"
            className="
              group
              flex
              shrink-0
              items-center
              gap-2.5
            "
          >
            <div
              className="
                relative
                flex h-10 w-10
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                bg-[var(--brand)]
              "
            >
              <span
                className="
                  text-lg
                  font-black
                  text-white
                "
              >
                K
              </span>

              <span
                className="
                  absolute
                  right-[-2px]
                  top-[-2px]
                  h-3.5 w-3.5
                  rounded-full
                  bg-[var(--seo-green)]
                "
              />
            </div>

            <div className="leading-none">
              <div
                className="
                  text-[17px]
                  font-bold
                  tracking-[-0.4px]
                  text-[var(--ink)]
                "
              >
                Kraviona
              </div>

              <div
                className="
                  mt-1
                  text-[8px]
                  font-bold
                  tracking-[2.5px]
                  text-[var(--brand)]
                "
              >
                TOOLS
              </div>
            </div>
          </a>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div className="ml-7 hidden h-full lg:block">
            <ul className="flex h-full items-center gap-0.5">
              {MenuList.map((item) => {
                const isActive = activeMenu === item.name;

                {
                  /* SIMPLE LINK */
                }

                if (item.type === "link") {
                  return (
                    <li key={item.name} className="flex h-full items-center">
                      <a
                        href={item.href}
                        className="
                          flex h-10
                          items-center
                          rounded-lg
                          px-3
                          text-[13px]
                          font-medium
                          text-[var(--muted)]
                          transition
                          hover:bg-[var(--surface-hover)]
                          hover:text-[var(--ink)]
                        "
                      >
                        {item.name}
                      </a>
                    </li>
                  );
                }

                {
                  /* MEGA MENU */
                }

                if (item.type === "mega-menu") {
                  return (
                    <li
                      key={item.name}
                      className="
                        relative
                        flex h-full
                        items-center
                      "
                    >
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`
                          flex h-10
                          items-center
                          gap-1.5
                          rounded-lg
                          px-3
                          text-[13px]
                          font-medium
                          transition

                          ${
                            isActive
                              ? `
                                bg-[var(--brand-soft)]
                                text-[var(--brand)]
                              `
                              : `
                                text-[var(--muted)]
                                hover:bg-[var(--surface-hover)]
                                hover:text-[var(--ink)]
                              `
                          }
                        `}
                      >
                        {item.name}

                        <ChevronDown
                          size={13}
                          className={`
                            transition-transform
                            ${isActive ? "rotate-180" : ""}
                          `}
                        />
                      </button>

                      {/* MEGA MENU */}

                      {isActive && (
                        <div
                          className="
                            absolute
                            left-0
                            top-[63px]
                            w-[850px]
                            overflow-hidden
                            rounded-2xl
                            border
                            border-[var(--border)]
                            bg-white
                            shadow-[0_24px_60px_rgba(32,33,36,0.15)]
                          "
                        >
                          {/* HEADER */}

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              border-b
                              border-[var(--border-light)]
                              bg-[var(--background)]
                              px-6 py-5
                            "
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="
                                  flex h-10 w-10
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-[var(--brand-soft)]
                                  text-[var(--brand)]
                                "
                              >
                                <BarChart3 size={18} />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h3
                                    className="
                                      text-sm
                                      font-bold
                                      text-[var(--ink)]
                                    "
                                  >
                                    {item.name}
                                  </h3>

                                  <span
                                    className="
                                      rounded-full
                                      bg-[var(--seo-green-soft)]
                                      px-2 py-0.5
                                      text-[8px]
                                      font-bold
                                      text-[var(--seo-green)]
                                    "
                                  >
                                    FREE
                                  </span>
                                </div>

                                <p
                                  className="
                                    mt-1
                                    text-[11px]
                                    text-[var(--muted)]
                                  "
                                >
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            <a
                              href="/seo-tools"
                              className="
                                flex
                                items-center
                                gap-1.5
                                rounded-lg
                                border
                                border-[var(--border)]
                                bg-white
                                px-3 py-2
                                text-[10px]
                                font-semibold
                                text-[var(--muted)]
                                transition
                                hover:border-[var(--brand)]
                                hover:text-[var(--brand)]
                              "
                            >
                              Explore all
                              <ArrowUpRight size={12} />
                            </a>
                          </div>

                          {/* CATEGORIES */}

                          <div
                            className="
                              grid
                              max-h-[520px]
                              grid-cols-3
                              gap-1
                              overflow-y-auto
                              p-4
                            "
                          >
                            {item.categories?.map((category) => {
                              const CategoryIcon = getCategoryIcon(
                                category.name,
                              );

                              return (
                                <div
                                  key={category.name}
                                  className="
                                      group
                                      rounded-xl
                                      p-3
                                      transition
                                      hover:bg-[var(--background)]
                                    "
                                >
                                  <div
                                    className="
                                        mb-2.5
                                        flex
                                        items-center
                                        gap-2
                                      "
                                  >
                                    <div
                                      className="
                                          flex h-8 w-8
                                          items-center
                                          justify-center
                                          rounded-lg
                                          bg-[var(--brand-soft)]
                                          text-[var(--brand)]
                                          transition
                                          group-hover:bg-[var(--brand)]
                                          group-hover:text-white
                                        "
                                    >
                                      <CategoryIcon size={14} />
                                    </div>

                                    <div className="min-w-0">
                                      <h4
                                        className="
                                            truncate
                                            text-[11px]
                                            font-bold
                                            text-[var(--ink)]
                                          "
                                      >
                                        {category.name}
                                      </h4>

                                      <p
                                        className="
                                            text-[9px]
                                            text-[var(--subtle)]
                                          "
                                      >
                                        {category.tools?.length || 0} tools
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-0.5">
                                    {category.tools?.slice(0, 4).map((tool) => (
                                      <a
                                        key={tool.name}
                                        href={tool.href}
                                        className="
                                              flex
                                              items-center
                                              justify-between
                                              rounded-md
                                              px-2 py-1.5
                                              text-[10px]
                                              text-[var(--muted)]
                                              transition
                                              hover:bg-white
                                              hover:text-[var(--brand)]
                                            "
                                      >
                                        <span className="truncate">
                                          {tool.name}
                                        </span>

                                        {tool.badge && (
                                          <span
                                            className="
                                                  ml-2
                                                  rounded
                                                  bg-[var(--seo-green-soft)]
                                                  px-1.5 py-0.5
                                                  text-[7px]
                                                  font-bold
                                                  text-[var(--seo-green)]
                                                "
                                          >
                                            {tool.badge}
                                          </span>
                                        )}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                }

                {
                  /* DROPDOWN */
                }

                return (
                  <li
                    key={item.name}
                    className="
                      relative
                      flex h-full
                      items-center
                    "
                  >
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={`
                        flex h-10
                        items-center
                        gap-1.5
                        rounded-lg
                        px-3
                        text-[13px]
                        font-medium
                        transition

                        ${
                          isActive
                            ? `
                              bg-[var(--brand-soft)]
                              text-[var(--brand)]
                            `
                            : `
                              text-[var(--muted)]
                              hover:bg-[var(--surface-hover)]
                              hover:text-[var(--ink)]
                            `
                        }
                      `}
                    >
                      {item.name}

                      <ChevronDown size={13} />
                    </button>

                    {isActive && (
                      <div
                        className="
                          absolute
                          left-0
                          top-[63px]
                          w-60
                          rounded-xl
                          border
                          border-[var(--border)]
                          bg-white
                          p-2
                          shadow-[0_20px_50px_rgba(32,33,36,0.14)]
                        "
                      >
                        {item.children?.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            className="
                                block
                                rounded-lg
                                px-3 py-2.5
                                text-xs
                                font-medium
                                text-[var(--muted)]
                                transition
                                hover:bg-[var(--brand-soft)]
                                hover:text-[var(--brand)]
                              "
                          >
                            {child.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div className="ml-auto flex items-center gap-2">
            {/* SEARCH */}

            <div className="relative hidden xl:block">
              <button
                onClick={openSearch}
                className="
                  group
                  flex h-10
                  w-[245px]
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-[var(--border)]
                  bg-[var(--background)]
                  px-3.5
                  transition
                  hover:border-[#BDC1C6]
                  hover:bg-white
                "
              >
                <Search
                  size={16}
                  className="
                    text-[var(--muted)]
                    transition
                    group-hover:text-[var(--brand)]
                  "
                />

                <span
                  className="
                    flex-1
                    text-left
                    text-[11px]
                    text-[var(--subtle)]
                  "
                >
                  Search SEO & tools...
                </span>

                <span
                  className="
                    hidden lg:flex
                    items-center
                    gap-1
                    rounded-md
                    border
                    border-[var(--border)]
                    bg-white
                    px-1.5 py-1
                    text-[8px]
                    text-[var(--subtle)]
                  "
                >
                  <Command size={9} />K
                </span>
              </button>

              {/* SEARCH PANEL */}

              {searchOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[48px]
                    w-[450px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-white
                    shadow-[0_25px_70px_rgba(32,33,36,0.18)]
                  "
                >
                  <div
                    className="
                      border-b
                      border-[var(--border-light)]
                      p-3
                    "
                  >
                    <div
                      className="
                        flex h-11
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-white
                        px-3
                        focus-within:border-[var(--brand)]
                        focus-within:ring-4
                        focus-within:ring-[var(--focus)]
                      "
                    >
                      <Search size={17} className="text-[var(--brand)]" />

                      <input
                        ref={searchInputRef}
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search SEO, keyword, image, PDF..."
                        className="
                          min-w-0
                          flex-1
                          bg-transparent
                          text-xs
                          text-[var(--ink)]
                          outline-none
                          placeholder:text-[var(--subtle)]
                        "
                      />

                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="
                            text-[var(--subtle)]
                            hover:text-[var(--ink)]
                          "
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto p-2">
                    <div
                      className="
                        px-2 py-2
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-[var(--subtle)]
                      "
                    >
                      {searchQuery ? "Search Results" : "Popular Tools"}
                    </div>

                    {searchResults.length > 0 ? (
                      searchResults.map((tool) => (
                        <a
                          key={`${tool.category}-${tool.name}`}
                          href={tool.href}
                          onClick={closeSearch}
                          className="
                            group
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3 py-3
                            transition
                            hover:bg-[var(--background)]
                          "
                        >
                          <div
                            className="
                              flex h-9 w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-[var(--brand-soft)]
                              text-[var(--brand)]
                              transition
                              group-hover:bg-[var(--brand)]
                              group-hover:text-white
                            "
                          >
                            <Wrench size={15} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className="
                                truncate
                                text-xs
                                font-semibold
                                text-[var(--ink)]
                              "
                            >
                              {tool.name}
                            </p>

                            <p
                              className="
                                mt-0.5
                                truncate
                                text-[10px]
                                text-[var(--subtle)]
                              "
                            >
                              {tool.category}
                            </p>
                          </div>

                          <ArrowUpRight
                            size={13}
                            className="
                              text-[#DADCE0]
                              transition
                              group-hover:text-[var(--brand)]
                            "
                          />
                        </a>
                      ))
                    ) : (
                      <div className="px-5 py-10 text-center">
                        <Search
                          size={24}
                          className="
                            mx-auto
                            text-[#DADCE0]
                          "
                        />

                        <p
                          className="
                            mt-3
                            text-xs
                            font-semibold
                            text-[var(--muted)]
                          "
                        >
                          No tools found
                        </p>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            text-[var(--subtle)]
                          "
                        >
                          Try SEO, keyword, image or PDF
                        </p>
                      </div>
                    )}
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-t
                      border-[var(--border-light)]
                      bg-[var(--background)]
                      px-4 py-2.5
                    "
                  >
                    <span
                      className="
                        text-[9px]
                        text-[var(--subtle)]
                      "
                    >
                      Search all Kraviona tools
                    </span>

                    <span
                      className="
                        text-[9px]
                        text-[var(--subtle)]
                      "
                    >
                      ESC to close
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* HELP */}

            <a
              href="/help"
              className="
                hidden sm:flex
                h-10 w-10
                items-center
                justify-center
                rounded-full
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--brand)]
              "
            >
              <CircleHelp size={18} />
            </a>

            {/* LOGIN */}

            <a
              href="/login"
              className="
                hidden sm:block
                px-2
                text-[12px]
                font-semibold
                text-[var(--text)]
                transition
                hover:text-[var(--brand)]
              "
            >
              Login
            </a>

            {/* CTA */}

            <a
              href="/tools"
              className="
                hidden sm:flex
                h-10
                items-center
                gap-1.5
                rounded-lg
                bg-[var(--brand)]
                px-4
                text-[11px]
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-[var(--brand-hover)]
              "
            >
              Explore Tools
              <ArrowUpRight size={14} />
            </a>

            {/* MOBILE */}

            <button
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setActiveMenu(null);
                closeSearch();
              }}
              className="
                flex lg:hidden
                h-10 w-10
                items-center
                justify-center
                rounded-lg
                border
                border-[var(--border)]
                text-[var(--ink)]
              "
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </nav>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileOpen && (
        <div
          className="
            border-t
            border-[var(--border)]
            bg-white
            px-4 py-3
            lg:hidden
          "
        >
          <button
            onClick={openSearch}
            className="
              mb-3
              flex h-11
              w-full
              items-center
              gap-2
              rounded-xl
              bg-[var(--background)]
              px-3
              text-[var(--muted)]
            "
          >
            <Search size={16} />

            <span className="text-xs">Search SEO & tools...</span>
          </button>

          {MenuList.map((item) => (
            <div key={item.name} className="border-b border-[#F1F3F4]">
              {item.type === "link" && (
                <a
                  href={item.href}
                  className="
                    flex h-12
                    items-center
                    text-sm
                    font-semibold
                    text-[var(--ink)]
                  "
                >
                  {item.name}
                </a>
              )}

              {(item.type === "mega-menu" || item.type === "dropdown") && (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className="
                      flex h-12
                      w-full
                      items-center
                      justify-between
                      text-sm
                      font-semibold
                      text-[var(--ink)]
                    "
                  >
                    {item.name}

                    <ChevronDown
                      size={16}
                      className={`
                        transition-transform
                        ${activeMenu === item.name ? "rotate-180" : ""}
                      `}
                    />
                  </button>

                  {activeMenu === item.name && (
                    <div className="pb-3">
                      {item.type === "mega-menu" &&
                        item.categories?.map((category) => {
                          const CategoryIcon = getCategoryIcon(category.name);

                          return (
                            <div key={category.name} className="mb-3">
                              <div
                                className="
                                    mb-1
                                    flex
                                    items-center
                                    gap-2
                                    px-2
                                    text-[11px]
                                    font-bold
                                    text-[var(--brand)]
                                  "
                              >
                                <CategoryIcon size={13} />

                                {category.name}
                              </div>

                              {category.tools?.map((tool) => (
                                <a
                                  key={tool.name}
                                  href={tool.href}
                                  className="
                                        block
                                        rounded-lg
                                        px-3 py-2
                                        text-xs
                                        text-[var(--muted)]
                                        hover:bg-[var(--brand-soft)]
                                        hover:text-[var(--brand)]
                                      "
                                >
                                  {tool.name}
                                </a>
                              ))}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {/* LANGUAGE */}

          <div className="mt-4 flex gap-2">
            {["EN", "HI"].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`
                  flex h-9
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  text-xs
                  font-semibold

                  ${
                    language === lang
                      ? `
                        border-[var(--brand)]
                        bg-[var(--brand-soft)]
                        text-[var(--brand)]
                      `
                      : `
                        border-[var(--border)]
                        text-[var(--muted)]
                      `
                  }
                `}
              >
                <Globe2 size={13} />

                {lang}
              </button>
            ))}
          </div>

          {/* CTA */}

          <a
            href="/tools"
            className="
              mt-3
              flex h-11
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[var(--brand)]
              text-xs
              font-bold
              text-white
              hover:bg-[var(--brand-hover)]
            "
          >
            Explore All Tools
            <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
