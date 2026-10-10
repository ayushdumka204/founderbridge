import { useState } from "react";
import { Link } from "react-router";
import Badge from "../components/ui/Badge";

const industries = ["EdTech", "HealthTech", "FinTech", "CleanTech", "LogTech", "RetailTech", "DevTools", "AI/ML", "SaaS", "Consumer", "Other"];
const stages = ["Idea", "Research", "Prototype", "MVP", "Pre-seed", "Seed"];
const visibilityOptions = [
  { value: "public", label: "Public", desc: "Anyone can discover your idea." },
  { value: "investors", label: "Investors Only", desc: "Only verified investors can view." },
  { value: "private", label: "Private", desc: "Only visible to you." },
];

interface FormData {
  name: string; pitch: string; problem: string; solution: string;
  targetAudience: string; industry: string; businessModel: string;
  stage: string; fundingRequired: string; marketOpportunity: string;
  competitors: string; traction: string; website: string; demoLink: string;
  founderName: string; founderEmail: string; founderBio: string;
  visibility: string;
}

const empty: FormData = {
  name: "", pitch: "", problem: "", solution: "", targetAudience: "",
  industry: "", businessModel: "", stage: "", fundingRequired: "",
  marketOpportunity: "", competitors: "", traction: "", website: "",
  demoLink: "", founderName: "", founderEmail: "", founderBio: "",
  visibility: "public",
};

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#0D1421] mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {label}{required && <span className="text-[#DC2626] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-[#DC2626] mt-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full px-3.5 py-2.5 border rounded-[6px] text-[13.5px] text-[#0D1421] placeholder-[#C5C5C0] focus:outline-none focus:ring-2 focus:ring-[#2557D6] focus:border-transparent transition-all ${err ? "border-[#DC2626]" : "border-[#E5E5E2]"}`;

export default function SubmitIdea() {
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Startup name is required.";
    if (!form.pitch.trim()) e.pitch = "A one-line pitch is required.";
    if (!form.problem.trim()) e.problem = "Describe the problem.";
    if (!form.solution.trim()) e.solution = "Describe your solution.";
    if (!form.industry) e.industry = "Select an industry.";
    if (!form.stage) e.stage = "Select a stage.";
    if (!form.founderName.trim()) e.founderName = "Your name is required.";
    if (!form.founderEmail.trim()) e.founderEmail = "Your email is required.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </div>
          <h2 className="text-[24px] font-bold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Idea Submitted!</h2>
          <p className="text-[14px] text-[#6B7280] mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            <strong className="text-[#0D1421]">{form.name}</strong> has been submitted. Investors can now discover and rate your idea.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/startups" className="inline-flex items-center justify-center gap-2 bg-[#0D1421] text-white px-5 py-3 rounded-[6px] text-[13.5px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              Browse All Ideas
            </Link>
            <button onClick={() => { setForm(empty); setSubmitted(false); }} className="inline-flex items-center justify-center gap-2 bg-white text-[#0D1421] border border-[#E5E5E2] px-5 py-3 rounded-[6px] text-[13.5px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <div className="mb-10">
          <Badge variant="accent">Submit Your Idea</Badge>
          <h1 className="text-[30px] lg:text-[40px] font-bold text-[#0D1421] mt-4 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Share Your Startup Idea
          </h1>
          <p className="text-[15px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Complete this form to make your idea visible to investors on the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Info */}
          <div className="space-y-5">
            <h2 className="text-[16px] font-semibold text-[#0D1421] pb-3 border-b border-[#E5E5E2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Startup Information</h2>
            <Field label="Startup Name" required error={errors.name}>
              <input type="text" value={form.name} onChange={set("name")} placeholder="e.g. EduBridge" className={inputCls(errors.name)} style={{ fontFamily: "'Inter', sans-serif" }} />
            </Field>
            <Field label="One-line Pitch" required error={errors.pitch}>
              <input type="text" value={form.pitch} onChange={set("pitch")} placeholder="e.g. AI-powered tutoring that adapts to each student's learning pace." className={inputCls(errors.pitch)} style={{ fontFamily: "'Inter', sans-serif" }} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Industry" required error={errors.industry}>
                <select value={form.industry} onChange={set("industry")} className={inputCls(errors.industry) + " bg-white"} style={{ fontFamily: "'Inter', sans-serif" }}>
                  <option value="">Select industry...</option>
                  {industries.map((i) => <option key={i}>{i}</option>)}
                </select>
              </Field>
              <Field label="Current Stage" required error={errors.stage}>
                <select value={form.stage} onChange={set("stage")} className={inputCls(errors.stage) + " bg-white"} style={{ fontFamily: "'Inter', sans-serif" }}>
                  <option value="">Select stage...</option>
                  {stages.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Funding Required" error={errors.fundingRequired}>
                <input type="text" value={form.fundingRequired} onChange={set("fundingRequired")} placeholder="e.g. $120,000" className={inputCls()} style={{ fontFamily: "'Inter', sans-serif" }} />
              </Field>
              <Field label="Business Model" error={errors.businessModel}>
                <input type="text" value={form.businessModel} onChange={set("businessModel")} placeholder="e.g. SaaS subscription" className={inputCls()} style={{ fontFamily: "'Inter', sans-serif" }} />
              </Field>
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="space-y-5">
            <h2 className="text-[16px] font-semibold text-[#0D1421] pb-3 border-b border-[#E5E5E2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Problem & Solution</h2>
            <Field label="Problem" required error={errors.problem}>
              <textarea rows={3} value={form.problem} onChange={set("problem")} placeholder="What specific problem does your startup solve?" className={inputCls(errors.problem) + " resize-none"} style={{ fontFamily: "'Inter', sans-serif" }} />
            </Field>
            <Field label="Solution" required error={errors.solution}>
              <textarea rows={3} value={form.solution} onChange={set("solution")} placeholder="How does your startup solve this problem?" className={inputCls(errors.solution) + " resize-none"} style={{ fontFamily: "'Inter', sans-serif" }} />
            </Field>
            <Field label="Target Audience">
              <input type="text" value={form.targetAudience} onChange={set("targetAudience")} placeholder="Who are your primary customers?" className={inputCls()} style={{ fontFamily: "'Inter', sans-serif" }} />
            </Field>
          </div>

          {/* Market */}
          <div className="space-y-5">
            <h2 className="text-[16px] font-semibold text-[#0D1421] pb-3 border-b border-[#E5E5E2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Market & Traction</h2>
            <Field label="Market Opportunity">
              <textarea rows={2} value={form.marketOpportunity} onChange={set("marketOpportunity")} placeholder="How large is the market? Any supporting data?" className={inputCls() + " resize-none"} style={{ fontFamily: "'Inter', sans-serif" }} />
            </Field>
            <Field label="Competitors">
              <input type="text" value={form.competitors} onChange={set("competitors")} placeholder="Who are your main competitors? How are you different?" className={inputCls()} style={{ fontFamily: "'Inter', sans-serif" }} />
            </Field>
            <Field label="Traction">
              <input type="text" value={form.traction} onChange={set("traction")} placeholder="Users, revenue, partnerships, pilot programs..." className={inputCls()} style={{ fontFamily: "'Inter', sans-serif" }} />
            </Field>
          </div>

          {/* Links */}
          <div className="space-y-5">
            <h2 className="text-[16px] font-semibold text-[#0D1421] pb-3 border-b border-[#E5E5E2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Links</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Website">
                <input type="url" value={form.website} onChange={set("website")} placeholder="https://yourstartup.com" className={inputCls()} style={{ fontFamily: "'Inter', sans-serif" }} />
              </Field>
              <Field label="Demo Link">
                <input type="url" value={form.demoLink} onChange={set("demoLink")} placeholder="https://demo.yourstartup.com" className={inputCls()} style={{ fontFamily: "'Inter', sans-serif" }} />
              </Field>
            </div>
          </div>

          {/* Founder */}
          <div className="space-y-5">
            <h2 className="text-[16px] font-semibold text-[#0D1421] pb-3 border-b border-[#E5E5E2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Founder Information</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Your Name" required error={errors.founderName}>
                <input type="text" value={form.founderName} onChange={set("founderName")} placeholder="Full name" className={inputCls(errors.founderName)} style={{ fontFamily: "'Inter', sans-serif" }} />
              </Field>
              <Field label="Email" required error={errors.founderEmail}>
                <input type="email" value={form.founderEmail} onChange={set("founderEmail")} placeholder="you@email.com" className={inputCls(errors.founderEmail)} style={{ fontFamily: "'Inter', sans-serif" }} />
              </Field>
            </div>
            <Field label="About You">
              <textarea rows={2} value={form.founderBio} onChange={set("founderBio")} placeholder="Brief background — university, relevant experience, why you're building this." className={inputCls() + " resize-none"} style={{ fontFamily: "'Inter', sans-serif" }} />
            </Field>
          </div>

          {/* Visibility */}
          <div>
            <h2 className="text-[16px] font-semibold text-[#0D1421] pb-3 border-b border-[#E5E5E2] mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Idea Visibility</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {visibilityOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${form.visibility === opt.value ? "border-[#2557D6] bg-[#EEF2FF]" : "border-[#E5E5E2] bg-white hover:border-[#9CA3AF]"}`}
                >
                  <input type="radio" name="visibility" value={opt.value} checked={form.visibility === opt.value} onChange={set("visibility")} className="mt-0.5 accent-[#2557D6]" />
                  <div>
                    <p className="text-[13px] font-semibold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opt.label}</p>
                    <p className="text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2557D6] text-white py-3.5 rounded-[6px] text-[14px] font-medium hover:bg-[#1E4AB8] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Submit Startup Idea
          </button>
        </form>
      </div>
    </div>
  );
}
