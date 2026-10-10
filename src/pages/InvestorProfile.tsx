import { useState } from "react";
import { useParams, Link } from "react-router";
import { investors, startups } from "../data";
import StartupCard from "../components/startup/StartupCard";
import { catClass } from "../utils/categoryColor";
import { posts } from "../data/feed";

type ProfileTab = "posts" | "about" | "investments" | "activity";

export default function InvestorProfile() {
  const { id } = useParams<{ id: string }>();
  const investor = investors.find((i) => i.id === id);
  const [followed, setFollowed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [profileTab, setProfileTab] = useState<ProfileTab>("posts");
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  const investorPosts = posts.filter((p) => p.author.verified).slice(0, 3);

  if (!investor) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[22px] font-bold text-[#0D1421] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Investor not found</h2>
          <Link to="/investors" className="text-[13.5px] text-[#2557D6]" style={{ fontFamily: "'Inter', sans-serif" }}>← Browse investors</Link>
        </div>
      </div>
    );
  }

  const portfolioStartups = startups.filter((s) => investor.portfolio?.some((p) => p.name === s.name));

  return (
    <div className="py-8 lg:py-14 bg-[#F5F4F0] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <Link to="/investors" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0D1421] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            All Investors
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white border border-[#DDD9D2] rounded-xl p-6">
              <img
                src={investor.profileImage}
                alt={investor.name}
                className="w-20 h-20 rounded-full object-cover bg-[#F0F0EE] mb-4"
              />
              <h1 className="text-[22px] font-bold text-[#0D1421] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{investor.name}</h1>
              <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-[5px] bg-[#EEF2FF] text-[#2557D6]">{investor.investorType}</span>
              <p className="text-[13px] text-[#6B7280] mt-2 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                📍 {investor.location}
              </p>
              <p className="text-[13.5px] text-[#374151] leading-relaxed mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>{investor.bio}</p>

              <div className="space-y-2">
                {investor.website && (
                  <a href={investor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-[#2557D6] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>
                    🌐 {investor.website.replace("https://", "")}
                  </a>
                )}
                {investor.socialLinks.linkedin && (
                  <a href={investor.socialLinks.linkedin} className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#0D1421]" style={{ fontFamily: "'Inter', sans-serif" }}>LinkedIn</a>
                )}
                {investor.socialLinks.twitter && (
                  <a href={investor.socialLinks.twitter} className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#0D1421]" style={{ fontFamily: "'Inter', sans-serif" }}>X / Twitter</a>
                )}
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFollowed((f) => !f)}
                    className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-colors border ${followed ? "bg-[#0D1421] text-white border-[#0D1421]" : "border-[#DDD9D2] text-[#0D1421] hover:border-[#0D1421]"}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {followed ? "Following" : "Follow"}
                  </button>
                  <Link
                    to="/messages"
                    className="flex-1 flex items-center justify-center py-2.5 rounded-lg text-[13px] font-medium border border-[#DDD9D2] text-[#0D1421] hover:border-[#2557D6] hover:text-[#2557D6] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Message
                  </Link>
                </div>
                <button
                  onClick={() => setSubscribed((s) => !s)}
                  className={`w-full py-2.5 rounded-lg text-[13px] font-medium transition-colors ${subscribed ? "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]" : "bg-[#2557D6] text-white hover:bg-[#1E4AB8]"}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {subscribed ? "Subscribed ✓" : "Subscribe to Updates"}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white border border-[#DDD9D2] rounded-xl p-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: investor.totalInvestments, label: "Total Investments" },
                  { val: investor.activePortfolio, label: "Active Portfolio" },
                  { val: investor.investmentRange.min, label: "Min Check" },
                  { val: investor.investmentRange.max, label: "Max Check" },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 bg-[#EEECEA] rounded-lg">
                    <p className="text-[18px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.val}</p>
                    <p className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content with tabs */}
          <div className="lg:col-span-2">
            {/* Tab bar */}
            <div className="flex gap-1 mb-5 border-b border-[#DDD9D2] pb-0">
              {(["posts", "about", "investments", "activity"] as ProfileTab[]).map((t) => (
                <button key={t} onClick={() => setProfileTab(t)}
                  className={`px-4 py-2.5 text-[13px] font-medium capitalize border-b-2 -mb-px transition-colors ${profileTab === t ? "border-[#2557D6] text-[#2557D6]" : "border-transparent text-[#6B7280] hover:text-[#0D1421]"}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t === "investments" ? "Investments" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Posts tab */}
            {profileTab === "posts" && (
              <div className="space-y-4">
                {investorPosts.map((p) => (
                  <div key={p.id} className="bg-white border border-[#DDD9D2] rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={investor.profileImage} alt={investor.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-[13.5px] font-semibold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{investor.name}</p>
                          <svg className="w-3.5 h-3.5 text-[#2557D6]" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.491 4.491 0 0 1-3.497-1.307 4.49 4.49 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>{investor.investorType} · {p.timestamp}</p>
                      </div>
                    </div>
                    <p className="text-[13.5px] text-[#374151] leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Inter', sans-serif" }}>{p.content}</p>
                    {p.relatedStartup && (
                      <Link to={`/startups/${p.relatedStartup.id}`} className="inline-flex items-center gap-1.5 mt-3 text-[12px] text-[#2557D6] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Related: {p.relatedStartup.name} →
                      </Link>
                    )}
                    <div className="flex gap-5 mt-4 pt-3 border-t border-[#F0EDE8] text-[12px] text-[#9CA3AF]">
                      <button onClick={() => setLikes((l) => ({ ...l, [p.id]: !l[p.id] }))}
                        className={`flex items-center gap-1.5 hover:text-[#E11D48] transition-colors ${likes[p.id] ? "text-[#E11D48]" : ""}`}
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                        <svg className="w-3.5 h-3.5" fill={likes[p.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                        {p.likes + (likes[p.id] ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" /></svg>
                        {p.comments}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* About tab */}
            {profileTab === "about" && (
              <div className="space-y-5">
                <div className="bg-white border border-[#DDD9D2] rounded-xl p-5">
                  <h3 className="text-[14px] font-semibold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Investment Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {investor.interests.map((i) => (
                      <span key={i} className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-[5px] ${catClass(i)}`}>{i}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-[#DDD9D2] rounded-xl p-5">
                  <h3 className="text-[14px] font-semibold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Preferred Stages</h3>
                  <div className="flex flex-wrap gap-2">
                    {investor.investmentStage.map((s) => (
                      <span key={s} className="text-[11.5px] font-semibold px-2.5 py-1 rounded-[5px] bg-[#ECFDF5] text-[#047857]">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-[#DDD9D2] rounded-xl p-5">
                  <h3 className="text-[14px] font-semibold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Investment Range</h3>
                  <div className="bg-[#EEECEA] rounded-lg p-4">
                    <div className="relative h-2 bg-[#E5E5E2] rounded-full mb-3">
                      <div className="absolute inset-y-0 left-[15%] right-[10%] bg-[#2557D6] rounded-full" />
                      <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-[#2557D6] rounded-full shadow-sm" />
                      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-[#2557D6] rounded-full shadow-sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{investor.investmentRange.min}</span>
                      <span className="text-[15px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{investor.investmentRange.max}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Investments tab */}
            {profileTab === "investments" && (
              <div>
                {portfolioStartups.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {portfolioStartups.map((s) => <StartupCard key={s.id} startup={s} />)}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#9CA3AF] text-[13.5px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    No portfolio startups available.
                  </div>
                )}
              </div>
            )}

            {/* Activity tab */}
            {profileTab === "activity" && (
              <div className="bg-white border border-[#DDD9D2] rounded-xl divide-y divide-[#F0F0EE]">
                {investor.recentActivity?.map((act, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4">
                    <p className="text-[13.5px] font-medium text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {act.action} <span className="text-[#2557D6]">{act.startup}</span>
                      {"rating" in act && ` — ${act.rating}/5`}
                    </p>
                    <p className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>{act.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
