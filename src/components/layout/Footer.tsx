import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-[#0D1421] text-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-white rounded-[5px] flex items-center justify-center">
                <span className="text-[#0D1421] text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>S</span>
              </div>
              <span className="font-semibold text-[15px] tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>FounderBridge</span>
            </div>
            <p className="text-[#9CA3AF] text-[13.5px] leading-relaxed max-w-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
              Where student ideas meet opportunity. Connecting founders, investors, and businesses building the future.
            </p>
            <div className="flex gap-3 mt-6">
              {["X", "Li", "In"].map((s) => (
                <a key={s} href="#" className="w-8 h-8 rounded-md border border-[#1E2B3F] flex items-center justify-center text-[#6B7280] hover:text-white hover:border-[#374151] transition-colors text-xs font-medium">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#4B5563] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Startup Ideas", to: "/startups" },
                { label: "Submit Idea", to: "/submit-idea" },
                { label: "Investors", to: "/investors" },
                { label: "Tech News", to: "/news" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[13.5px] text-[#9CA3AF] hover:text-white transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SaaS */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#4B5563] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>SaaS</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Our Solutions", to: "/saas" },
                { label: "Build Your SaaS", to: "/build-saas" },
                { label: "How It Works", to: "/saas#how-it-works" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[13.5px] text-[#9CA3AF] hover:text-white transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-widest text-[#4B5563] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Contact", to: "/contact" },
                { label: "Privacy", to: "#" },
                { label: "Terms", to: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[13.5px] text-[#9CA3AF] hover:text-white transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-[#1A2535] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#4B5563]" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2026 FounderBridge. All rights reserved.
          </p>
          <p className="text-[12px] text-[#4B5563]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Connecting students, investors, and builders.
          </p>
        </div>
      </div>
    </footer>
  );
}
