import { useState, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { updateProfile, uploadAvatar } from "../services/profileService";
import { catClass } from "../utils/categoryColor";

type Tab = "following" | "subscriptions" | "saved" | "activity" | "profile";

const activityIcon = (type: string) => {
  const cls = "w-4 h-4";
  if (type === "view")    return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
  if (type === "rate")    return <svg className={cls} fill="currentColor" viewBox="0 0 24 24"><path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" /></svg>;
  if (type === "save")    return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>;
  if (type === "comment") return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" /></svg>;
  return <svg className={cls} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>;
};

const roleDisplayMap: Record<string, string> = {
  student: "Student Founder", investor: "Investor",
  business_owner: "Business Owner", general_user: "General User", admin: "Admin",
};

export default function Account() {
  const { profile, refreshProfile, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Record<string, string>>({});
  const [formInit, setFormInit] = useState(false);

  if (!formInit && profile) {
    setForm({
      full_name:     profile.full_name ?? "",
      username:      profile.username ?? "",
      bio:           profile.bio ?? "",
      location:      profile.location ?? "",
      website:       profile.website ?? "",
      linkedin_url:  profile.linkedin_url ?? "",
      twitter_url:   profile.twitter_url ?? "",
      instagram_url: profile.instagram_url ?? "",
    });
    setFormInit(true);
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await updateProfile(profile.id, form);
      await refreshProfile();
      setSaveMsg("Saved ✓");
      setTimeout(() => setSaveMsg(""), 2500);
    } catch (err: unknown) {
      setSaveMsg((err as Error).message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    try {
      const url = await uploadAvatar(profile.user_id, file);
      await updateProfile(profile.id, { avatar_url: url });
      await refreshProfile();
    } catch (err) {
      console.error(err);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "following", label: "Following" },
    { id: "subscriptions", label: "Subscriptions" },
    { id: "saved", label: "Saved" },
    { id: "activity", label: "Activity" },
  ];

  if (authLoading) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#2557D6] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[16px] font-medium text-[#0D1421] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>You need an account to view this page.</p>
        <p className="text-[13.5px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>Click the profile icon in the navbar to sign in.</p>
      </div>
    </div>
  );

  const initials = (profile.full_name ?? "?").split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

  return (
    <div className="bg-[#F5F4F0] min-h-[calc(100vh-64px)]">
      {/* Profile header */}
      <div className="bg-[#0D1421] pt-10 pb-0">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <div className="flex items-end gap-5 pb-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/10 flex items-center justify-center text-white text-[20px] font-bold shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {initials}
              </div>
            )}
            <div className="flex-1 pb-4">
              <h1 className="text-[20px] font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>{profile.full_name}</h1>
              <p className="text-[13px] text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {roleDisplayMap[profile.role] ?? profile.role}
                {profile.location ? ` · ${profile.location}` : ""}
              </p>
            </div>
            <div className="flex gap-5 text-center pb-4">
              {[["Followers", profile.followers_count ?? 0], ["Following", profile.following_count ?? 0]].map(([l, v]) => (
                <div key={l as string}>
                  <p className="text-[16px] font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>{v}</p>
                  <p className="text-[11px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-0 border-t border-white/10">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${tab === t.id ? "border-[#2557D6] text-white" : "border-transparent text-[#9CA3AF] hover:text-white"}`}
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 lg:px-8 py-6 lg:py-8">

        {/* Profile tab */}
        {tab === "profile" && (
          <div className="bg-white border border-[#DDD9D2] rounded-2xl p-6">
            <h2 className="text-[15px] font-semibold text-[#0D1421] mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Edit Profile</h2>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#DDD9D2]">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-14 h-14 rounded-xl object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#0D1421] flex items-center justify-center text-white text-[18px] font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{initials}</div>
              )}
              <div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                <button onClick={() => fileRef.current?.click()} className="text-[13px] font-medium text-[#2557D6] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>Change photo</button>
                <p className="text-[11.5px] text-[#9CA3AF] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>JPG or PNG, max 2MB</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { k: "full_name",    label: "Full Name" },
                { k: "username",     label: "Username" },
                { k: "location",     label: "Location" },
                { k: "website",      label: "Website" },
                { k: "linkedin_url", label: "LinkedIn" },
                { k: "twitter_url",  label: "X / Twitter" },
                { k: "instagram_url",label: "Instagram" },
              ].map(({ k, label }) => (
                <div key={k}>
                  <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
                  <input value={form[k] ?? ""} onChange={(e) => set(k, e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] text-[#0D1421] focus:outline-none focus:ring-2 focus:ring-[#2557D6]"
                    style={{ fontFamily: "'Inter', sans-serif" }} />
                </div>
              ))}
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Bio</label>
                <textarea value={form.bio ?? ""} onChange={(e) => set("bio", e.target.value)} rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] text-[#0D1421] focus:outline-none focus:ring-2 focus:ring-[#2557D6] resize-none"
                  style={{ fontFamily: "'Inter', sans-serif" }} />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2.5 bg-[#2557D6] text-white text-[13px] font-medium rounded-lg hover:bg-[#1E4AB8] transition-colors disabled:opacity-50"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {saveMsg && <p className="text-[12.5px] text-[#047857]" style={{ fontFamily: "'Inter', sans-serif" }}>{saveMsg}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Following tab — loads from DB in future; placeholder for now */}
        {tab === "following" && (
          <div className="text-center py-16 text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p className="text-[15px] font-medium text-[#6B7280] mb-1">Following</p>
            <p className="text-[13px]">People you follow will appear here once you start following.</p>
            <Link to="/investors" className="inline-block mt-4 text-[13px] text-[#2557D6] font-medium hover:underline">Browse Investors →</Link>
          </div>
        )}

        {tab === "subscriptions" && (
          <div className="text-center py-16 text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p className="text-[15px] font-medium text-[#6B7280] mb-1">Subscriptions</p>
            <p className="text-[13px]">Profiles you subscribe to will appear here.</p>
          </div>
        )}

        {tab === "saved" && (
          <div className="text-center py-16 text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p className="text-[15px] font-medium text-[#6B7280] mb-1">Saved Items</p>
            <p className="text-[13px]">Startups and posts you save will appear here.</p>
            <Link to="/startups" className="inline-block mt-4 text-[13px] text-[#2557D6] font-medium hover:underline">Browse Startups →</Link>
          </div>
        )}

        {tab === "activity" && (
          <div className="text-center py-16 text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p className="text-[15px] font-medium text-[#6B7280] mb-1">Activity</p>
            <p className="text-[13px]">Your recent activity will appear here as you interact with the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
}
