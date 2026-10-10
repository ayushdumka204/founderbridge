import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { signUp, signIn } from "../../services/authService";
import { createProfile, upsertStudentProfile, upsertInvestorProfile, upsertBusinessProfile } from "../../services/profileService";

type DBRole = "student" | "investor" | "business_owner" | "general_user";
type UIRole = "founder" | "investor" | "business" | "general";

const uiToDb: Record<UIRole, DBRole> = {
  founder:  "student",
  investor: "investor",
  business: "business_owner",
  general:  "general_user",
};

const roles: { id: UIRole; label: string; sub: string; icon: string; color: string }[] = [
  { id: "founder",  label: "Student / Founder",  sub: "Share your startup ideas, connect with investors and build your network.", icon: "🚀", color: "#2557D6" },
  { id: "investor", label: "Investor",            sub: "Discover promising startups, follow founders and explore investment opportunities.", icon: "💼", color: "#7C3AED" },
  { id: "business", label: "Business Owner",      sub: "Connect with founders, discover solutions and build software around your business.", icon: "🏢", color: "#D97706" },
  { id: "general",  label: "General User",        sub: "Explore startups, technology, investors and business opportunities.", icon: "🌐", color: "#059669" },
];

interface Props { onClose: () => void }

export default function ProfileSetupModal({ onClose }: Props) {
  const { refreshProfile } = useAuth();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [step, setStep] = useState<"auth" | "role" | "form">("auth");
  const [selectedRole, setSelectedRole] = useState<UIRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [auth, setAuth] = useState({ email: "", password: "" });
  const [form, setForm] = useState<Record<string, string>>({
    name: "", username: "", bio: "", location: "", website: "",
    linkedin: "", twitter: "", instagram: "",
    university: "", course: "", gradYear: "", startupName: "", startupCategory: "",
    investorType: "", investmentRange: "", interests: "",
    businessName: "", businessIndustry: "",
  });
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const setA = (k: string, v: string) => setAuth((a) => ({ ...a, [k]: v }));

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signin") {
        await signIn(auth.email, auth.password);
        await refreshProfile();
        onClose();
      } else {
        const data = await signUp(auth.email, auth.password);
        if (data.user) {
          setPendingUserId(data.user.id);
          setStep("role");
        } else {
          setError("Check your email to confirm your account, then sign in.");
        }
      }
    } catch (err: unknown) {
      setError((err as Error).message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitProfile() {
    if (!pendingUserId || !selectedRole || !form.name.trim()) return;
    setError("");
    setLoading(true);
    try {
      const dbRole = uiToDb[selectedRole];
      const profile = await createProfile({
        user_id: pendingUserId,
        role: dbRole,
        full_name: form.name.trim(),
        username: form.username.trim() || undefined,
        bio: form.bio.trim() || undefined,
        location: form.location.trim() || undefined,
        website: form.website.trim() || undefined,
        linkedin_url: form.linkedin.trim() || undefined,
        twitter_url: form.twitter.trim() || undefined,
        instagram_url: form.instagram.trim() || undefined,
      });

      if (selectedRole === "founder") {
        await upsertStudentProfile(profile.id, {
          university: form.university || null,
          course: form.course || null,
          graduation_year: form.gradYear ? parseInt(form.gradYear) : null,
        });
      } else if (selectedRole === "investor") {
        await upsertInvestorProfile(profile.id, {
          investor_type: form.investorType || null,
          investment_interests: form.interests ? [form.interests] : null,
        });
      } else if (selectedRole === "business") {
        await upsertBusinessProfile(profile.id, {
          business_name: form.businessName || null,
          industry: form.businessIndustry || null,
        });
      }

      await refreshProfile();
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message ?? "Profile creation failed.");
    } finally {
      setLoading(false);
    }
  }

  const extraFields: Record<UIRole, { key: string; label: string; placeholder: string }[]> = {
    founder: [
      { key: "university",     label: "College / University",  placeholder: "e.g. University of Nairobi" },
      { key: "course",         label: "Course / Major",        placeholder: "e.g. Computer Science" },
      { key: "gradYear",       label: "Graduation Year",       placeholder: "e.g. 2026" },
      { key: "startupName",    label: "Startup Name",          placeholder: "e.g. EduBridge" },
      { key: "startupCategory",label: "Startup Category",      placeholder: "e.g. EdTech" },
    ],
    investor: [
      { key: "investorType",   label: "Investor Type",         placeholder: "e.g. Angel Investor, VC" },
      { key: "investmentRange",label: "Investment Range",       placeholder: "e.g. $10K–$100K" },
      { key: "interests",      label: "Investment Interests",  placeholder: "e.g. EdTech, HealthTech" },
    ],
    business: [
      { key: "businessName",     label: "Business Name", placeholder: "e.g. Amara Wellness" },
      { key: "businessIndustry", label: "Industry",      placeholder: "e.g. Wellness, Retail" },
    ],
    general: [
      { key: "interests", label: "Interests", placeholder: "e.g. Startups, Tech, Finance" },
    ],
  };

  const RoleCard = ({ r }: { r: typeof roles[0] }) => (
    <button onClick={() => setSelectedRole(r.id)}
      className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl text-left transition-all duration-150 group ${selectedRole === r.id ? "border-[#2557D6] bg-[#EEF2FF]" : "border-[#DDD9D2] hover:border-[#C5C0BB] hover:bg-[#FAFAF8] hover:-translate-y-0.5"}`}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] shrink-0" style={{ background: `${r.color}15` }}>{r.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{r.label}</p>
        <p className="text-[12.5px] text-[#6B7280] leading-snug mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{r.sub}</p>
      </div>
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedRole === r.id ? "border-[#2557D6] bg-[#2557D6]" : "border-[#DDD9D2]"}`}>
        {selectedRole === r.id && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 12 12"><path strokeLinecap="round" strokeLinejoin="round" d="M10 3L5 8.5 2 5.5"/></svg>}
      </div>
    </button>
  );

  const InputField = ({ keyName, label, placeholder, type = "text" }: { keyName: string; label: string; placeholder?: string; type?: string }) => (
    <div>
      <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
      <input type={type} value={form[keyName] ?? ""} onChange={(e) => set(keyName, e.target.value)} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] text-[#0D1421] placeholder-[#C5C0BB] focus:outline-none focus:ring-2 focus:ring-[#2557D6] focus:border-transparent"
        style={{ fontFamily: "'Inter', sans-serif" }} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full sm:max-w-[560px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl" style={{ maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#F0EDE8] px-6 pt-6 pb-4 z-10">
          <div className="flex items-start justify-between">
            <div>
              {step === "auth" && (
                <>
                  <h2 className="text-[20px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {mode === "signup" ? "Create Your Account" : "Welcome Back"}
                  </h2>
                  <p className="text-[13px] text-[#6B7280] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {mode === "signup" ? "Join FounderBridge to get started." : "Sign in to your FounderBridge account."}
                  </p>
                </>
              )}
              {step === "role" && (
                <h2 className="text-[20px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Choose Your Role</h2>
              )}
              {step === "form" && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setStep("role")} className="text-[#6B7280] hover:text-[#0D1421] transition-colors mr-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                  </button>
                  <h2 className="text-[20px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your Profile</h2>
                </div>
              )}
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#0D1421] hover:bg-[#F5F4F0] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Step: Auth */}
        {step === "auth" && (
          <form onSubmit={handleAuth} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Email</label>
              <input type="email" required value={auth.email} onChange={(e) => setA("email", e.target.value)} placeholder="you@email.com"
                className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] text-[#0D1421] placeholder-[#C5C0BB] focus:outline-none focus:ring-2 focus:ring-[#2557D6]"
                style={{ fontFamily: "'Inter', sans-serif" }} />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Password</label>
              <input type="password" required minLength={6} value={auth.password} onChange={(e) => setA("password", e.target.value)} placeholder="Min. 6 characters"
                className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] text-[#0D1421] placeholder-[#C5C0BB] focus:outline-none focus:ring-2 focus:ring-[#2557D6]"
                style={{ fontFamily: "'Inter', sans-serif" }} />
            </div>
            {error && <p className="text-[12.5px] text-[#DC2626]" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#2557D6] text-white text-[14px] font-medium rounded-xl hover:bg-[#1E4AB8] transition-colors disabled:opacity-40"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              {loading ? "Please wait..." : mode === "signup" ? "Continue →" : "Sign In"}
            </button>
            <p className="text-center text-[12.5px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
              {mode === "signup" ? "Already have an account?" : "New to FounderBridge?"}{" "}
              <button type="button" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); }}
                className="text-[#2557D6] font-medium hover:underline">
                {mode === "signup" ? "Sign in" : "Create account"}
              </button>
            </p>
          </form>
        )}

        {/* Step: Role */}
        {step === "role" && (
          <div className="px-6 py-5 space-y-3">
            {roles.map((r) => <RoleCard key={r.id} r={r} />)}
            {error && <p className="text-[12.5px] text-[#DC2626]" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>}
            <div className="pt-2 pb-1">
              <button onClick={() => selectedRole && setStep("form")} disabled={!selectedRole}
                className="w-full py-3 bg-[#2557D6] text-white text-[14px] font-medium rounded-xl hover:bg-[#1E4AB8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step: Form */}
        {step === "form" && selectedRole && (
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center gap-2 pb-1">
              <span className="text-lg">{roles.find((r) => r.id === selectedRole)?.icon}</span>
              <span className="text-[12.5px] font-semibold text-[#2557D6] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full" style={{ fontFamily: "'Inter', sans-serif" }}>
                {roles.find((r) => r.id === selectedRole)?.label}
              </span>
            </div>

            <InputField keyName="name" label="Full Name *" placeholder="Your full name" />
            <InputField keyName="username" label="Username" placeholder="@username" />
            <InputField keyName="location" label="Location" placeholder="e.g. Nairobi, Kenya" />
            <InputField keyName="website" label="Website" placeholder="https://yourwebsite.com" />

            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Bio</label>
              <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-3.5 py-2.5 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[13.5px] text-[#0D1421] placeholder-[#C5C0BB] focus:outline-none focus:ring-2 focus:ring-[#2557D6] resize-none"
                style={{ fontFamily: "'Inter', sans-serif" }} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[["linkedin", "LinkedIn"], ["twitter", "X / Twitter"], ["instagram", "Instagram"]].map(([k, label]) => (
                <div key={k}>
                  <label className="block text-[11px] font-medium text-[#9CA3AF] mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
                  <input value={form[k] ?? ""} onChange={(e) => set(k, e.target.value)} placeholder="@handle"
                    className="w-full px-3 py-2 bg-[#F5F4F0] border border-[#DDD9D2] rounded-lg text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#2557D6]"
                    style={{ fontFamily: "'Inter', sans-serif" }} />
                </div>
              ))}
            </div>

            {extraFields[selectedRole].length > 0 && (
              <>
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-[#DDD9D2]" />
                  <p className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>Role details</p>
                  <div className="flex-1 h-px bg-[#DDD9D2]" />
                </div>
                {extraFields[selectedRole].map(({ key, label, placeholder }) => (
                  <InputField key={key} keyName={key} label={label} placeholder={placeholder} />
                ))}
              </>
            )}

            {error && <p className="text-[12.5px] text-[#DC2626]" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>}

            <div className="pt-2 pb-1">
              <button onClick={handleSubmitProfile} disabled={loading || !form.name.trim()}
                className="w-full py-3 bg-[#2557D6] text-white text-[14px] font-medium rounded-xl hover:bg-[#1E4AB8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {loading ? "Creating profile..." : "Create Profile"}
              </button>
              <p className="text-center text-[11.5px] text-[#9CA3AF] mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                You can update your profile any time from your account.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
