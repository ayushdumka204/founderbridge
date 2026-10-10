import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import ProfileSetupModal from "../profile/ProfileSetupModal";
import ProfileDropdown from "../profile/ProfileDropdown";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "SaaS", to: "/saas" },
  { label: "Startup Ideas", to: "/startups" },
  { label: "Investors", to: "/investors" },
  { label: "Tech News", to: "/news" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const location = useLocation();
  const { profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const handleProfileClick = () => {
    if (!profile) {
      setShowSetup(true);
    } else {
      setProfileOpen((o) => !o);
    }
  };

  const initials = profile
    ? (profile.full_name ?? "?").split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()
    : null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/97 backdrop-blur-md border-b border-[#DDD9D2] shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
            : "bg-[#F5F4F0]/92 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-7 h-7 bg-[#0D1421] rounded-[5px] flex items-center justify-center">
                <span className="text-white text-xs font-bold tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>S</span>
              </div>
              <span className="text-[#0D1421] font-semibold text-[15px] tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                FounderBridge
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 py-1.5 text-[13.5px] font-medium rounded-md transition-colors duration-150 group ${
                    isActive(link.to)
                      ? "text-[#2557D6]"
                      : "text-[#374151] hover:text-[#0D1421] hover:bg-[#0D1421]/[0.04]"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#2557D6] rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/contact"
                className="px-3 py-1.5 text-[13px] font-medium text-[#4B5563] hover:text-[#0D1421] transition-colors rounded-md hover:bg-[#0D1421]/[0.04]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Contact
              </Link>
              <Link
                to="/submit-idea"
                className="text-[13px] font-medium text-[#0D1421] border border-[#D5D1CA] px-3.5 py-1.5 rounded-[6px] hover:border-[#0D1421] hover:bg-[#0D1421]/[0.03] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Submit Idea
              </Link>
              <Link
                to="/build-saas"
                className="text-[13px] font-medium bg-[#2557D6] text-white px-3.5 py-1.5 rounded-[6px] hover:bg-[#1E4AB8] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Build SaaS
              </Link>

              {/* Profile icon */}
              <div className="relative ml-1">
                <button
                  onClick={handleProfileClick}
                  className={`w-8 h-8 rounded-full border transition-all duration-150 hover:scale-[1.03] hover:shadow-sm flex items-center justify-center overflow-hidden ${
                    profile
                      ? "bg-[#0D1421] border-[#0D1421] text-white text-[11px] font-bold"
                      : "bg-white border-[#D5D1CA] text-[#6B7280] hover:border-[#0D1421] hover:text-[#0D1421]"
                  }`}
                  aria-label="Profile"
                >
                  {profile ? (
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{initials}</span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  )}
                </button>

                {profileOpen && profile && (
                  <ProfileDropdown onClose={() => setProfileOpen(false)} />
                )}
              </div>
            </div>

            {/* Mobile: profile icon + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={handleProfileClick}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                  profile
                    ? "bg-[#0D1421] border-[#0D1421] text-white text-[11px] font-bold"
                    : "bg-white border-[#D5D1CA] text-[#6B7280]"
                }`}
                aria-label="Profile"
              >
                {profile ? (
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{initials}</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                )}
              </button>
              <button
                className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-[#F0F0EE] transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span className="flex flex-col gap-[5px] w-5">
                  <span className={`block h-[1.5px] bg-[#0D1421] transition-transform origin-center ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
                  <span className={`block h-[1.5px] bg-[#0D1421] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
                  <span className={`block h-[1.5px] bg-[#0D1421] transition-transform origin-center ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-[#E5E5E2] shadow-lg">
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-3 text-[14px] font-medium border-b border-[#F0F0EE] last:border-b-0 ${
                    isActive(link.to) ? "text-[#2557D6]" : "text-[#374151]"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/contact" className="text-[14px] font-medium text-[#4B5563] py-2" style={{ fontFamily: "'Inter', sans-serif" }}>Contact</Link>
                <Link
                  to="/submit-idea"
                  className="text-center text-[14px] font-medium text-[#0D1421] border border-[#D5D1CA] px-4 py-2.5 rounded-[6px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Submit Idea
                </Link>
                <Link
                  to="/build-saas"
                  className="text-center text-[14px] font-medium bg-[#2557D6] text-white px-4 py-2.5 rounded-[6px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Build SaaS
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Setup Modal */}
      {showSetup && <ProfileSetupModal onClose={() => setShowSetup(false)} />}
    </>
  );
}
