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
        "flex items-center gap-2 px-5 py-2.5 cursor-pointer transition-all duration-200 rounded-full my-1 mx-1",
        isActive 
          ? "bg-white text-[#0F294D] shadow-lg scale-105" // Active State
          : "text-white hover:bg-white/10"                // Inactive State
      )}
    >
      <Icon size={18} className={isActive ? "text-[#0066FF]" : "text-white/80"} />
      <span className="text-[14px] font-bold whitespace-nowrap">{label}</span>
    </li>
  );
}