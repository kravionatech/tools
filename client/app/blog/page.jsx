"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Clock, Calendar, ArrowRight, Tag } from "lucide-react";
import { BLOG_POSTS, getAllCategories } from "../../lib/blogData";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...getAllCategories()];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="page">
      <Breadcrumbs items={[{ label: "Blog & Guides", href: "/blog" }]} />

      <div className="intro">
        <p className="eyebrow">Knowledge Base & Guides</p>
        <h1>Actionable guides for modern webmasters.</h1>
        <p>
          Straightforward explanations of SEO ranking signals, domain intelligence, and web image optimization. No fluff, no fake metrics.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="blog-filter-bar">
        <div className="category-pills" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search articles"
          />
        </div>
      </div>

      {/* Post Grid */}
      <div className="articles-grid">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="article-card">
            <div className="article-meta">
              <span className="category-tag">
                <Tag size={12} /> {post.category}
              </span>
              <span className="read-time">
                <Clock size={12} /> {post.readingTime}
              </span>
            </div>

            <h2>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>

            <p className="article-excerpt">{post.summary}</p>

            <div className="article-footer">
              <span className="publish-date">
                <Calendar size={12} /> {new Date(post.publishedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <Link href={`/blog/${post.slug}`} className="read-more-link">
                Read Guide <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="no-results-box">
          <BookOpen size={36} />
          <p>No guides found matching your search criteria.</p>
          <button
            type="button"
            className="button alt"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
}
