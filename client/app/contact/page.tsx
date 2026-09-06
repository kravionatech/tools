import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Kraviona Tools",
  description: "Get in touch with the Kraviona Tools team. Report bugs, suggest new tools, or ask questions.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Contact Us</h1>
      <p className="text-gray-500 mb-8">
        Have a question, found a bug, or want to suggest a new tool? We&apos;d love to hear from you.
      </p>

      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
          <h2 className="font-semibold text-gray-800 mb-1">Report a Bug</h2>
          <p className="text-sm text-gray-600">
            If a tool isn&apos;t working correctly, please describe the issue and which browser you are using.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h2 className="font-semibold text-gray-800 mb-1">Suggest a Tool</h2>
          <p className="text-sm text-gray-600">
            We&apos;re always looking for useful tools that can run entirely in the browser. If you have an idea, let us know.
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-5">
          <h2 className="font-semibold text-gray-800 mb-1">General Questions</h2>
          <p className="text-sm text-gray-600">
            For anything else, reach out and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <p className="text-sm text-gray-600 mb-2">
          📧 <strong>Email:</strong>{" "}
          <a href="mailto:hello@kraviona.site" className="text-purple-600 hover:underline">
            hello@kraviona.site
          </a>
        </p>
        <p className="text-sm text-gray-500">We typically respond within 1-2 business days.</p>
      </div>
    </div>
  );
}
