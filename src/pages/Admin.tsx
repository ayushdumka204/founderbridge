import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { signIn, signOut } from "../services/authService";
import {
  getAdminStats,
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  publishNews,
  unpublishNews,
  uploadNewsImage,
  getAllUsers,
  getAllStartups,
} from "../services/adminService";

type AdminTab = "dashboard" | "news" | "users" | "startups";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

interface StatsData {
  total_students: number;
  total_investors: number;
  total_business_owners: number;
  total_users: number;
  public_startups: number;
  published_news: number;
  draft_news: number;
  total_posts: number;
}

const CATEGORIES = ["General", "EdTech", "HealthTech", "FinTech", "CleanTech", "DevTools", "Logistics", "SaaS", "AI/ML", "Platform News", "Ecosystem"];

export default function Admin() {
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats, setStats] = useState<StatsData | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [startups, setStartups] = useState<Record<string, unknown>[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // News form
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({ title: "", summary: "", content: "", category: "General", source_name: "", source_url: "", status: "draft" });
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formMsg, setFormMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin, tab]);

  async function loadData() {
    setDataLoading(true);
    try {
      if (tab === "dashboard") setStats(await getAdminStats());
      if (tab === "news")      setNewsList(await getAllNews(100));
      if (tab === "users")     setUsers(await getAllUsers(100));
      if (tab === "startups")  setStartups(await getAllStartups(100));
    } catch (e) {
      console.error(e);
    } finally {
      setDataLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
    } catch (err: unknown) {
      setLoginError((err as Error).message ?? "Login failed");
    } finally {
      setLoginLoading(false);
    }
  }

  function startCreateNews() {
    setEditingId(null);
    setNewsForm({ title: "", summary: "", content: "", category: "General", source_name: "", source_url: "", status: "draft" });
    setNewsImageFile(null);
    setFormMsg("");
    setShowNewsForm(true);
  }

  function startEditNews(item: NewsItem) {
    setEditingId(item.id);
    setNewsForm({ title: item.title, summary: "", content: "", category: item.category, source_name: "", source_url: "", status: item.status });
    setFormMsg("");
    setShowNewsForm(true);
  }

  async function handleSaveNews(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !newsForm.title.trim()) return;
    setFormLoading(true);
    setFormMsg("");
    try {
      let imageUrl: string | undefined;
      if (newsImageFile) {
        const id = editingId ?? `temp-${Date.now()}`;
        imageUrl = await uploadNewsImage(profile.id, id, newsImageFile);
      }
      if (editingId) {
        await updateNews(editingId, { ...newsForm, ...(imageUrl ? { cover_image_url: imageUrl } : {}) });
        setFormMsg("Article updated.");
      } else {
        await createNews({ ...newsForm, created_by: profile.id });
        if (imageUrl) {
          const updated = await getAllNews(1);
          if (updated[0]) await updateNews(updated[0].id, { cover_image_url: imageUrl });
        }
        setFormMsg("Article created.");
      }
      setShowNewsForm(false);
      setNewsList(await getAllNews(100));
    } catch (err: unknown) {
      setFormMsg((err as Error).message ?? "Save failed.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handlePublish(id: string) {
    await publishNews(id);
    setNewsList(await getAllNews(100));
  }

  async function handleUnpublish(id: string) {
    await unpublishNews(id);
    setNewsList(await getAllNews(100));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    await deleteNews(id);
    setNewsList(await getAllNews(100));
  }

  const statusBadge = (s: string) => {
    if (s === "published") return "bg-[#ECFDF5] text-[#047857]";
    if (s === "draft")     return "bg-[#FEF9C3] text-[#854D0E]";
    return "bg-[#F3F4F6] text-[#6B7280]";
  };

  // Not authenticated
  if (loading) return (
    <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#2557D6] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || !isAdmin) return (
    <div className="min-h-screen bg-[#0D1421] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="w-10 h-10 bg-[#0D1421] rounded-[8px] flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-sm font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>S</span>
          </div>
          <h1 className="text-[20px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FounderBridge Admin</h1>
          <p className="text-[13px] text-[#6B7280] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Admin access only</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {["Email", "Password"].map((label) => (
            <div key={label}>
              <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
              <input
                type={label === "Password" ? "password" : "email"}
                value={label === "Email" ? loginEmail : loginPassword}
                onChange={(e) => label === "Email" ? setLoginEmail(e.target.value) : setLoginPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#2557D6]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          ))}
          {loginError && <p className="text-[12.5px] text-[#DC2626]" style={{ fontFamily: "'Inter', sans-serif" }}>{loginError}</p>}
          <button type="submit" disabled={loginLoading}
            className="w-full py-2.5 bg-[#0D1421] text-white text-[13.5px] font-medium rounded-lg hover:bg-[#1A2535] transition-colors disabled:opacity-50"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {loginLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "news", label: "News" },
    { id: "users", label: "Users" },
    { id: "startups", label: "Startups" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      {/* Admin navbar */}
      <header className="bg-[#0D1421] border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/10 rounded-[4px] flex items-center justify-center">
              <span className="text-white text-[11px] font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>S</span>
            </div>
            <span className="text-white text-[14px] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>FounderBridge Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>{profile.full_name}</span>
            <button onClick={() => signOut()} className="text-[12px] text-[#9CA3AF] hover:text-white transition-colors px-2 py-1 rounded" style={{ fontFamily: "'Inter', sans-serif" }}>Log out</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {/* Tab bar */}
        <div className="flex gap-1 mb-6 bg-white border border-[#DDD9D2] rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${tab === t.id ? "bg-[#0D1421] text-white" : "text-[#6B7280] hover:text-[#0D1421]"}`}
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {t.label}
            </button>
          ))}
        </div>

        {dataLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#2557D6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Dashboard */}
        {tab === "dashboard" && !dataLoading && stats && (
          <div>
            <h2 className="text-[18px] font-bold text-[#0D1421] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Users", value: stats.total_users, color: "#2557D6" },
                { label: "Students", value: stats.total_students, color: "#7C3AED" },
                { label: "Investors", value: stats.total_investors, color: "#D97706" },
                { label: "Business Owners", value: stats.total_business_owners, color: "#059669" },
                { label: "Published News", value: stats.published_news, color: "#0D9488" },
                { label: "Draft News", value: stats.draft_news, color: "#6B7280" },
                { label: "Public Startups", value: stats.public_startups, color: "#DC2626" },
                { label: "Total Posts", value: stats.total_posts, color: "#0EA5E9" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-[#DDD9D2] rounded-xl p-5">
                  <p className="text-[28px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif", color: s.color }}>{s.value ?? 0}</p>
                  <p className="text-[12.5px] text-[#6B7280] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News */}
        {tab === "news" && !dataLoading && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>News Articles</h2>
              <button onClick={startCreateNews}
                className="flex items-center gap-2 px-4 py-2 bg-[#2557D6] text-white text-[13px] font-medium rounded-lg hover:bg-[#1E4AB8] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                + Create Article
              </button>
            </div>

            {/* News form */}
            {showNewsForm && (
              <div className="bg-white border border-[#DDD9D2] rounded-2xl p-6 mb-5">
                <h3 className="text-[15px] font-semibold text-[#0D1421] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {editingId ? "Edit Article" : "Create Article"}
                </h3>
                <form onSubmit={handleSaveNews} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { key: "title", label: "Title *", placeholder: "Article title" },
                      { key: "source_name", label: "Source Name", placeholder: "e.g. TechCrunch" },
                      { key: "source_url", label: "Source URL", placeholder: "https://..." },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className={key === "title" ? "md:col-span-2" : ""}>
                        <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
                        <input value={newsForm[key as keyof typeof newsForm]} onChange={(e) => setNewsForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                          className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#2557D6]"
                          style={{ fontFamily: "'Inter', sans-serif" }} />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Summary</label>
                    <textarea value={newsForm.summary} onChange={(e) => setNewsForm((f) => ({ ...f, summary: e.target.value }))} rows={2}
                      className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#2557D6] resize-none"
                      style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Article Content</label>
                    <textarea value={newsForm.content} onChange={(e) => setNewsForm((f) => ({ ...f, content: e.target.value }))} rows={6}
                      placeholder="Full article content..."
                      className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#2557D6] resize-none"
                      style={{ fontFamily: "'Inter', sans-serif" }} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Category</label>
                      <select value={newsForm.category} onChange={(e) => setNewsForm((f) => ({ ...f, category: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#2557D6]"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Status</label>
                      <select value={newsForm.status} onChange={(e) => setNewsForm((f) => ({ ...f, status: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#2557D6]"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Cover Image</label>
                      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => setNewsImageFile(e.target.files?.[0] ?? null)}
                        className="w-full text-[12.5px] text-[#6B7280] file:mr-2 file:py-1 file:px-2 file:text-[12px] file:border file:border-[#DDD9D2] file:rounded-md file:bg-white file:text-[#0D1421]"
                        style={{ fontFamily: "'Inter', sans-serif" }} />
                    </div>
                  </div>

                  {formMsg && <p className="text-[12.5px] text-[#2557D6]" style={{ fontFamily: "'Inter', sans-serif" }}>{formMsg}</p>}

                  <div className="flex gap-3 pt-1">
                    <button type="submit" disabled={formLoading}
                      className="px-5 py-2.5 bg-[#2557D6] text-white text-[13px] font-medium rounded-lg hover:bg-[#1E4AB8] transition-colors disabled:opacity-50"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      {formLoading ? "Saving..." : editingId ? "Update Article" : "Create Article"}
                    </button>
                    <button type="button" onClick={() => setShowNewsForm(false)}
                      className="px-5 py-2.5 border border-[#DDD9D2] text-[#6B7280] text-[13px] font-medium rounded-lg hover:border-[#0D1421] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* News table */}
            <div className="bg-white border border-[#DDD9D2] rounded-2xl overflow-hidden">
              {newsList.length === 0 ? (
                <div className="text-center py-12 text-[#9CA3AF] text-[13.5px]" style={{ fontFamily: "'Inter', sans-serif" }}>No articles yet. Create your first one.</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F0EDE8] bg-[#FAFAF8]">
                      {["Title", "Category", "Status", "Published", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {newsList.map((item) => (
                      <tr key={item.id} className="border-b border-[#F0EDE8] last:border-b-0 hover:bg-[#FAFAF8]">
                        <td className="px-4 py-3 text-[13.5px] font-medium text-[#0D1421] max-w-[260px] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{item.title}</td>
                        <td className="px-4 py-3 text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>{item.category}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(item.status)}`} style={{ fontFamily: "'Inter', sans-serif" }}>{item.status}</span>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {item.published_at ? new Date(item.published_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => startEditNews(item)} className="text-[12px] text-[#2557D6] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>Edit</button>
                            {item.status !== "published"
                              ? <button onClick={() => handlePublish(item.id)} className="text-[12px] text-[#047857] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>Publish</button>
                              : <button onClick={() => handleUnpublish(item.id)} className="text-[12px] text-[#D97706] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>Unpublish</button>
                            }
                            <button onClick={() => handleDelete(item.id)} className="text-[12px] text-[#DC2626] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === "users" && !dataLoading && (
          <div>
            <h2 className="text-[18px] font-bold text-[#0D1421] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Users ({users.length})</h2>
            <div className="bg-white border border-[#DDD9D2] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EDE8] bg-[#FAFAF8]">
                    {["User", "Username", "Role", "Joined"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: Record<string, unknown>) => (
                    <tr key={u.id as string} className="border-b border-[#F0EDE8] last:border-b-0 hover:bg-[#FAFAF8]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {u.avatar_url ? (
                            <img src={u.avatar_url as string} className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 bg-[#0D1421] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                              {(u.full_name as string)?.[0]}
                            </div>
                          )}
                          <span className="text-[13.5px] font-medium text-[#0D1421]" style={{ fontFamily: "'Inter', sans-serif" }}>{u.full_name as string}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>@{u.username as string ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#EEF2FF] text-[#2557D6]"}`}
                          style={{ fontFamily: "'Inter', sans-serif" }}>{u.role as string}</span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {new Date(u.created_at as string).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Startups */}
        {tab === "startups" && !dataLoading && (
          <div>
            <h2 className="text-[18px] font-bold text-[#0D1421] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Startup Ideas ({startups.length})</h2>
            <div className="bg-white border border-[#DDD9D2] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EDE8] bg-[#FAFAF8]">
                    {["Title", "Industry", "Stage", "Visibility", "Rating", "Submitted"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {startups.map((s: Record<string, unknown>) => (
                    <tr key={s.id as string} className="border-b border-[#F0EDE8] last:border-b-0 hover:bg-[#FAFAF8]">
                      <td className="px-4 py-3 text-[13.5px] font-medium text-[#0D1421] max-w-[200px] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{s.title as string}</td>
                      <td className="px-4 py-3 text-[12.5px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>{s.industry as string}</td>
                      <td className="px-4 py-3 text-[12.5px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>{s.stage as string}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${s.visibility === "public" ? "bg-[#ECFDF5] text-[#047857]" : s.visibility === "investors_only" ? "bg-[#EEF2FF] text-[#2557D6]" : "bg-[#F3F4F6] text-[#6B7280]"}`}
                          style={{ fontFamily: "'Inter', sans-serif" }}>{s.visibility as string}</span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#0D1421]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {s.avg_rating ? Number(s.avg_rating).toFixed(1) : "—"}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {new Date(s.created_at as string).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
