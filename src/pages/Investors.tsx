import { useState } from "react";
import { investors } from "../data";
import InvestorCard from "../components/investor/InvestorCard";
import { useRevealAll } from "../hooks/useReveal";

function RevealWatcher() { useRevealAll(); return null; }

const interestFilters = ["All", "AI/ML", "DevTools", "SaaS", "FinTech", "Logistics", "CleanTech", "HealthTech"];
const stageFilters = ["All", "Idea", "Pre-seed", "Seed", "Early Stage"];

export default function Investors() {
  const [search, setSearch] = useState("");
  const [interest, setInterest] = useState("All");
  const [stage, setStage] = useState("All");

  const filtered = investors.filter((inv) => {
    const matchSearch = !search || inv.name.toLowerCase().includes(search.toLowerCase()) || inv.bio.toLowerCase().includes(search.toLowerCase());
    const matchInterest = interest === "All" || inv.interests.some((i) => i.toLowerCase().includes(interest.toLowerCase()));
    const matchStage = stage === "All" || inv.investmentStage.includes(stage);
    return matchSearch && matchInterest && matchStage;
  });

  return (
    <div>
      <RevealWatcher />
      {/* Header */}
      <section className="bg-[#0D1421] py-14 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#2557D6] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Investors</p>
            <h1 className="text-[32px] lg:text-[46px] font-bold text-white mt-1 mb-4 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Investors Backing the Next Generation.
            </h1>
            <p className="text-[15px] text-[#9CA3AF] leading-[1.7] max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
              Explore investors actively looking for student-founded startups. Filter by interest area, stage preference, and investment range.
            </p>
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-10 bg-[#F5F4F0]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input
                type="text"
                placeholder="Search investors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#DDD9D2] rounded-[6px] text-[13.5px] bg-white text-[#0D1421] placeholder-[#C5C0BB] focus:outline-none focus:ring-2 focus:ring-[#2557D6] focus:border-transparent"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <select value={interest} onChange={(e) => setInterest(e.target.value)}
              className="px-3.5 py-2.5 border border-[#DDD9D2] rounded-[6px] text-[13.5px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2557D6] bg-white"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {interestFilters.map((f) => <option key={f}>{f}</option>)}
            </select>
            <select value={stage} onChange={(e) => setStage(e.target.value)}
              className="px-3.5 py-2.5 border border-[#DDD9D2] rounded-[6px] text-[13.5px] text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#2557D6] bg-white"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {stageFilters.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>

          <p className="text-[13px] text-[#6B7280] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            {filtered.length} investor{filtered.length !== 1 ? "s" : ""} found
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[22px] font-bold text-[#DDD9D2] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>No investors found</p>
              <p className="text-[14px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>Try a different filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 reveal">
              {filtered.map((inv) => (
                <InvestorCard key={inv.id} investor={inv} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
