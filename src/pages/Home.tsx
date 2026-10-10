import { Link } from "react-router"
import { useEffect, useState } from "react"
import { startups } from "../data"
import StartupCard from "../components/startup/StartupCard"
import { FeaturedNewsCard, MediumNewsCard } from "../components/news/NewsCard"
import Badge from "../components/ui/Badge"
import { useRevealAll } from "../hooks/useReveal"
import { getPublishedNews } from "../services/newsService"

function adaptNews(item: Record<string, unknown>) {
  return {
    id: item.id as string,
    slug: item.slug as string,
    title: item.title as string,
    summary: (item.summary as string) ?? "",
    image: (item.cover_image_url as string) ?? "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop&auto=format",
    category: (item.category as string) ?? "General",
    source: (item.source_name as string) ?? "FounderBridge",
    publishedAt: (item.published_at as string) ?? new Date().toISOString(),
    readingTime: "3 min read",
  };
}

/* ── Scroll reveal watcher ── */
function RevealWatcher() {
  useRevealAll()
  return null
}

function HeroStatCard() {
  return (
    <div className="absolute bottom-5 left-5 animate-float bg-white rounded-xl border border-[#DDD9D2] shadow-[0_8px_28px_rgba(0,0,0,0.12)] p-4 w-52">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
          <svg
            className="w-3.5 h-3.5 text-[#2557D6]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
            />
          </svg>
        </div>
        <span
          className="text-[12px] font-semibold text-[#0D1421]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Platform Stats
        </span>
      </div>
      {[
        { label: "Startup Ideas", value: "1,240+", color: "text-[#2557D6]" },
        { label: "Active Investors", value: "380", color: "text-[#16A34A]" },
        { label: "Funded This Month", value: "$4.2M", color: "text-[#D97706]" },
      ].map((s) => (
        <div
          key={s.label}
          className="flex items-center justify-between py-1.5 border-b border-[#F0EDE8] last:border-b-0"
        >
          <span
            className="text-[11.5px] text-[#6B7280]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {s.label}
          </span>
          <span
            className={`text-[12.5px] font-bold ${s.color}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {s.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function IdeaScoreCard() {
  return (
    <div className="absolute -right-3 top-8 bg-white rounded-xl border border-[#DDD9D2] shadow-[0_8px_24px_rgba(0,0,0,0.10)] p-4 w-44">
      <p
        className="text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-1"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Idea Score
      </p>
      <p
        className="text-[28px] font-bold text-[#0D1421] leading-none mb-1"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        4.8<span className="text-[14px] text-[#9CA3AF] font-normal">/5</span>
      </p>
      <div className="flex gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${
              i <= 5 ? "text-[#D97706]" : "text-[#E5E5E2]"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p
        className="text-[11px] text-[#6B7280]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        14 investors interested
      </p>
    </div>
  )
}

export default function Home() {
  const featuredStartup = startups[4]
  const sideStartups = [startups[0], startups[1], startups[3]]
  const [homeNews, setHomeNews] = useState<ReturnType<typeof adaptNews>[]>([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    getPublishedNews({ limit: 3 })
      .then((data) => setHomeNews((data as Record<string, unknown>[]).map(adaptNews)))
      .catch(console.error)
      .finally(() => setNewsLoading(false));
  }, []);

  const featuredNews = homeNews[0]
  const supportingNews = homeNews.slice(1, 3)

  return (
    <div>
      <RevealWatcher />

      {/* ── HERO ── */}
      <section className="bg-[#0D1421] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="animate-fade-up inline-flex items-center gap-2 bg-[#1A2535] border border-[#2A3A50] rounded-full px-3.5 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 bg-[#2557D6] rounded-full animate-pulse" />
                <span
                  className="text-[12px] font-medium text-[#7BB3FF]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  1,240 ideas submitted this year
                </span>
              </div>

              <h1
                className="animate-fade-up delay-100 text-[40px] lg:text-[54px] font-bold leading-[1.08] text-white mb-5 tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Where Student Ideas
                <br />
                Meet Opportunity.
              </h1>

              <p
                className="animate-fade-up delay-200 text-[15px] lg:text-[16px] text-[#9CA3AF] leading-[1.7] mb-8 max-w-md"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Discover promising student startups, connect ideas with
                investors, and build software designed around your business.
              </p>

              <div className="animate-fade-up delay-300 flex flex-wrap gap-3 mb-10">
                <Link
                  to="/startups"
                  className="inline-flex items-center gap-2 bg-[#2557D6] text-white px-5 py-3 rounded-[6px] text-[14px] font-medium hover:bg-[#1E4AB8] transition-colors duration-150 group"
                >
                  Explore Startup Ideas
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
                <Link
                  to="/build-saas"
                  className="inline-flex items-center gap-2 bg-transparent text-white border border-[#2A3A50] px-5 py-3 rounded-[6px] text-[14px] font-medium hover:border-[#4A5A70] hover:bg-[#1A2535] transition-all duration-150"
                >
                  Build Your SaaS
                </Link>
              </div>

              {/* Stats row */}
              <div className="animate-fade-up delay-400 flex items-center gap-8 pt-8 border-t border-[#1A2535]">
                {[
                  {
                    val: "1,240+",
                    label: "Startup Ideas",
                    color: "text-[#7BB3FF]",
                  },
                  { val: "380", label: "Investors", color: "text-[#6EE7B7]" },
                  {
                    val: "$4.2M",
                    label: "Monthly Funding",
                    color: "text-[#FCD34D]",
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <p
                      className={`text-[22px] font-bold leading-none mb-0.5 ${s.color}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {s.val}
                    </p>
                    <p
                      className="text-[11.5px] text-[#4B5563]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — image */}
            <div className="animate-fade-in delay-200 relative">
              <div
                className="relative rounded-2xl overflow-hidden bg-[#1A2535]"
                style={{ aspectRatio: "4/5" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1758876020491-9560594ec362?w=800&h=1000&fit=crop&auto=format"
                  alt="Student founder"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1421]/50 via-transparent to-transparent" />
              </div>
              <HeroStatCard />
              <IdeaScoreCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── INVESTOR SECTION ── */}
      <section className="py-16 lg:py-24 bg-[#F5F4F0]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="reveal flex items-end justify-between mb-10">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#2557D6] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                For Investors
              </p>
              <h2
                className="text-[28px] lg:text-[38px] font-bold text-[#0D1421] leading-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Discover Ideas Worth
                <br />
                Investing In.
              </h2>
              <p
                className="text-[14px] text-[#5A6070] mt-2 max-w-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Rate ideas, give feedback, save promising startups, and connect
                with the next generation of founders.
              </p>
            </div>
            <Link
              to="/startups"
              className="hidden md:flex items-center gap-1.5 text-[13.5px] font-medium text-[#2557D6] group"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Explore all startup ideas
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          <div className=" grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1">
              <StartupCard startup={featuredStartup} featured />
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 gap-4">
              {sideStartups.map((s) => (
                <StartupCard key={s.id} startup={s} />
              ))}
            </div>
          </div>

          <div
            className="reveal mt-5 flex gap-2 items-center text-[13px] text-[#6B7280]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="flex -space-x-1.5">
              {[
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-6 h-6 rounded-full border-2 border-[#F5F4F0] object-cover"
                />
              ))}
            </div>
            <span className="text-[#2557D6] font-medium">380 investors</span>{" "}
            actively browsing startup ideas right now.
          </div>
        </div>
      </section>

      {/* ── SAAS SECTION ── */}
      <section className="py-16 lg:py-24 bg-[#0D1421]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="reveal">
              <p
                className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#2557D6] mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                For Businesses
              </p>
              <h2
                className="text-[28px] lg:text-[40px] font-bold text-white leading-tight mb-5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Software Built Around
                <br />
                Your Business.
              </h2>
              <p
                className="text-[15px] text-[#9CA3AF] leading-[1.7] mb-8 max-w-md"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Tell us what your business needs. We design and build a SaaS
                solution around your exact workflow — not the other way around.
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 mb-8">
                {[
                  "CRM",
                  "Inventory",
                  "Billing",
                  "HR & Payroll",
                  "Analytics",
                  "Appointments",
                  "Customer Portal",
                  "Custom Tools",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-[13px] text-[#9CA3AF]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <span className="w-1.5 h-1.5 bg-[#2557D6] rounded-full shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                to="/build-saas"
                className="inline-flex items-center gap-2 bg-[#2557D6] text-white px-5 py-3 rounded-[6px] text-[14px] font-medium hover:bg-[#1E4AB8] transition-colors group"
              >
                Build Your SaaS
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>

            <div className="reveal relative">
              <div
                className="rounded-2xl overflow-hidden bg-[#1A2535]"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1753164597612-5e71b83fda91?w=800&h=600&fit=crop&auto=format"
                  alt="Business owner using custom SaaS"
                  className="w-full h-full object-cover opacity-75"
                />
              </div>
              {/* Mini dashboard */}
              <div className="absolute -bottom-5 -left-4 bg-[#111827] border border-[#1F2D3F] rounded-xl p-4 w-56 shadow-2xl">
                <p
                  className="text-[10px] text-[#4B5563] uppercase tracking-widest mb-3"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Your Dashboard
                </p>
                {[
                  {
                    label: "Monthly Revenue",
                    val: "$24,800",
                    color: "text-[#4ADE80]",
                  },
                  {
                    label: "New Customers",
                    val: "42",
                    color: "text-[#60A5FA]",
                  },
                  { label: "Open Tickets", val: "7", color: "text-[#F87171]" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between py-2 border-b border-[#1F2D3F] last:border-b-0"
                  >
                    <span
                      className="text-[11px] text-[#6B7280]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {m.label}
                    </span>
                    <span
                      className={`text-[12.5px] font-bold ${m.color}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWS SECTION ── */}
      <section className="py-16 lg:py-24 bg-[#EEECEA]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="reveal flex items-end justify-between mb-10">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#2557D6] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Tech News
              </p>
              <h2
                className="text-[28px] lg:text-[38px] font-bold text-[#0D1421] leading-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {"What's Happening in Tech Today?"}
              </h2>
            </div>
            <Link
              to="/news"
              className="hidden md:flex items-center gap-1.5 text-[13.5px] font-medium text-[#2557D6] group"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              View all tech news
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          {newsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-5 h-5 border-2 border-[#2557D6] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : homeNews.length === 0 ? (
            <div className="text-center py-12">
              <p
                className="text-[14px] text-[#9CA3AF]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                No articles yet.
              </p>
              <Link
                to="/news"
                className="text-[13px] text-[#2557D6] hover:underline mt-2 inline-block"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                View all tech news
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1">
                {featuredNews && <FeaturedNewsCard article={featuredNews} />}
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {supportingNews.map((a) => (
                  <MediumNewsCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 lg:py-24 bg-[#F5F4F0]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="reveal text-center mb-12">
            <h2
              className="text-[26px] lg:text-[38px] font-bold text-[#0D1421] mb-3 leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Have an Idea. Need a Solution.
              <br />
              Looking for {"What's"} Next?
            </h2>
            <p
              className="text-[14.5px] text-[#5A6070] max-w-md mx-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Three ways to use FounderBridge — choose your path.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "💡",
                title: "Student",
                desc: "Submit your startup idea and get it in front of investors who care about early-stage potential.",
                cta: "Submit Your Idea",
                to: "/submit-idea",
                bg: "bg-[#EEF2FF]",
                accent: "text-[#2557D6]",
                border: "border-[#C7D7F9]",
              },
              {
                icon: "📈",
                title: "Investor",
                desc: "Discover promising student founders. Rate ideas, give feedback, and connect with tomorrow's builders.",
                cta: "Discover Founders",
                to: "/startups",
                bg: "bg-[#0D1421]",
                accent: "text-[#7BB3FF]",
                border: "border-[#1A2535]",
                dark: true,
              },
              {
                icon: "🏢",
                title: "Business",
                desc: "Tell us what your business needs. We design and build software tailored to your exact workflow.",
                cta: "Build Your SaaS",
                to: "/build-saas",
                bg: "bg-[#ECFDF5]",
                accent: "text-[#16A34A]",
                border: "border-[#A7F3D0]",
              },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className={`group flex flex-col p-8 ${item.bg} border ${item.border} rounded-2xl hover:-translate-y-1 transition-transform duration-200`}
              >
                <span className="text-3xl mb-4">{item.icon}</span>
                <h3
                  className={`text-[19px] font-bold mb-2 ${
                    item.dark ? "text-white" : "text-[#0D1421]"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-[13.5px] leading-relaxed mb-6 flex-1 ${
                    item.dark ? "text-[#9CA3AF]" : "text-[#5A6070]"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.desc}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${item.accent} group-hover:gap-3 transition-all`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.cta}
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
