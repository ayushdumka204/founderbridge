import { useState } from "react";
import { useParams, Link } from "react-router";
import { startups } from "../data";
import StartupCard from "../components/startup/StartupCard";
import { catClass } from "../utils/categoryColor";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1,2,3,4,5].map((i) => (
        <button key={i} type="button" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => onChange(i)} className="transition-transform hover:scale-110 active:scale-95">
          <svg className={`w-7 h-7 transition-colors duration-100 ${i <= (hover || value) ? "text-[#D97706]" : "text-[#E8E6E1]"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

const quickTags = ["Strong Problem", "Interesting Market", "Good Business Model", "Strong Team", "Needs More Validation"];

export default function StartupDetail() {
  const { id } = useParams<{ id: string }>();
  const startup = startups.find((s) => s.id === id);
  const [saved, setSaved] = useState(false);
  const [interested, setInterested] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!startup) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[80px] font-bold text-[#E8E6E1] leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>404</p>
          <h2 className="text-[22px] font-bold text-[#0D1421] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Startup not found</h2>
          <Link to="/startups" className="text-[13.5px] text-[#2557D6]" style={{ fontFamily: "'Inter', sans-serif" }}>← Browse all ideas</Link>
        </div>
      </div>
    );
  }

  const related = startups.filter((s) => s.id !== startup.id && s.category === startup.category).slice(0, 2);

  const toggleTag = (t: string) => setSelectedTags((ts) => ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]);

  return (
    <div className="bg-[#F5F4F0] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 lg:py-14">
        <div className="mb-6">
          <Link to="/startups" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0D1421] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            All Startup Ideas
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#E8E6E1]" style={{ aspectRatio: "16/7" }}>
              <img src={startup.image} alt={startup.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-[5px] ${catClass(startup.category)}`}>{startup.category}</span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-[5px] bg-black/40 text-white backdrop-blur-sm">{startup.stage}</span>
              </div>
            </div>

            {/* Header */}
            <div className="bg-white rounded-2xl border border-[#DDD9D2] p-6">
              <div className="flex items-start gap-4 mb-5">
                {startup.logo && (
                  <img src={startup.logo} alt={startup.name} className="w-12 h-12 rounded-xl object-cover bg-[#E8E6E1] border border-[#DDD9D2] shrink-0" />
                )}
                <div className="flex-1">
                  <h1 className="text-[26px] lg:text-[32px] font-bold text-[#0D1421] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{startup.name}</h1>
                  <p className="text-[14px] text-[#5A6070] mt-1 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{startup.pitch}</p>
                </div>
              </div>

              {/* Investment summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F5F4F0] rounded-xl">
                {[
                  { label: "Idea Score", value: `${startup.rating}/5`, color: "text-[#D97706]" },
                  { label: "Investors Interested", value: String(startup.investorInterest), color: "text-[#2557D6]" },
                  { label: "Funding Required", value: startup.fundingRequired, color: "text-[#7C3AED]" },
                  { label: "Stage", value: startup.stage, color: "text-[#16A34A]" },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <p className={`text-[16px] font-bold ${m.color}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{m.value}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="bg-white rounded-2xl border border-[#DDD9D2] p-6 space-y-7">
              {[
                { heading: "The Problem",       content: startup.problem },
                { heading: "Our Solution",       content: startup.solution },
                { heading: "Target Audience",    content: startup.targetAudience },
                { heading: "Business Model",     content: startup.businessModel },
                { heading: "Market Opportunity", content: startup.marketOpportunity },
                { heading: "Competition",        content: startup.competitors },
                { heading: "Traction",           content: startup.traction },
              ].map((s, i) => (
                <div key={s.heading} className={i > 0 ? "pt-6 border-t border-[#F0EDE8]" : ""}>
                  <p className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#2557D6] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>{s.heading}</p>
                  <p className="text-[14.5px] text-[#374151] leading-[1.75]" style={{ fontFamily: "'Inter', sans-serif" }}>{s.content}</p>
                </div>
              ))}
            </div>

            {(startup.website || startup.demoLink) && (
              <div className="flex flex-wrap gap-3">
                {startup.website && (
                  <a href={startup.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[#DDD9D2] bg-white px-4 py-2.5 rounded-[7px] text-[13px] font-medium text-[#0D1421] hover:border-[#0D1421] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Visit Website ↗
                  </a>
                )}
                {startup.demoLink && (
                  <a href={startup.demoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#2557D6] text-white px-4 py-2.5 rounded-[7px] text-[13px] font-medium hover:bg-[#1E4AB8] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    View Demo ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Founder + Actions */}
            <div className="bg-white border border-[#DDD9D2] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#F0EDE8]">
                {startup.founderAvatar && (
                  <img src={startup.founderAvatar} alt={startup.founder} className="w-10 h-10 rounded-full object-cover bg-[#E8E6E1]" />
                )}
                <div>
                  <p className="font-semibold text-[14px] text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{startup.founder}</p>
                  <p className="text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>Founder</p>
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                <button onClick={() => setSaved((v) => !v)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] text-[13px] font-medium border transition-all duration-150 ${saved ? "bg-[#EEF2FF] border-[#2557D6] text-[#2557D6]" : "border-[#DDD9D2] text-[#374151] hover:border-[#9CA3AF]"}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
                  {saved ? "Saved" : "Save"}
                </button>
                <button onClick={() => setInterested((v) => !v)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[7px] text-[13px] font-medium border transition-all duration-150 ${interested ? "bg-[#DCFCE7] border-[#16A34A] text-[#16A34A]" : "border-[#DDD9D2] text-[#374151] hover:border-[#9CA3AF]"}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  <svg className="w-4 h-4" fill={interested ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                  Interested
                </button>
              </div>

              <a href="mailto:founder@example.com"
                className="flex items-center justify-center w-full bg-[#0D1421] text-white py-2.5 rounded-[7px] text-[13px] font-medium hover:bg-[#1A2535] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Contact Founder
              </a>
            </div>

            {/* Score card */}
            <div className="bg-[#0D1421] rounded-2xl p-5">
              <p className="text-[10px] uppercase tracking-widest text-[#4B5563] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Platform Idea Score</p>
              <div className="flex items-end gap-3 mb-3">
                <p className="text-[44px] font-bold text-white leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>{startup.rating}</p>
                <p className="text-[16px] text-[#4B5563] mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>/5</p>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className={`w-4 h-4 ${i <= Math.round(startup.rating) ? "text-[#D97706]" : "text-[#1A2535]"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="text-[#2557D6] font-semibold">{startup.investorInterest}</span> investor ratings
              </p>
            </div>

            {/* Rate */}
            <div className="bg-white border border-[#DDD9D2] rounded-2xl p-5">
              <h3 className="text-[14px] font-bold text-[#0D1421] mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Rate This Idea</h3>
              <p className="text-[12.5px] text-[#6B7280] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>How would you rate this startup idea?</p>

              {!feedbackSubmitted ? (
                <div className="space-y-4">
                  <StarPicker value={rating} onChange={setRating} />

                  {/* Quick tags */}
                  <div>
                    <p className="text-[11.5px] text-[#9CA3AF] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Quick feedback (optional)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickTags.map((t) => (
                        <button key={t} type="button" onClick={() => toggleTag(t)}
                          className={`text-[11.5px] font-medium px-2.5 py-1 rounded-full border transition-all duration-150 ${selectedTags.includes(t) ? "bg-[#EEF2FF] border-[#2557D6] text-[#2557D6]" : "bg-[#F5F4F0] border-[#DDD9D2] text-[#6B7280] hover:border-[#9CA3AF]"}`}
                          style={{ fontFamily: "'Inter', sans-serif" }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
                    placeholder="What do you think about this idea?"
                    rows={3}
                    className="w-full px-3.5 py-3 border border-[#DDD9D2] rounded-[7px] text-[13px] placeholder-[#C5C0BB] resize-none focus:outline-none focus:ring-2 focus:ring-[#2557D6] focus:border-transparent bg-[#F5F4F0]"
                    style={{ fontFamily: "'Inter', sans-serif" }} />

                  <button onClick={() => { if (rating > 0) setFeedbackSubmitted(true); }}
                    disabled={rating === 0}
                    className="w-full py-2.5 bg-[#2557D6] text-white rounded-[7px] text-[13px] font-medium hover:bg-[#1E4AB8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    Submit Feedback
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <p className="text-[13.5px] font-semibold text-[#16A34A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Feedback submitted!</p>
                  <p className="text-[12px] text-[#9CA3AF] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Thank you for helping the founder improve.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-[20px] font-bold text-[#0D1421] mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>More in {startup.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {related.map((s) => <StartupCard key={s.id} startup={s} featured />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
