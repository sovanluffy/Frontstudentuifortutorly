import {
  Search,
  BookOpenText,
  User,
  Bell,
  Home,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  ChevronDown,
  Menu,
  X,
  MapPin
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Prevent scrolling when the full-screen menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Find Tutors", path: "/tutors", icon: <GraduationCap size={20} /> },
    { name: "Subjects", path: "/subjects", icon: <BookOpen size={20} /> },
    { name: "Bookings", path: "/bookings", icon: <CalendarCheck size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-[#2D3D6A] text-white sticky top-0 z-[100] shadow-xl font-sans">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Left: Search Bar (Desktop) */}
        <div className="flex-1 hidden lg:flex items-center">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search tutors..."
              className="bg-white/10 border border-white/20 rounded-full py-1.5 px-4 pl-10 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#F57C00] transition-all placeholder:text-gray-300"
            />
            <Search className="absolute left-3 top-2 w-4 h-4 text-gray-300" />
          </div>
        </div>

        {/* Mobile Menu Toggle (Z-index high to stay above overlay) */}
        <button 
          className="lg:hidden p-2 hover:bg-white/10 rounded-md z-[110] relative" 
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <Link to="/" className="group flex items-center gap-3">
            <img 
              src="src/image/logogo.png" 
              alt="TutorHub Logo" 
              className="w-10 h-10 object-contain" 
            /> 
            <div className="text-center leading-tight">
              <span className="block text-2xl font-bold text-white tracking-tight">
                Tutor<span className="text-[#F57C00]">Hub</span>
              </span>
              <span className="block text-xs font-semibold tracking-[0.2em] text-[#1E88E5] uppercase">
                Academy
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4">
          <button className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/20 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-white/10 transition">
            <BookOpenText size={16} className="text-gray-200" />
            <span>Courses</span>
          </button>
          
          <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 relative transition">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F57C00] rounded-full border-2 border-[#2D3D6A]"></span>
          </button>

          <div className="flex items-center gap-1 cursor-pointer hover:text-[#F57C00] transition ml-2">
            <span className="text-xs font-bold uppercase tracking-wider">🇬🇧 EN</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* --- DESKTOP SECONDARY NAV --- */}
      <nav className="border-t border-white/5 bg-black/10 hidden lg:block">
        <div className="container mx-auto px-4 flex items-center justify-between py-2.5">
          <ul className="flex items-center gap-10">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 text-[13px] font-bold tracking-wide transition-colors ${
                    isActive(item.path) ? "text-[#F57C00]" : "text-gray-200 hover:text-white"
                  }`}
                >
                  <span className={isActive(item.path) ? "text-[#F57C00]" : "text-[#1E88E5]"}>
                    {item.icon}
                  </span>
                  {item.name.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 text-[13px] font-bold cursor-pointer text-[#F57C00]">
            <MapPin size={18} />
            <span>All Locations</span>
          </div>
        </div>
      </nav>

      {/* --- FULL SCREEN MOBILE OVERLAY --- */}
      <div 
        className={`fixed inset-0 bg-[#2D3D6A] z-[105] flex flex-col transition-transform duration-500 ease-in-out lg:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-8 gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => setOpen(false)}
              className="text-2xl font-bold flex items-center gap-6 border-b border-white/10 pb-4 hover:text-[#F57C00] transition"
            >
              <span className="text-[#1E88E5]">{item.icon}</span> 
              {item.name}
            </Link>
          ))}
          
          <div className="mt-4 flex flex-col gap-4">
            <button className="flex items-center justify-center gap-3 bg-white/10 py-4 rounded-xl font-bold">
              <User size={20} /> Login / Join
            </button>
            <button className="bg-[#F57C00] py-4 rounded-xl font-bold text-white text-lg shadow-lg">
              Book a Lesson
            </button>
          </div>

          <div className="mt-auto mb-10 flex justify-center gap-4 text-gray-400 text-sm">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </header>
  );
}