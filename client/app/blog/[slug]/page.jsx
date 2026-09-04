import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Calendar,
  Tag,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "../../../lib/blogData";
import Breadcrumbs from "../../../components/Breadcrumbs";
import JsonLd from "../../../components/JsonLd";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Guide Not Found" };

  const canonicalUrl = `https://kraviona.site/blog/${post.slug}`;

  return {
    title: `${post.title} | Kraviona Guides`,
    description: post.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description: post.metaDescription,
      publishedTime: post.publishedDate,
      authors: [post.author],
      siteName: "Kraviona",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "datePublished": post.publishedDate,
    "dateModified": post.publishedDate,
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": "https://kraviona.site",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Kraviona",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kraviona.site/favicon.svg",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kraviona.site/blog/${post.slug}`,
    },
  };

  const faqSchema = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      }
    : null;

  return (
    <article className="page article-container">
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <Breadcrumbs
        items={[
          { label: "Blog & Guides", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <header className="article-header">
        <div className="article-meta-badges">
          <span className="category-tag">
            <Tag size={13} /> {post.category}
          </span>
          <span className="read-time">
            <Clock size={13} /> {post.readingTime}
          </span>
          <span className="publish-date">
            <Calendar size={13} /> {new Date(post.publishedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>

        <h1 className="article-title">{post.title}</h1>
        <p className="article-summary-lead">{post.summary}</p>
      </header>

      {/* Direct Answer Box for Search Intent (featured snippet optimization) */}
      <div className="direct-answer-box">
        <div className="direct-answer-title">
          <CheckCircle size={18} />
          <strong>Direct Answer & Key Takeaway</strong>
        </div>
        <p>{post.directAnswer}</p>
      </div>

      {/* Main Content Sections */}
      <div className="article-body">
        {post.sections.map((section, idx) => (
          <section key={idx} className="article-section">
            <h2>{section.heading}</h2>
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{
                __html: section.content
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/\n- /g, "</li><li>")
                  .replace(/<li>/g, "<ul><li>")
                  .replace(/<\/li>(?!<li>)/g, "</li></ul>")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/`(.*?)`/g, "<code>$1</code>"),
              }}
            />
          </section>
        ))}
      </div>

      {/* Tool Callout Widget (Content-to-Tool Linking) */}
      {post.relatedTool && (
        <aside className="tool-embed-cta">
          <div className="cta-icon">
            <Wrench size={28} />
          </div>
          <div className="cta-text">
            <p className="eyebrow">Try Kraviona Tool</p>
            <h3>{post.relatedTool.name}</h3>
            <p>{post.relatedTool.description}</p>
          </div>
          <Link href={post.relatedTool.path} className="button cta-action-btn">
            {post.relatedTool.cta} <ArrowRight size={16} />
          </Link>
        </aside>
      )}

      {/* Frequently Asked Questions */}
      {post.faqs && post.faqs.length > 0 && (
        <section className="article-faq-section">
          <div className="faq-title-row">
            <HelpCircle size={22} />
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-accordion">
            {post.faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Guides */}
      {relatedPosts.length > 0 && (
        <section className="related-articles-section">
          <h2>Continue Reading: Related Guides</h2>
          <div className="cards">
            {relatedPosts.map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`} className="card">
                <span className="eyebrow">{related.category}</span>
                <h3>{related.title}</h3>
                <p>{related.summary.slice(0, 110)}...</p>
                <span>Read guide →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
