import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TabProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export function FilterTab({ label, icon: Icon, isActive, onClick }: TabProps) {
  return (
    <li 
      onClick={onClick}
      className={cn(
        // Reduced padding from px-5 py-2.5 to px-4 py-1.5
        // Removed scale-105 to prevent size jumping
        "flex items-center gap-2 px-4 py-1.5 cursor-pointer transition-all duration-200 rounded-t-lg relative",
        isActive 
          ? "bg-white text-[#0F294D]" 
          : "text-white/90 hover:bg-white/10"
      )}
    >
      {/* Reduced icon size from 18 to 16 */}
      <Icon size={16} className={isActive ? "text-[#0066FF]" : "text-white/70"} />
      
      {/* Reduced font size from 14px to 13px */}
      <span className="text-[13px] font-bold whitespace-nowrap">{label}</span>

      {/* Optional: Subtle bottom indicator for active state if you want it to look "locked in" */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0066FF] hidden" />
      )}
    </li>
  );
}