import { useState, useEffect } from "react";
import { FeaturedNewsCard, MediumNewsCard } from "../components/news/NewsCard";
import Badge from "../components/ui/Badge";
import { Link } from "react-router";
import { getPublishedNews } from "../services/newsService";

const categories = ["Latest", "AI", "Startups", "SaaS", "Funding", "Cybersecurity", "Web Development", "Gadgets", "Business Technology"];

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

export default function News() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Latest");
  const [allNews, setAllNews] = useState<ReturnType<typeof adaptNews>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedNews({ limit: 100 })
      .then((data) => setAllNews((data as Record<string, unknown>[]).map(adaptNews)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = allNews.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Latest" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D1421] py-14 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="accent">Tech News</Badge>
              <h1 className="text-[34px] lg:text-[48px] font-bold text-white mt-4 mb-4 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Tech, Startups &amp; Innovation — Every Day.
              </h1>
              <p className="text-[15px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Curated technology news for student founders, investors, and builders. Updated daily.
              </p>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-[#1A2535]" style={{ aspectRatio: "16/9" }}>
              <img
                src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&h=450&fit=crop&auto=format"
                alt="Tech team"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories + Search */}
      <section className="bg-[#F5F4F0]/95 backdrop-blur-sm border-b border-[#DDD9D2] sticky top-16 z-30">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 py-3 overflow-x-auto scrollbar-hide">
            <div className="relative shrink-0">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-[#E5E5E2] rounded-[5px] text-[12.5px] text-[#0D1421] placeholder-[#C5C5C0] focus:outline-none focus:ring-1 focus:ring-[#2557D6] focus:border-transparent w-44"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all ${activeCategory === c ? "bg-[#0D1421] text-white" : "text-[#6B7280] hover:text-[#0D1421] hover:bg-[#F0F0EE]"}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-10 bg-[#F5F4F0]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#2557D6] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[15px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {allNews.length === 0 ? "No published articles yet." : "No articles found."}
              </p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div className="mb-8">
                  <FeaturedNewsCard article={featured} />
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((a) => <MediumNewsCard key={a.id} article={a} />)}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
