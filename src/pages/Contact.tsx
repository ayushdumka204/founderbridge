import { useState } from "react";
import Badge from "../components/ui/Badge";

interface ContactForm {
  name: string;
  email: string;
  role: string;
  subject: string;
  message: string;
}

const roles = ["Student", "Investor", "Business", "Other"];

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", role: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const e: Partial<ContactForm> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Please write a message.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSent(true);
  };

  const inputCls = (err?: string) =>
    `w-full px-3.5 py-2.5 border rounded-[6px] text-[13.5px] text-[#0D1421] placeholder-[#C5C5C0] focus:outline-none focus:ring-2 focus:ring-[#2557D6] focus:border-transparent transition-all ${err ? "border-[#DC2626]" : "border-[#E5E5E2]"}`;

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D1421] py-14 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="max-w-xl">
            <Badge variant="accent">Contact</Badge>
            <h1 className="text-[34px] lg:text-[48px] font-bold text-white mt-4 mb-4 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {"Let's Build Something That Matters."}
            </h1>
            <p className="text-[15px] text-[#9CA3AF] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Whether you have a startup idea, a business need, or a partnership question — {"we're"} here.
            </p>
          </div>
        </div>
      </section>

      {/* Split layout */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Info */}
            <div>
              <div className="relative rounded-xl overflow-hidden bg-[#E5E5E2] mb-8" style={{ aspectRatio: "4/3" }}>
                <img
                  src="https://images.unsplash.com/photo-1507099985932-87a4520ed1d5?w=700&h=525&fit=crop&auto=format"
                  alt="Building ideas together"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-[20px] font-semibold text-[#0D1421] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Get in Touch</h2>
              <p className="text-[14px] text-[#6B7280] leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                {"We're"} a team passionate about connecting the next generation of builders with the resources and people they need to succeed.
              </p>

              <div className="space-y-3">
                {[
                  { label: "Email", value: "hello@founderbridge.io" },
                  { label: "Based in", value: "Nairobi · London · Austin" },
                  { label: "Response time", value: "Within 48 hours" },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <span className="text-[12px] text-[#9CA3AF] w-24 shrink-0 pt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{c.label}</span>
                    <span className="text-[13.5px] text-[#0D1421] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{c.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                {["X / Twitter", "LinkedIn", "Instagram"].map((s) => (
                  <a key={s} href="#" className="text-[12.5px] text-[#6B7280] hover:text-[#0D1421] transition-colors border border-[#E5E5E2] px-3 py-1.5 rounded-[5px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div>
              {sent ? (
                <div className="flex flex-col items-start pt-8">
                  <div className="w-12 h-12 bg-[#DCFCE7] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  </div>
                  <h3 className="text-[22px] font-bold text-[#0D1421] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Message Sent!</h3>
                  <p className="text-[14px] text-[#6B7280] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Thanks {form.name}. {"We'll"} get back to you within 48 hours.
                  </p>
                  <button onClick={() => { setForm({ name: "", email: "", role: "", subject: "", message: "" }); setSent(false); }} className="text-[13px] text-[#2557D6] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0D1421] mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Name <span className="text-[#DC2626]">*</span></label>
                      <input type="text" value={form.name} onChange={set("name")} placeholder="Your full name" className={inputCls(errors.name)} style={{ fontFamily: "'Inter', sans-serif" }} />
                      {errors.name && <p className="text-[12px] text-[#DC2626] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0D1421] mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email <span className="text-[#DC2626]">*</span></label>
                      <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className={inputCls(errors.email)} style={{ fontFamily: "'Inter', sans-serif" }} />
                      {errors.email && <p className="text-[12px] text-[#DC2626] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#0D1421] mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>I am a</label>
                    <div className="flex flex-wrap gap-2">
                      {roles.map((r) => (
                        <button
                          type="button"
                          key={r}
                          onClick={() => setForm((f) => ({ ...f, role: r }))}
                          className={`px-3.5 py-2 rounded-[5px] text-[13px] font-medium border transition-all ${form.role === r ? "bg-[#0D1421] text-white border-[#0D1421]" : "bg-white text-[#374151] border-[#E5E5E2] hover:border-[#0D1421]"}`}
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#0D1421] mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Subject <span className="text-[#DC2626]">*</span></label>
                    <input type="text" value={form.subject} onChange={set("subject")} placeholder="What is this about?" className={inputCls(errors.subject)} style={{ fontFamily: "'Inter', sans-serif" }} />
                    {errors.subject && <p className="text-[12px] text-[#DC2626] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#0D1421] mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>Message <span className="text-[#DC2626]">*</span></label>
                    <textarea rows={6} value={form.message} onChange={set("message")} placeholder="Tell us what's on your mind..." className={inputCls(errors.message) + " resize-none"} style={{ fontFamily: "'Inter', sans-serif" }} />
                    {errors.message && <p className="text-[12px] text-[#DC2626] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2557D6] text-white py-3.5 rounded-[6px] text-[14px] font-medium hover:bg-[#1E4AB8] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
