import * as React from "react";
import { Search, Menu, Globe, Smartphone, User, LogOut, ChevronRight } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

export const Navbar = ({ onToggle }: { onToggle: () => void }) => {
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // Function to check if user is authenticated
  // We check both LocalStorage and Cookies for maximum reliability
  const checkAuth = React.useCallback(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  // Initial check on component mount
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle Logout logic
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove("token");
    setIsLoggedIn(false);
    // Redirect to home and refresh to clear any private states
    window.location.href = "/";
  };

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-100 px-4 py-1.5 flex items-center justify-between z-[100] sticky top-0 h-12">
        
        {/* LEFT SECTION: Hamburger Menu & Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onToggle} 
            className="p-1 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
          >
            <Menu size={18} className="text-[#0F294D]" />
          </button>
          <Link to="/" className="text-xl font-black text-[#0066FF] tracking-tighter cursor-pointer select-none">
            Tutor<span className="text-[#0F294D]">Hub</span>
          </Link>
        </div>

        {/* CENTER SECTION: Search Bar (Desktop Only) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 items-center bg-gray-50 border border-gray-200 rounded-md overflow-hidden focus-within:border-blue-400 focus-within:bg-white transition-all h-8">
          <input 
            type="text" 
            placeholder="Search for tutors..." 
            className="w-full px-3 py-1 text-[12px] bg-transparent outline-none" 
          />
          <button className="bg-[#0066FF] h-full px-3 text-white hover:bg-blue-700 transition-colors shrink-0">
            <Search size={13} strokeWidth={3} />
          </button>
        </div>

        {/* RIGHT SECTION: Navigation Actions & Auth State */}
        <div className="flex items-center gap-4 text-[#455873] text-[12px] font-medium shrink-0">
          <button className="hidden sm:flex items-center gap-1 hover:text-[#0066FF] transition-colors">
            <Smartphone size={14}/> App
          </button>
          
          <div className="h-4 w-[1px] bg-gray-200 mx-1 hidden sm:block" />
          
          <button className="flex items-center gap-1 font-bold text-[#0F294D]">
            <Globe size={14}/> USD
          </button>
          
          {/* --- DYNAMIC AUTH UI --- */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {/* Profile Navigation Link */}
              <Link 
                to="/profile"
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-all group"
              >
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <User size={11} className="text-white" />
                </div>
                <span className="font-black text-[#0F294D] text-[11px]">My Profile</span>
                <ChevronRight size={12} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              
              {/* Logout Action */}
              <button 
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            /* Sign In Button - Triggers Modal */
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="bg-[#0066FF] text-white px-4 py-1 rounded-md font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95 whitespace-nowrap text-[12px]"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={checkAuth} // This updates the Navbar UI immediately on login
      />
    </>
  );
};