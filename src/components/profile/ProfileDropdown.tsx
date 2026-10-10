import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "../../services/authService";

const roleLabel: Record<string, string> = {
  student:        "Student / Founder",
  investor:       "Investor",
  business_owner: "Business Owner",
  general_user:   "General User",
  admin:          "Admin",
};

const roleLinks: Record<string, { label: string; to: string }[]> = {
  student:        [{ label: "Feed", to: "/feed" }, { label: "Messages", to: "/messages" }, { label: "My Ideas", to: "/startups" }, { label: "My Account", to: "/account" }],
  investor:       [{ label: "Feed", to: "/feed" }, { label: "Messages", to: "/messages" }, { label: "Startup Discovery", to: "/startups" }, { label: "My Account", to: "/account" }],
  business_owner: [{ label: "Feed", to: "/feed" }, { label: "Messages", to: "/messages" }, { label: "SaaS Solutions", to: "/saas" }, { label: "My Account", to: "/account" }],
  general_user:   [{ label: "Feed", to: "/feed" }, { label: "Messages", to: "/messages" }, { label: "My Account", to: "/account" }],
  admin:          [{ label: "Feed", to: "/feed" }, { label: "Admin Panel", to: "/admin" }, { label: "My Account", to: "/account" }],
};

interface Props { onClose: () => void }

export default function ProfileDropdown({ onClose }: Props) {
  const { profile } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (!profile) return null;

  const initials = (profile.full_name ?? "?").split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
  const links = roleLinks[profile.role] ?? roleLinks.general_user;

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-[220px] bg-white border border-[#DDD9D2] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-50 overflow-hidden"
      style={{ animation: "dropdownIn 0.18s cubic-bezier(0.16,1,0.3,1) both" }}>

      {/* User header */}
      <div className="px-4 py-3.5 border-b border-[#F0EDE8]">
        <div className="flex items-center gap-3">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#0D1421] flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#0D1421] truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{profile.full_name}</p>
            <p className="text-[11px] text-[#9CA3AF] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{roleLabel[profile.role] ?? profile.role}</p>
          </div>
        </div>
      </div>

      {/* Role-specific links */}
      <div className="px-2 py-1.5">
        {links.map((link) => (
          <Link key={link.to} to={link.to} onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F5F4F0] transition-colors text-[13px] text-[#4B5563]"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Settings + logout */}
      <div className="px-2 py-1.5 border-t border-[#F0EDE8]">
        <Link to="/account" onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F5F4F0] transition-colors text-[13px] text-[#4B5563]"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          Settings
        </Link>
        <button onClick={async () => { await signOut(); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#FEF2F2] transition-colors text-[13px] text-[#DC2626]"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
          Log out
        </button>
      </div>
    </div>
  );
}
