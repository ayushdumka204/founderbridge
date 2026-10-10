interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "muted";
  size?: "sm" | "md";
}

const variants = {
  default: "bg-[#0D1421] text-white",
  accent: "bg-[#EEF2FF] text-[#2557D6]",
  success: "bg-[#DCFCE7] text-[#16A34A]",
  warning: "bg-[#FEF3C7] text-[#D97706]",
  muted: "bg-[#F0F0EE] text-[#6B7280]",
};

export default function Badge({ children, variant = "muted", size = "sm" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-[4px] ${variants[variant]} ${size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-[12px]"}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {children}
    </span>
  );
}
