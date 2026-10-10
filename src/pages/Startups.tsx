import { useState, useEffect } from "react";
import { Link } from "react-router";
import StartupCard from "../components/startup/StartupCard";
import { useRevealAll } from "../hooks/useReveal";
import { getPublicStartups } from "../services/startupService";

function RevealWatcher() { useRevealAll(); return null; }

const categories = ["All", "EdTech", "Logistics", "HealthTech", "CleanTech", "DevTools", "RetailTech"];
const stages = ["All", "Idea", "Pre-seed", "Seed", "Early Stage"];
const sortOptions = ["Trending", "Newest", "Highest Rated", "Most Funded"];

function adaptStartup(s: Record<string, unknown>) {
  const founder = s.profiles as Record<string, string> | null;
  return {
    id: s.id as string,
    name: (s.title as string) ?? "",
    pitch: (s.short_pitch as string) ?? "",
    founder: founder?.full_name ?? "Unknown Founder",
    founderAvatar: founder?.avatar_url,
    category: (s.industry as string) ?? "General",
    stage: (s.stage as string) ?? "Idea",
    fundingRequired: s.funding_required ? `$${Number(s.funding_required).toLocaleString()}` : "Undisclosed",
    rating: Number(s.avg_rating ?? 0),
    investorInterest: Number(s.investor_interest_count ?? 0),
    image: (s.cover_image_url as string) ?? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&auto=format",
  };
}

export default function Startups() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stage, setStage] = useState("All");
  const [sort, setSort] = useState("Trending");
  const [allStartups, setAllStartups] = useState<ReturnType<typeof adaptStartup>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicStartups({ limit: 100 })
      .then((data) => setAllStartups((data as Record<string, unknown>[]).map(adaptStartup)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = allStartups.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !search || s.name.toLowerCase().includes(q) || s.pitch.toLowerCase().includes(q);
    const matchCat = category === "All" || s.category === category;
    const matchStage = stage === "All" || s.stage === stage;
    return matchSearch && matchCat && matchStage;
  });

  return (
    <div>
      <RevealWatcher />

      {/* Hero */}
      <section className="bg-[#0D1421] py-14 lg:py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#2557D6] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Student Startup Ideas</p>
              <h1 className="text-[32px] lg:text-[46px] font-bold text-white mt-1 mb-4 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {"Your Idea Could Be Someone's"}<br />Next Investment.
              </h1>
              <p className="text-[15px] text-[#9CA3AF] leading-[1.7] mb-7 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
                Share your startup idea, receive meaningful feedback, and connect with investors ready to back the next generation.
              </p>
              <Link
                to="/submit-idea"
                className="inline-flex items-center gap-2 bg-[#2557D6] text-white px-5 py-3 rounded-[6px] text-[14px] font-medium hover:bg-[#1E4AB8] transition-colors group"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Submit Your Idea
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
            <div className="hidden lg:block relative rounded-2xl overflow-hidden bg-[#1A2535]" style={{ aspectRatio: "16/9" }}>
              <img
                src="https://images.unsplash.com/photo-1758873272809-7947b9a73fe5?w=800&h=450&fit=crop&auto=format"
                alt="Startup founders collaborating"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#EEECEA] border-b border-[#DDD9D2]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-5">
          <div className="flex flex-wrap items-center gap-8 lg:gap-16">
            {[
              { val: "1,240+", label: "Ideas Submitted",    color: "text-[#2557D6]" },
              { val: "320+",   label: "Active Investors",   color: "text-[#16A34A]" },
              { val: "18",     label: "Categories",         color: "text-[#D97706]" },
              { val: "$12.4M", label: "Funding Requested",  color: "text-[#7C3AED]" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className={`text-[22px] font-bold ${s.color}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.val}</span>
                <span className="text-[13px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Idea Privacy */}
      <section className="bg-white border-b border-[#DDD9D2]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8">
          <h2 className="text-[16px] font-bold text-[#0D1421] mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            You Control Who Sees Your Idea.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Public", icon: "🌍", desc: "Anyone can discover your idea on the platform.", bg: "bg-[#EEF2FF]", border: "border-[#C7D7F9]" },
              { label: "Investors Only", icon: "🔒", desc: "Only verified investors can view the complete details.", bg: "bg-[#FFFBEB]", border: "border-[#FDE68A]" },
              { label: "Private", icon: "🕶️", desc: "Only visible to you. Submit and decide later.", bg: "bg-[#F0F9FF]", border: "border-[#BAE6FD]" },
            ].map((opt) => (
              <div key={opt.label} className={`flex gap-3.5 p-4 ${opt.bg} rounded-xl border ${opt.border}`}>
                <span className="text-xl shrink-0 mt-0.5">{opt.icon}</span>
                <div>
                  <h3 className="font-semibold text-[13.5px] text-[#0D1421] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opt.label}</h3>
                  <p className="text-[12px] text-[#5A6070] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery */}
      <section className="py-10 bg-[#F5F4F0]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input type="text" placeholder="Search startup ideas..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#DDD9D2] rounded-[6px] text-[13.5px] bg-white text-[#0D1421] placeholder-[#C5C0BB] focus:outline-none focus:ring-2 focus:ring-[#2557D6] focus:border-transparent"
                style={{ fontFamily: "'Inter', sans-serif" }} />
            </div>
            {[
              { val: category, set: setCategory, opts: categories, label: "Industry" },
              { val: stage,    set: setStage,    opts: stages,     label: "Stage" },
              { val: sort,     set: setSort,     opts: sortOptions, label: "Sort" },
            ].map((f) => (
              <select key={f.label} value={f.val} onChange={(e) => f.set(e.target.value)}
                className="px-3.5 py-2.5 border border-[#DDD9D2] rounded-[6px] text-[13.5px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2557D6] bg-white"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {f.opts.map((o) => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-7">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all border ${category === c ? "bg-[#0D1421] text-white border-[#0D1421]" : "bg-white text-[#5A6070] border-[#DDD9D2] hover:border-[#9CA3AF]"}`}
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-[13px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {loading ? "Loading..." : `${filtered.length} idea${filtered.length !== 1 ? "s" : ""} found`}
            </p>
            <Link to="/submit-idea" className="text-[13px] font-semibold text-[#2557D6] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>
              + Submit your idea
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-7 h-7 border-2 border-[#2557D6] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[22px] font-bold text-[#DDD9D2] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>No ideas found</p>
              <p className="text-[14px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {allStartups.length === 0 ? "Be the first to submit an idea." : "Try a different search or filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
              {filtered.map((s) => (
                <StartupCard key={s.id} startup={s} featured />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
