import { Link } from "react-router";

interface NewsItem {
  id: string; slug: string; title: string; summary: string;
  image: string; category: string; source: string;
  publishedAt: string; readingTime: string;
}

const catColor: Record<string, string> = {
  "AI":                  "bg-[#EEF2FF] text-[#4338CA]",
  "Startups":            "bg-[#FFFBEB] text-[#D97706]",
  "SaaS":                "bg-[#F0F9FF] text-[#0369A1]",
  "Funding":             "bg-[#ECFDF5] text-[#047857]",
  "Cybersecurity":       "bg-[#FEF2F2] text-[#DC2626]",
  "Web Development":     "bg-[#FDF4FF] text-[#7E22CE]",
  "Gadgets":             "bg-[#FFF7ED] text-[#C2410C]",
  "Business Technology": "bg-[#F3F4F6] text-[#374151]",
};
function catCls(c: string) { return catColor[c] ?? "bg-[#F3F4F6] text-[#374151]"; }

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function FeaturedNewsCard({ article }: { article: NewsItem }) {
  return (
    <Link to={`/news/${article.slug}`} className="group card-hover block bg-white border border-[#DDD9D2] rounded-2xl overflow-hidden h-full">
      <div className="relative overflow-hidden bg-[#E8E6E1]" style={{ aspectRatio: "16/9" }}>
        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] ${catCls(article.category)}`}>{article.category}</span>
        </div>
      </div>
      <div className="p-5">
        <h2 className="font-bold text-[17px] leading-snug text-[#0D1421] mb-2.5 group-hover:text-[#2557D6] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{article.title}</h2>
        <p className="text-[13px] text-[#5A6070] leading-relaxed mb-4 line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>{article.summary}</p>
        <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="font-medium text-[#6B7280]">{article.source}</span>
          <span>·</span><span>{fmtDate(article.publishedAt)}</span>
          <span>·</span><span>{article.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}

export function MediumNewsCard({ article }: { article: NewsItem }) {
  return (
    <Link to={`/news/${article.slug}`} className="group card-hover flex flex-col bg-white border border-[#DDD9D2] rounded-2xl overflow-hidden">
      <div className="relative overflow-hidden bg-[#E8E6E1]" style={{ aspectRatio: "16/10" }}>
        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className={`inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] mb-2 w-fit ${catCls(article.category)}`}>{article.category}</span>
        <h3 className="font-bold text-[14px] leading-snug text-[#0D1421] mb-2 group-hover:text-[#2557D6] transition-colors line-clamp-2 flex-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{article.title}</h3>
        <div className="flex items-center gap-2 text-[11.5px] text-[#9CA3AF] mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="font-medium text-[#6B7280]">{article.source}</span>
          <span>·</span><span>{fmtDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function NewsCard({ article }: { article: NewsItem }) {
  return (
    <Link to={`/news/${article.slug}`} className="group flex gap-3.5 py-3.5 border-b border-[#F0EDE8] last:border-b-0">
      <div className="w-16 h-14 rounded-lg overflow-hidden bg-[#E8E6E1] shrink-0">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px] mb-1 ${catCls(article.category)}`}>{article.category}</span>
        <h4 className="font-semibold text-[13px] text-[#0D1421] leading-snug line-clamp-2 group-hover:text-[#2557D6] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{article.title}</h4>
        <p className="text-[11.5px] text-[#9CA3AF] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{article.source} · {fmtDate(article.publishedAt)}</p>
      </div>
    </Link>
  );
}
