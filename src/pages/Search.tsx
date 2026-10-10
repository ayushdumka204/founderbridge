import { useState } from "react";
import { Link } from "react-router";
import { startups, investors } from "../data";
import { posts } from "../data/feed";
import { catClass } from "../utils/categoryColor";

type Tab = "all" | "people" | "startups" | "posts" | "news";

const allPeople = [
  { id: "p1", name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop", role: "Angel Investor", industry: "EdTech, HealthTech", location: "London, UK", verified: true },
  { id: "p2", name: "David Osei", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", role: "VC Partner · Volta Ventures", industry: "Logistics, Fintech", location: "Lagos, Nigeria", verified: true },
  { id: "p3", name: "Natalie Russo", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop", role: "VC Partner · HealthFront", industry: "HealthTech", location: "Berlin, Germany", verified: true },
  { id: "p4", name: "James Park", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop", role: "Angel Investor", industry: "SaaS, DevTools", location: "Seoul, Korea", verified: false },
  { id: "p5", name: "Aisha Okonkwo", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b2d5?w=80&h=80&fit=crop", role: "Founder · EduBridge", industry: "EdTech", location: "Nairobi, Kenya", verified: false },
];

const recentSearches = ["AI SaaS investors", "EdTech startup Nairobi", "West Africa logistics", "DevTools founders"];
const suggested = ["HealthTech pre-seed", "Student founders 2026", "CleanTech CSRD", "FinTech angel"];

export default function Search() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [follows, setFollows] = useState<Record<string, boolean>>({});

  const q = query.toLowerCase().trim();

  const filteredPeople = allPeople.filter((p) => !q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.industry.toLowerCase().includes(q));
  const filteredStartups = startups.filter((s) => !q || s.name.toLowerCase().includes(q) || s.pitch.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  const filteredPosts = posts.filter((p) => !q || p.content.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q));

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "people", label: "People" },
    { id: "startups", label: "Startups" },
    { id: "posts", label: "Posts" },
    { id: "news", label: "News" },
  ];

  const showPeople = tab === "all" || tab === "people";
  const showStartups = tab === "all" || tab === "startups";
  const showPosts = tab === "all" || tab === "posts";

  return (
    <div className="bg-[#F5F4F0] min-h-[calc(100vh-64px)]">
      <div className="max-w-[860px] mx-auto px-4 lg:px-8 py-8 lg:py-10">

        {/* Search bar */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FounderBridge..."
            className="w-full pl-12 pr-5 py-3.5 bg-white border border-[#DDD9D2] rounded-2xl text-[15px] text-[#0D1421] placeholder-[#C5C0BB] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2557D6] focus:border-transparent"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* No query: recent + suggested */}
        {!query && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[12px] uppercase tracking-widest text-[#9CA3AF] font-semibold mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Recent Searches</h3>
              <div className="space-y-1">
                {recentSearches.map((s) => (
                  <button key={s} onClick={() => setQuery(s)} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white hover:border hover:border-[#DDD9D2] transition-colors group text-left">
                    <svg className="w-4 h-4 text-[#C5C0BB] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    <span className="text-[13.5px] text-[#4B5563] group-hover:text-[#0D1421] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>{s}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[12px] uppercase tracking-widest text-[#9CA3AF] font-semibold mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Suggested</h3>
              <div className="flex flex-wrap gap-2">
                {suggested.map((s) => (
                  <button key={s} onClick={() => setQuery(s)} className="px-3 py-1.5 bg-white border border-[#DDD9D2] rounded-full text-[12.5px] text-[#4B5563] hover:border-[#2557D6] hover:text-[#2557D6] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Query: tabs + results */}
        {query && (
          <div>
            <div className="flex gap-1 mb-5 bg-white border border-[#DDD9D2] rounded-xl p-1 w-fit">
              {tabs.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${tab === t.id ? "bg-[#0D1421] text-white" : "text-[#6B7280] hover:text-[#0D1421]"}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {/* People */}
              {showPeople && filteredPeople.length > 0 && (
                <div>
                  {tab === "all" && <h3 className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>People</h3>}
                  <div className="space-y-2">
                    {filteredPeople.slice(0, tab === "all" ? 3 : undefined).map((p) => (
                      <div key={p.id} className="flex items-center gap-3 bg-white border border-[#DDD9D2] rounded-xl px-4 py-3">
                        <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[13.5px] font-semibold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{p.name}</p>
                            {p.verified && <svg className="w-3.5 h-3.5 text-[#2557D6]" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.491 4.491 0 0 1-3.497-1.307 4.49 4.49 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>}
                          </div>
                          <p className="text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>{p.role} · {p.location}</p>
                        </div>
                        <button onClick={() => setFollows((f) => ({ ...f, [p.id]: !f[p.id] }))}
                          className={`text-[12px] px-3 py-1.5 rounded-lg border font-medium transition-colors ${follows[p.id] ? "bg-[#0D1421] text-white border-[#0D1421]" : "border-[#DDD9D2] text-[#4B5563] hover:border-[#0D1421] hover:text-[#0D1421]"}`}
                          style={{ fontFamily: "'Inter', sans-serif" }}>
                          {follows[p.id] ? "Following" : "Follow"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Startups */}
              {showStartups && filteredStartups.length > 0 && (
                <div>
                  {tab === "all" && <h3 className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Startups</h3>}
                  <div className="space-y-2">
                    {filteredStartups.slice(0, tab === "all" ? 3 : undefined).map((s) => (
                      <Link key={s.id} to={`/startups/${s.id}`} className="flex items-center gap-3 bg-white border border-[#DDD9D2] rounded-xl px-4 py-3 hover:border-[#2557D6] transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-[#F5F4F0] border border-[#DDD9D2] overflow-hidden shrink-0">
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] font-semibold text-[#0D1421] group-hover:text-[#2557D6] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.name}</p>
                          <p className="text-[12px] text-[#6B7280] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{s.pitch}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${catClass(s.category)}`}>{s.category}</span>
                          <span className="text-[11px] text-[#9CA3AF] bg-[#F5F4F0] px-2 py-0.5 rounded-full">{s.stage}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts */}
              {showPosts && filteredPosts.length > 0 && (
                <div>
                  {tab === "all" && <h3 className="text-[13px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Posts</h3>}
                  <div className="space-y-2">
                    {filteredPosts.slice(0, tab === "all" ? 3 : undefined).map((p) => (
                      <div key={p.id} className="bg-white border border-[#DDD9D2] rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <img src={p.author.avatar} alt={p.author.name} className="w-7 h-7 rounded-full object-cover" />
                          <p className="text-[13px] font-semibold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{p.author.name}</p>
                          <span className="text-[11px] text-[#9CA3AF]">· {p.timestamp}</span>
                        </div>
                        <p className="text-[13px] text-[#4B5563] line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>{p.content}</p>
                        <div className="flex gap-4 mt-2 text-[11.5px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <span>♥ {p.likes}</span>
                          <span>💬 {p.comments}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredPeople.length === 0 && filteredStartups.length === 0 && filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-[15px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>No results for "{query}"</p>
                  <p className="text-[13px] text-[#9CA3AF] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
