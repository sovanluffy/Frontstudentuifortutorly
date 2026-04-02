import * as React from "react";
import { Search, Menu, Globe, Smartphone } from "lucide-react";
import { AuthModal } from "./AuthModal"; // Make sure path is correct

export const Navbar = ({ onToggle }: { onToggle: () => void }) => {
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between z-[100] sticky top-0">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={onToggle} className="p-1.5 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors">
            <Menu size={20} className="text-[#0F294D]" />
          </button>
          <span className="text-2xl font-black text-[#0066FF] tracking-tighter cursor-pointer">
            Tutor<span className="text-[#0F294D]">Hub</span>
          </span>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 items-center bg-gray-50 border border-gray-200 rounded-md overflow-hidden focus-within:border-blue-400 focus-within:bg-white transition-all">
          <input 
            type="text" 
            placeholder="Search destinations, tutors, or courses..." 
            className="w-full px-4 py-1.5 text-[13px] bg-transparent outline-none" 
          />
          <button className="bg-[#0066FF] p-2 text-white hover:bg-blue-700 transition-colors">
            <Search size={14} strokeWidth={3} />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-5 text-[#455873] text-[13px] font-medium">
          <button className="flex items-center gap-1 hover:text-[#0066FF] transition-colors">
            <Smartphone size={16}/> App
          </button>
          <button className="hidden lg:block hover:text-[#0066FF] transition-colors">
            List your property
          </button>
          <button className="flex items-center gap-1 border-l pl-4 font-bold text-[#0F294D]">
            <Globe size={16}/> USD
          </button>
          
          {/* Sign In Button - Triggers Modal */}
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="bg-[#0066FF] text-white px-4 py-1.5 rounded-md font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
          >
            Sign in/register
          </button>
        </div>
      </nav>

      {/* Pop-up Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </>
  );
};