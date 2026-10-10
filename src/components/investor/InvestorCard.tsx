import { Link } from "react-router";
import { catClass } from "../../utils/categoryColor";

interface Investor {
  id: string; name: string; profileImage: string; bio: string;
  investorType: string; location: string; interests: string[];
  investmentStage: string[]; investmentRange: { min: string; max: string };
  totalInvestments: number; activePortfolio: number;
}

const typeColor: Record<string, string> = {
  "Angel Investor": "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
  "VC Partner":     "bg-[#EEF2FF] text-[#4338CA] border-[#C7D7F9]",
};

export default function InvestorCard({ investor }: { investor: Investor }) {
  const tc = typeColor[investor.investorType] ?? "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]";
  return (
    <Link to={`/investors/${investor.id}`} className="group card-hover block bg-white border border-[#DDD9D2] rounded-2xl p-5">
      <div className="flex items-start gap-3.5 mb-4">
        <img src={investor.profileImage} alt={investor.name} className="w-12 h-12 rounded-full object-cover bg-[#E8E6E1] border-2 border-[#F0EDE8] shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[14.5px] text-[#0D1421] truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{investor.name}</h3>
          <span className={`inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] border mt-1 ${tc}`}>{investor.investorType}</span>
        </div>
      </div>

      <p className="text-[12.5px] text-[#5A6070] leading-relaxed mb-4 line-clamp-3" style={{ fontFamily: "'Inter', sans-serif" }}>{investor.bio}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {investor.interests.slice(0,3).map((interest) => (
          <span key={interest} className={`text-[10.5px] font-medium px-2 py-0.5 rounded-[4px] ${catClass(interest)}`}>{interest}</span>
        ))}
        {investor.interests.length > 3 && (
          <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#6B7280]">+{investor.interests.length - 3}</span>
        )}
      </div>

      <div className="pt-3.5 border-t border-[#F0EDE8] grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-[15px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{investor.totalInvestments}</p>
          <p className="text-[10.5px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>Investments</p>
        </div>
        <div className="text-center">
          <p className="text-[15px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{investor.activePortfolio}</p>
          <p className="text-[10.5px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>Portfolio</p>
        </div>
        <div className="text-center">
          <p className="text-[12.5px] font-bold text-[#2557D6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{investor.investmentRange.min}–</p>
          <p className="text-[10.5px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>{investor.investmentRange.max}</p>
        </div>
      </div>
    </Link>
  );
}
