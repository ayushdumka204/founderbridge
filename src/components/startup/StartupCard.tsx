import { Link } from "react-router";
import { catClass } from "../../utils/categoryColor";

interface Startup {
  id: string; name: string; pitch: string; founder: string;
  founderAvatar?: string; category: string; stage: string;
  fundingRequired: string; rating: number; investorInterest: number;
  image: string; logo?: string;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? "text-[#D97706]" : "text-[#DDD9D2]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-[11px] font-medium text-[#6B7280] ml-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{rating}</span>
    </div>
  );
}

/* ── FEATURED (large) card ── */
export default function StartupCard({ startup, featured = false }: { startup: Startup; featured?: boolean }) {
  if (featured) {
    return (
      <Link to={`/startups/${startup.id}`} className="group card-hover block bg-white border border-[#DDD9D2] rounded-2xl overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden bg-[#E8E6E1]" style={{ aspectRatio: "16/9" }}>
          <img src={startup.image} alt={startup.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={`inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] ${catClass(startup.category)}`}>{startup.category}</span>
            <span className="inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] bg-black/40 text-white backdrop-blur-sm">{startup.stage}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            {startup.logo && (
              <img src={startup.logo} alt={startup.name} className="w-9 h-9 rounded-lg object-cover bg-[#E8E6E1] shrink-0 border border-[#DDD9D2]" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[15.5px] text-[#0D1421] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{startup.name}</h3>
              <p className="text-[12px] text-[#6B7280] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>by {startup.founder}</p>
            </div>
          </div>

          <p className="text-[13px] text-[#374151] leading-relaxed mb-4 line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>{startup.pitch}</p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 py-3.5 border-t border-b border-[#F0EDE8] mb-4">
            <div>
              <Stars rating={startup.rating} />
              <p className="text-[10.5px] text-[#9CA3AF] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>Score</p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#2557D6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{startup.investorInterest}</p>
              <p className="text-[10.5px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>Interested</p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{startup.fundingRequired}</p>
              <p className="text-[10.5px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>Seeking</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2557D6] group-hover:gap-2.5 transition-all" style={{ fontFamily: "'Inter', sans-serif" }}>
            View Idea
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
          </span>
        </div>
      </Link>
    );
  }

  /* ── COMPACT card ── */
  return (
    <Link to={`/startups/${startup.id}`} className="group card-hover flex gap-4 p-4 bg-white border border-[#DDD9D2] rounded-xl">
      <div className="relative w-[68px] h-[58px] rounded-lg overflow-hidden bg-[#E8E6E1] shrink-0">
        <img src={startup.image} alt={startup.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-[14px] text-[#0D1421] truncate leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{startup.name}</h3>
          <span className={`shrink-0 text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] ${catClass(startup.category)}`}>{startup.category}</span>
        </div>
        <p className="text-[12px] text-[#5A6070] line-clamp-2 mb-2 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{startup.pitch}</p>
        <div className="flex items-center gap-3">
          <Stars rating={startup.rating} />
          <span className="text-[11.5px] font-semibold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{startup.fundingRequired}</span>
          <span className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>{startup.investorInterest} interested</span>
        </div>
      </div>
    </Link>
  );
}
