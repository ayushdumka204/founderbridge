import { Link } from "react-router";
import { saasCategories } from "../data";
import Badge from "../components/ui/Badge";

const steps = [
  { num: "01", title: "Tell Us Your Need", desc: "Describe your business, your workflow challenges, and what you wish your software could do." },
  { num: "02", title: "Design Your Solution", desc: "Our team designs a system architecture and UX tailored to exactly how your business operates." },
  { num: "03", title: "Build Your Product", desc: "We develop, test, and iterate with regular checkpoints so you always see where things stand." },
  { num: "04", title: "Launch & Improve", desc: "Deploy with confidence. We provide onboarding, training, and a roadmap for future improvements." },
];

export default function Saas() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D1421] py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <Badge variant="accent">Custom SaaS Platform</Badge>
              <h1 className="text-[38px] lg:text-[52px] font-bold leading-[1.1] text-white mt-4 mb-5 tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Your Business.<br />Your Workflow.<br />Your Software.
              </h1>
              <p className="text-[15px] lg:text-[16px] text-[#9CA3AF] leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Tell us what your business needs. We design and build a SaaS solution around your exact workflow — not the other way around.
              </p>
              <Link
                to="/build-saas"
                className="inline-flex items-center gap-2 bg-[#2557D6] text-white px-5 py-3 rounded-[6px] text-[14px] font-medium hover:bg-[#1E4AB8] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Start Building Your SaaS
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-[#1A2535]" style={{ aspectRatio: "4/3" }}>
              <img
                src="https://images.unsplash.com/photo-1758876204763-5b346b174d0e?w=800&h=600&fit=crop&auto=format"
                alt="Business owner reviewing software dashboard"
                className="w-full h-full object-cover opacity-70"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-[#EEECEA] border-b border-[#DDD9D2]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <p className="text-[12px] uppercase tracking-widest text-[#9CA3AF] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Process</p>
            <h2 className="text-[28px] lg:text-[36px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-3 left-full w-full h-px bg-[#E5E5E2] -translate-y-0.5" style={{ width: "calc(100% - 2rem)" }} />
                )}
                <p className="text-[40px] font-bold text-[#E5E5E2] leading-none mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>{step.num}</p>
                <h3 className="text-[16px] font-semibold text-[#0D1421] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{step.title}</h3>
                <p className="text-[13.5px] text-[#6B7280] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SaaS Solutions Grid */}
      <section className="py-16 lg:py-24 bg-[#F5F4F0] border-b border-[#DDD9D2]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#2557D6] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Solutions</p>
            <h2 className="text-[28px] lg:text-[36px] font-bold text-[#0D1421]" style={{ fontFamily: "'DM Sans', sans-serif" }}>What We Build</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saasCategories.map((cat, i) => (
              <Link
                key={cat.id}
                to="/build-saas"
                className={`group flex gap-4 p-5 bg-white border border-[#DDD9D2] rounded-xl hover:border-[#2557D6] hover:shadow-[0_4px_16px_rgba(37,87,214,0.07)] hover:-translate-y-0.5 transition-all duration-200 ${i === 10 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <span className="text-2xl shrink-0">{cat.icon}</span>
                <div>
                  <h3 className="font-semibold text-[14.5px] text-[#0D1421] mb-1 group-hover:text-[#2557D6] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{cat.label}</h3>
                  <p className="text-[12.5px] text-[#6B7280] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-[28px] lg:text-[36px] font-bold text-[#0D1421] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Ready to build software that actually fits?
          </h2>
          <p className="text-[15px] text-[#6B7280] mb-8 max-w-lg mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Describe your business needs and we'll design a system around your exact workflow.
          </p>
          <Link
            to="/build-saas"
            className="inline-flex items-center gap-2 bg-[#0D1421] text-white px-6 py-3.5 rounded-[6px] text-[14px] font-medium hover:bg-[#1A2535] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Build Your SaaS Now
          </Link>
        </div>
      </section>
    </div>
  );
}
