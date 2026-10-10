import { useState } from "react";
import { Link } from "react-router";
import { posts as allPosts, suggestions, trendingTopics, Post } from "../data/feed";
import { catClass } from "../utils/categoryColor";

const typeLabel: Record<string, { label: string; color: string }> = {
  investor_insight:    { label: "Investor Insight",    color: "bg-[#EEF2FF] text-[#4338CA]" },
  startup_update:      { label: "Startup Update",      color: "bg-[#ECFDF5] text-[#047857]" },
  investment_interest: { label: "Investment Interest", color: "bg-[#FFFBEB] text-[#D97706]" },
  founder_update:      { label: "Founder Update",      color: "bg-[#F0F9FF] text-[#0369A1]" },
  business_need:       { label: "Business Need",       color: "bg-[#FDF4FF] text-[#7E22CE]" },
  tech_insight:        { label: "Tech Insight",        color: "bg-[#FFF7ED] text-[#C2410C]" },
};

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked ?? false);
  const [saved, setSaved] = useState(post.saved ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const tl = typeLabel[post.type];

  return (
    <article className="bg-white border border-[#DDD9D2] rounded-2xl p-5 hover:shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <Link to={`/investors/${post.author.id}`}>
            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover bg-[#E8E6E1] border border-[#DDD9D2]" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5">
              <Link to={`/investors/${post.author.id}`} className="font-semibold text-[14px] text-[#0D1421] hover:text-[#2557D6] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {post.author.name}
              </Link>
              {post.author.verified && (
                <svg className="w-3.5 h-3.5 text-[#2557D6]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>{post.author.role}</p>
              <span className="text-[#DDD9D2]">·</span>
              <p className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>{post.timestamp}</p>
            </div>
          </div>
        </div>
        <span className={`shrink-0 text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] ${tl.color}`}>{tl.label}</span>
      </div>

      {/* Content */}
      <div className="mb-3">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i} className="text-[14px] text-[#1F2937] leading-[1.7] mb-2 last:mb-0" style={{ fontFamily: "'Inter', sans-serif" }}>{para}</p>
        ))}
      </div>

      {/* Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden bg-[#E8E6E1] mt-3 mb-3" style={{ aspectRatio: "16/9" }}>
          <img src={post.image} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Related startup */}
      {post.relatedStartup && (
        <Link to={`/startups/${post.relatedStartup.id}`} className="flex items-center gap-2.5 mt-3 mb-3 px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-xl hover:border-[#2557D6] transition-colors group">
          <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] ${catClass(post.relatedStartup.category)}`}>{post.relatedStartup.category}</span>
          <span className="text-[13px] font-semibold text-[#0D1421] group-hover:text-[#2557D6] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{post.relatedStartup.name}</span>
          <svg className="w-3.5 h-3.5 text-[#9CA3AF] ml-auto group-hover:text-[#2557D6] transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
        </Link>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((t) => (
            <span key={t} className="text-[11px] text-[#6B7280] hover:text-[#2557D6] cursor-pointer transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>#{t.replace(/\s/g, "")}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-[#F0EDE8]">
        <button
          onClick={() => { setLiked((v) => !v); setLikeCount((c) => liked ? c - 1 : c + 1); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-150 ${liked ? "text-[#DC2626] bg-[#FEF2F2]" : "text-[#6B7280] hover:bg-[#F5F4F0]"}`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
          {likeCount}
        </button>
        <button
          onClick={() => setCommentOpen((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-[#6B7280] hover:bg-[#F5F4F0] transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>
          {post.comments}
        </button>
        <button
          onClick={() => setSaved((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-150 ${saved ? "text-[#2557D6] bg-[#EEF2FF]" : "text-[#6B7280] hover:bg-[#F5F4F0]"}`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
          {post.saves}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-[#6B7280] hover:bg-[#F5F4F0] transition-colors ml-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
          Share
        </button>
      </div>

      {/* Comment box */}
      {commentOpen && (
        <div className="mt-3 pt-3 border-t border-[#F0EDE8] flex gap-2.5">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop" alt="You" className="w-8 h-8 rounded-full object-cover shrink-0" />
          <div className="flex-1 flex gap-2">
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..."
              className="flex-1 px-3.5 py-2 bg-[#F5F4F0] border border-[#DDD9D2] rounded-xl text-[13px] text-[#0D1421] placeholder-[#C5C0BB] focus:outline-none focus:ring-2 focus:ring-[#2557D6] focus:border-transparent"
              style={{ fontFamily: "'Inter', sans-serif" }} />
            <button onClick={() => { if (comment.trim()) setComment(""); }}
              className="px-3.5 py-2 bg-[#2557D6] text-white rounded-xl text-[12.5px] font-medium hover:bg-[#1E4AB8] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Post
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function FeedPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Investors", "Founders", "Startups", "Business", "Insights"];

  const filtered = filter === "All" ? allPosts : allPosts.filter((p) => {
    if (filter === "Investors") return p.type === "investor_insight" || p.type === "investment_interest";
    if (filter === "Founders") return p.type === "startup_update" || p.type === "founder_update";
    if (filter === "Startups") return p.relatedStartup != null;
    if (filter === "Business") return p.type === "business_need";
    if (filter === "Insights") return p.type === "tech_insight";
    return true;
  });

  return (
    <div className="bg-[#F5F4F0] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12 py-6 lg:py-10">
        <div className="grid lg:grid-cols-[220px_1fr_280px] gap-6">

          {/* Left sidebar */}
          <aside className="hidden lg:block space-y-2">
            <div className="bg-white border border-[#DDD9D2] rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop" alt="You" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-[14px] text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Jordan Tran</p>
                  <p className="text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>Founder · StackCoach</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F0EDE8] text-center">
                {[{ v: "142", l: "Following" }, { v: "890", l: "Followers" }, { v: "23", l: "Subscribed" }].map((s) => (
                  <div key={s.l}>
                    <p className="text-[13px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.v}</p>
                    <p className="text-[10.5px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {[
              { icon: "🏠", label: "Feed",           to: "/feed",      active: true },
              { icon: "💡", label: "Startup Ideas",  to: "/startups" },
              { icon: "👥", label: "Investors",      to: "/investors" },
              { icon: "📰", label: "Tech News",      to: "/news" },
              { icon: "✉️", label: "Messages",       to: "/messages" },
              { icon: "🧑", label: "Account",        to: "/account" },
              { icon: "🔍", label: "Search",         to: "/search" },
            ].map((item) => (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors ${item.active ? "bg-[#EEF2FF] text-[#2557D6]" : "text-[#5A6070] hover:bg-white hover:text-[#0D1421]"}`}
                style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </aside>

          {/* Center feed */}
          <main className="space-y-4 min-w-0">
            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all border ${filter === f ? "bg-[#0D1421] text-white border-[#0D1421]" : "bg-white text-[#5A6070] border-[#DDD9D2] hover:border-[#9CA3AF]"}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  {f}
                </button>
              ))}
            </div>

            {/* Post composer */}
            <div className="bg-white border border-[#DDD9D2] rounded-2xl p-4 flex gap-3">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop" alt="You" className="w-9 h-9 rounded-full object-cover shrink-0" />
              <button className="flex-1 text-left px-4 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-xl text-[13.5px] text-[#9CA3AF] hover:border-[#2557D6] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                Share an insight, update, or opportunity...
              </button>
            </div>

            {filtered.map((post) => <PostCard key={post.id} post={post} />)}
          </main>

          {/* Right sidebar */}
          <aside className="hidden lg:block space-y-5">
            {/* Search */}
            <Link to="/search" className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-[#DDD9D2] rounded-xl text-[13px] text-[#9CA3AF] hover:border-[#2557D6] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              Search FounderBridge...
            </Link>

            {/* Trending */}
            <div className="bg-white border border-[#DDD9D2] rounded-2xl p-4">
              <h3 className="text-[13px] font-bold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Trending Topics</h3>
              <div className="space-y-2.5">
                {trendingTopics.map((t) => (
                  <div key={t.tag} className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-[#2557D6] hover:underline cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>{t.tag}</span>
                    <span className="text-[11.5px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>{t.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white border border-[#DDD9D2] rounded-2xl p-4">
              <h3 className="text-[13px] font-bold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>People to Follow</h3>
              <div className="space-y-3">
                {suggestions.map((s) => (
                  <div key={s.id} className="flex items-center gap-2.5">
                    <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover bg-[#E8E6E1]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-[#0D1421] truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.name}</p>
                      <p className="text-[11px] text-[#9CA3AF] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{s.role}</p>
                    </div>
                    <button className="text-[11.5px] font-semibold text-[#2557D6] border border-[#C7D7F9] px-2.5 py-1 rounded-lg hover:bg-[#EEF2FF] transition-colors shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Startups to explore */}
            <div className="bg-white border border-[#DDD9D2] rounded-2xl p-4">
              <h3 className="text-[13px] font-bold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Startups You May Like</h3>
              {[
                { id: "3", name: "MedVault", cat: "HealthTech", rating: 4.2 },
                { id: "6", name: "LocalShelve", cat: "RetailTech", rating: 3.9 },
              ].map((s) => (
                <Link key={s.id} to={`/startups/${s.id}`} className="flex items-center gap-2.5 py-2.5 border-b border-[#F0EDE8] last:border-b-0 hover:opacity-80 transition-opacity">
                  <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] ${catClass(s.cat)}`}>{s.cat}</span>
                  <span className="text-[13px] font-semibold text-[#0D1421] flex-1 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.name}</span>
                  <span className="text-[11.5px] text-[#D97706] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>★ {s.rating}</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
