import { useState } from "react";
import Badge from "../components/ui/Badge";

const businessTypes = ["Retail", "Education", "Healthcare", "Service Business", "Agency", "Startup", "Other"];
const featureOptions = ["Customer Management", "Inventory", "Payments", "Reports", "Employees", "Notifications", "Custom Features"];

interface SaaSRequest {
  businessType: string;
  features: string[];
  description: string;
}

export default function BuildSaas() {
  const [request, setRequest] = useState<SaaSRequest>({ businessType: "", features: [], description: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleFeature = (f: string) => {
    setRequest((r) => ({
      ...r,
      features: r.features.includes(f) ? r.features.filter((x) => x !== f) : [...r.features, f],
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!request.businessType) e.businessType = "Select your business type.";
    if (request.features.length === 0) e.features = "Select at least one feature.";
    if (request.description.trim().length < 20) e.description = "Please describe your needs in at least 20 characters.";
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
          <h2 className="text-[24px] font-bold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Request Submitted</h2>
          <p className="text-[14px] text-[#6B7280] mb-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            {"We've received your SaaS requirements. Our team will review and reach out within 48 hours to discuss your solution."}
          </p>
          <div className="bg-[#F4F4F2] rounded-lg p-5 text-left mb-6">
            <h3 className="text-[13px] font-semibold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your Requirements Summary</h3>
            <div className="space-y-2 text-[13px]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex justify-between"><span className="text-[#6B7280]">Business Type</span><span className="font-medium text-[#0D1421]">{request.businessType}</span></div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {request.features.map((f) => <Badge key={f} variant="accent">{f}</Badge>)}
              </div>
              <p className="text-[#6B7280] mt-3 italic leading-relaxed">"{request.description}"</p>
            </div>
          </div>
          <button onClick={() => { setSubmitted(false); setRequest({ businessType: "", features: [], description: "" }); }} className="text-[13px] text-[#2557D6] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-10">
          <Badge variant="accent">Custom SaaS Builder</Badge>
          <h1 className="text-[32px] lg:text-[42px] font-bold text-[#0D1421] mt-4 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Build Your SaaS
          </h1>
          <p className="text-[15px] text-[#6B7280] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            Tell us about your business and what you need. {"We'll"} design a system built exactly around your workflow.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
            {/* Business type */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Business Type <span className="text-[#DC2626]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {businessTypes.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => { setRequest((r) => ({ ...r, businessType: t })); setErrors((e) => ({ ...e, businessType: "" })); }}
                    className={`px-3.5 py-2 rounded-[5px] text-[13px] font-medium border transition-all ${
                      request.businessType === t
                        ? "bg-[#0D1421] text-white border-[#0D1421]"
                        : "bg-white text-[#374151] border-[#E5E5E2] hover:border-[#0D1421]"
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {errors.businessType && <p className="text-[12px] text-[#DC2626] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.businessType}</p>}
            </div>

            {/* Features */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0D1421] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Features You Need <span className="text-[#DC2626]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {featureOptions.map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => { toggleFeature(f); setErrors((e) => ({ ...e, features: "" })); }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] text-[13px] font-medium border transition-all ${
                      request.features.includes(f)
                        ? "bg-[#EEF2FF] text-[#2557D6] border-[#2557D6]"
                        : "bg-white text-[#374151] border-[#E5E5E2] hover:border-[#9CA3AF]"
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {request.features.includes(f) && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    )}
                    {f}
                  </button>
                ))}
              </div>
              {errors.features && <p className="text-[12px] text-[#DC2626] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.features}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0D1421] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Describe What Your Business Needs <span className="text-[#DC2626]">*</span>
              </label>
              <p className="text-[12px] text-[#9CA3AF] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Be specific — the more detail you provide, the better we can design your solution.</p>
              <textarea
                rows={6}
                value={request.description}
                onChange={(e) => { setRequest((r) => ({ ...r, description: e.target.value })); setErrors((ex) => ({ ...ex, description: "" })); }}
                placeholder="e.g. We run a physiotherapy clinic with 8 therapists. We need a booking system where patients can self-schedule, therapists can see their calendars, and managers can track attendance and revenue per therapist..."
                className={`w-full px-4 py-3 border rounded-[6px] text-[13.5px] text-[#0D1421] placeholder-[#C5C5C0] resize-none focus:outline-none focus:ring-2 focus:ring-[#2557D6] focus:border-transparent transition-all ${errors.description ? "border-[#DC2626]" : "border-[#E5E5E2]"}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              {errors.description && <p className="text-[12px] text-[#DC2626] mt-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.description}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#2557D6] text-white py-3.5 rounded-[6px] text-[14px] font-medium hover:bg-[#1E4AB8] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Submit SaaS Request
            </button>
          </form>

          {/* Live Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-[#F4F4F2] rounded-xl p-6 border border-[#E5E5E2]">
              <h3 className="text-[13px] font-semibold text-[#0D1421] mb-4 uppercase tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your SaaS Requirement</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Business Type</p>
                  {request.businessType ? (
                    <p className="text-[13.5px] font-medium text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{request.businessType}</p>
                  ) : (
                    <p className="text-[13px] text-[#C5C5C0] italic" style={{ fontFamily: "'Inter', sans-serif" }}>Not selected yet</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Selected Features</p>
                  {request.features.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {request.features.map((f) => <Badge key={f} variant="accent">{f}</Badge>)}
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#C5C5C0] italic" style={{ fontFamily: "'Inter', sans-serif" }}>No features selected</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Custom Requirement</p>
                  {request.description.trim() ? (
                    <p className="text-[12.5px] text-[#374151] leading-relaxed italic" style={{ fontFamily: "'Inter', sans-serif" }}>"{request.description}"</p>
                  ) : (
                    <p className="text-[13px] text-[#C5C5C0] italic" style={{ fontFamily: "'Inter', sans-serif" }}>Not described yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
