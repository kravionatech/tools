import React from "react";
import {
  Search,
  ArrowRight,
  Zap,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const SeoDashboard = () => {
  return (
    <div className="relative w-full max-w-[650px]">
      {/* Background shape */}

      <div className="absolute right-5 top-10 h-[360px] w-[360px] rounded-full bg-blue-50 blur-3xl" />

      {/* Decorative dots */}

      <div className="seo-dots absolute left-5 top-12 grid grid-cols-5 gap-3 opacity-60">
        {Array.from({ length: 25 }).map((_, index) => (
          <span key={index} className="h-1.5 w-1.5 rounded-full bg-blue-300" />
        ))}
      </div>

      {/* Dashboard */}

      <div className="seo-dashboard relative z-10">
        {/* Browser */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_25px_70px_rgba(37,99,235,0.14)]">
          {/* Browser top */}

          <div className="flex h-11 items-center gap-2 border-b border-gray-100 bg-gray-50 px-4">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

            <div className="ml-5 h-5 flex-1 rounded bg-white" />
          </div>

          {/* Dashboard body */}

          <div className="flex min-h-[350px]">
            {/* Sidebar */}

            <div className="hidden w-14 border-r border-gray-100 bg-white py-5 sm:block">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Search size={15} />
              </div>

              <div className="mt-7 space-y-5">
                <div className="mx-auto h-4 w-4 rounded bg-gray-200" />
                <div className="mx-auto h-4 w-4 rounded bg-gray-200" />
                <div className="mx-auto h-4 w-4 rounded bg-blue-100" />
                <div className="mx-auto h-4 w-4 rounded bg-gray-200" />
              </div>
            </div>

            {/* Main */}

            <div className="flex-1 bg-white p-5 sm:p-7">
              {/* Heading */}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-gray-400">
                    WEBSITE ANALYSIS
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-gray-900">
                    SEO Overview
                  </h3>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-full border-[7px] border-blue-100 border-t-blue-600 sm:flex">
                  <span className="text-[10px] font-bold text-gray-800">
                    86
                  </span>
                </div>
              </div>

              {/* Stats */}

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-[9px] text-gray-400">Site Score</p>

                  <p className="mt-2 text-xl font-bold text-gray-900">86</p>

                  <p className="mt-1 text-[8px] text-green-600">Excellent</p>
                </div>

                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-[9px] text-gray-400">Issues</p>

                  <p className="mt-2 text-xl font-bold text-gray-900">124</p>

                  <p className="mt-1 text-[8px] text-green-600">↓ 12%</p>
                </div>

                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-[9px] text-gray-400">Traffic</p>

                  <p className="mt-2 text-xl font-bold text-gray-900">15.6K</p>

                  <p className="mt-1 text-[8px] text-green-600">↑ 18%</p>
                </div>

                <div className="rounded-lg border border-gray-100 p-3">
                  <p className="text-[9px] text-gray-400">Backlinks</p>

                  <p className="mt-2 text-xl font-bold text-gray-900">2.4K</p>

                  <p className="mt-1 text-[8px] text-green-600">↑ 9%</p>
                </div>
              </div>

              {/* Lower section */}

              <div className="mt-4 grid gap-4 sm:grid-cols-[1.5fr_1fr]">
                {/* Chart */}

                <div className="rounded-lg border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-gray-800">
                      Organic Performance
                    </p>

                    <TrendingUp size={13} className="text-green-500" />
                  </div>

                  <svg
                    viewBox="0 0 400 130"
                    className="mt-4 h-[130px] w-full"
                    fill="none"
                  >
                    <path
                      d="M5 105 C45 85 60 95 90 70 C120 45 135 85 165 65 C200 40 215 70 245 42 C275 15 290 48 315 25 C340 5 365 35 395 8"
                      stroke="#2563EB"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <path
                      d="M5 105 C45 85 60 95 90 70 C120 45 135 85 165 65 C200 40 215 70 245 42 C275 15 290 48 315 25 C340 5 365 35 395 8 L395 130 L5 130 Z"
                      fill="#EFF6FF"
                    />
                  </svg>
                </div>

                {/* Issues */}

                <div className="rounded-lg border border-gray-100 p-4">
                  <p className="text-[10px] font-semibold text-gray-800">
                    SEO Issues
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[9px] text-gray-600">
                        <AlertCircle size={11} className="text-red-500" />
                        Meta titles
                      </span>

                      <span className="text-[9px] font-semibold">32</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[9px] text-gray-600">
                        <AlertCircle size={11} className="text-red-500" />
                        Meta descriptions
                      </span>

                      <span className="text-[9px] font-semibold">28</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[9px] text-gray-600">
                        <AlertCircle size={11} className="text-yellow-500" />
                        Page speed
                      </span>

                      <span className="text-[9px] font-semibold">24</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[9px] text-gray-600">
                        <CheckCircle2 size={11} className="text-green-500" />
                        Broken links
                      </span>

                      <span className="text-[9px] font-semibold">16</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating health card */}

        <div
          className="
          seo-health-card
          absolute
          -bottom-8
          left-8
          z-20
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-gray-200
          bg-white
          px-4
          py-3
          shadow-[0_15px_40px_rgba(0,0,0,0.10)]
          sm:left-16
        "
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
            <ShieldCheck size={18} />
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-900">
              Your website is healthy
            </p>

            <p className="mt-0.5 text-[9px] text-gray-400">
              Keep up the great work
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Banner = () => {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div
          className="
          grid
          min-h-[680px]
          items-center
          gap-12
          py-16
          lg:grid-cols-[0.85fr_1.15fr]
          lg:gap-8
          lg:py-20
        "
        >
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="relative z-10 max-w-[570px]">
            {/* Label */}

            <div
              className="
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-100
              bg-blue-50
              px-3
              py-1.5
              text-xs
              font-medium
              text-blue-600
            "
            >
              <Search size={14} />
              SEO Tools for Everyone
            </div>

            {/* Heading */}

            <h1
              className="
              text-[44px]
              font-bold
              leading-[1.06]
              tracking-[-1.8px]
              text-gray-900

              sm:text-[54px]

              lg:text-[62px]
            "
            >
              Simple tools for
              <span className="block text-blue-600">better SEO.</span>
            </h1>

            {/* Description */}

            <p
              className="
              mt-6
              max-w-[530px]
              text-[16px]
              leading-7
              text-gray-600
              sm:text-[17px]
            "
            >
              Analyze your website, find SEO issues and optimize your pages with
              fast, practical tools built for everyday SEO work.
            </p>

            {/* Buttons */}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/seo-tools"
                className="
                  inline-flex
                  h-12
                  items-center
                  gap-2
                  rounded-md
                  bg-blue-600
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                "
              >
                Explore SEO Tools
                <ArrowRight size={16} />
              </a>

              <a
                href="/tools"
                className="
                  inline-flex
                  h-12
                  items-center
                  gap-2
                  rounded-md
                  border
                  border-gray-300
                  bg-white
                  px-5
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                "
              >
                View All Tools
              </a>
            </div>

            {/* Trust points */}

            <div
              className="
              mt-10
              grid
              grid-cols-3
              gap-4
              border-t
              border-gray-100
              pt-6
            "
            >
              <div>
                <Zap size={17} className="text-blue-600" />

                <p className="mt-2 text-xs font-medium text-gray-800">
                  Fast analysis
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Results in seconds
                </p>
              </div>

              <div>
                <ShieldCheck size={17} className="text-green-600" />

                <p className="mt-2 text-xs font-medium text-gray-800">
                  Reliable results
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Built for SEO work
                </p>
              </div>

              <div>
                <Sparkles size={17} className="text-blue-600" />

                <p className="mt-2 text-xs font-medium text-gray-800">
                  Free tools
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  No signup required
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <div
            className="
            flex
            items-center
            justify-center
            lg:justify-end
          "
          >
            <SeoDashboard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
