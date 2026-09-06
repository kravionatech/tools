import Link from "next/link";
import { tools } from "@/lib/tools-registry";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8">
        The page you&apos;re looking for doesn&apos;t exist. It may have been moved or the URL may be incorrect.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #6c3ce1, #8b5cf6)" }}
        >
          Go to Homepage
        </Link>
        <Link
          href="/tools"
          className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
        >
          Browse All Tools
        </Link>
      </div>
      <div className="border-t border-gray-100 pt-8">
        <p className="text-sm text-gray-400 mb-4">Popular tools:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {tools.filter((t) => t.popular).map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm hover:bg-purple-100 transition-colors"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
