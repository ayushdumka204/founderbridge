import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { MediumNewsCard } from "../components/news/NewsCard";
import Badge from "../components/ui/Badge";
import { getNewsBySlug, getPublishedNews } from "../services/newsService";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

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
    content: (item.content as string) ?? "",
  };
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ReturnType<typeof adaptNews> | null>(null);
  const [related, setRelated] = useState<ReturnType<typeof adaptNews>[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    getNewsBySlug(slug)
      .then((data) => {
        setArticle(adaptNews(data as Record<string, unknown>));
        return getPublishedNews({ limit: 4 });
      })
      .then((all) => {
        const others = (all as Record<string, unknown>[])
          .filter((a) => a.slug !== slug)
          .slice(0, 3)
          .map(adaptNews);
        setRelated(others);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#2557D6] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound || !article) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-[22px] font-bold text-[#0D1421] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Article not found</h2>
        <Link to="/news" className="text-[13.5px] text-[#2557D6]" style={{ fontFamily: "'Inter', sans-serif" }}>← All Tech News</Link>
      </div>
    </div>
  );

  return (
    <div className="py-8 lg:py-14">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <Link to="/news" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0D1421] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            All Tech News
          </Link>
        </div>

        <div className="mb-8">
          <div className="mb-4">
            <Badge variant="accent">{article.category}</Badge>
          </div>
          <h1 className="text-[28px] lg:text-[38px] font-bold text-[#0D1421] mb-5 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{article.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#6B7280] mb-7" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="font-medium text-[#0D1421]">{article.source}</span>
            <span>·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>·</span>
            <span>{article.readingTime}</span>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-[#E5E5E2] mb-8" style={{ aspectRatio: "16/8" }}>
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <p className="text-[16px] text-[#374151] leading-relaxed font-medium border-l-2 border-[#2557D6] pl-5 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            {article.summary}
          </p>

          <div className="prose max-w-none">
            {article.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-[15px] text-[#374151] leading-[1.8] mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 mt-16 pt-12 border-t border-[#E5E5E2]">
          <h2 className="text-[20px] font-bold text-[#0D1421] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>Related Stories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((a) => <MediumNewsCard key={a.id} article={a} />)}
          </div>
        </div>
      )}
    </div>
  );
}
