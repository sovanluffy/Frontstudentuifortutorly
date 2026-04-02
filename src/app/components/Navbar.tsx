import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// CRITICAL FIX: AnimatePresence must be inside these braces
import { motion, AnimatePresence } from "framer-motion"; 
import { 
  Menu, X, Bell, Home, GraduationCap, 
  BookOpen, CalendarCheck, MapPin, ChevronDown, 
  BookOpenText, User, Mail, Lock, Camera, 
  ArrowRight, Sparkles, Globe 
} from "lucide-react";

// --- 1. AUTH MODAL COMPONENT (The Pop-up) ---
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] bg-white rounded-[2.5rem] overflow-hidden z-[210] flex flex-col md:flex-row shadow-2xl border border-white/20"
          >
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute right-6 top-6 z-[220] p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all active:scale-90"
            >
              <X size={20} className="text-slate-600" />
            </button>

            {/* LEFT: FORM SECTION */}
            <div className="md:w-1/2 p-10 md:p-14 bg-white flex flex-col justify-center">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">ចូលប្រើប្រាស់</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Log in or Sign up in seconds</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {/* Avatar Circle */}
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-50 overflow-hidden bg-slate-100 flex items-center justify-center shadow-inner transition-all group-hover:border-[#5D5FEF]/30">
                      {preview ? (
                        <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={30} className="text-slate-300" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#5D5FEF] text-white p-1.5 rounded-full shadow-lg cursor-pointer hover:bg-[#F57C00] transition-colors">
                      <Camera size={14} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                <div className="relative group border-b border-slate-100 focus-within:border-[#5D5FEF] transition-all">
                  <Mail className="absolute left-0 top-3 text-slate-300 group-focus-within:text-[#5D5FEF]" size={16} />
                  <input type="email" placeholder="Email Address" className="w-full pl-8 py-3 outline-none text-sm font-medium bg-transparent" />
                </div>

                <div className="relative group border-b border-slate-100 focus-within:border-[#5D5FEF] transition-all">
                  <Lock className="absolute left-0 top-3 text-slate-300 group-focus-within:text-[#5D5FEF]" size={16} />
                  <input type="password" placeholder="Password" className="w-full pl-8 py-3 outline-none text-sm font-medium bg-transparent" />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-xl hover:bg-[#F57C00] transition-all mt-4"
                >
                  Continue to Academy
                </motion.button>
              </form>

              <div className="mt-8 flex items-center gap-2 text-slate-300 justify-center">
                <Globe size={12} />
                <span className="text-[9px] font-black tracking-widest uppercase">Global Security Standard</span>
              </div>
            </div>

            {/* RIGHT: BLUE ANIMATION SECTION */}
            <div className="hidden md:flex md:w-1/2 bg-[#5D5FEF] relative items-center justify-center p-12 overflow-hidden">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"
              />
              
              <div className="relative z-10 w-full flex flex-col items-center">
                <motion.div 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img 
                    src="https://illustrations.popsy.co/amber/student-going-to-school.svg" 
                    alt="Hero"
                    className="w-full max-w-[280px] brightness-110 drop-shadow-2xl" 
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-10 bg-white/95 backdrop-blur-md rounded-[1.5rem] p-4 w-full max-w-[260px] border border-white shadow-2xl flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-[12px] font-black text-slate-900 leading-tight">Secure Learning</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Safe & Encrypted</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- 2. MAIN NAVBAR COMPONENT ---
export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = isMobileOpen || isAuthOpen ? "hidden" : "unset";
  }, [isMobileOpen, isAuthOpen]);

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Find Tutors", path: "/search", icon: <GraduationCap size={18} /> },
    { name: "Subjects", path: "/subjects", icon: <BookOpen size={18} /> },
    { name: "Bookings", path: "/bookings", icon: <CalendarCheck size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="w-full bg-[#2D3D6A] text-white sticky top-0 z-[100] shadow-xl font-sans">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          <div className="flex-1 hidden lg:flex items-center gap-6">
            <button onClick={() => setIsAuthOpen(true)} className="text-[10px] font-black tracking-widest hover:text-[#F57C00] transition-colors">LOGIN</button>
            <button onClick={() => setIsAuthOpen(true)} className="bg-[#F57C00] px-5 py-2 rounded-lg text-[10px] font-black tracking-widest hover:bg-[#e67600] transition-all active:scale-95">SIGN UP</button>
          </div>

          <button className="lg:hidden p-2 hover:bg-white/10 rounded-lg" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="src/image/logogo.png" alt="Logo" className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
              <div className="text-center leading-tight">
                <span className="block text-2xl font-black tracking-tighter uppercase">Tutor<span className="text-[#F57C00]">Hub</span></span>
                <span className="block text-[9px] font-bold tracking-[0.3em] text-[#1E88E5] uppercase">Academy</span>
              </div>
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-lg text-[10px] font-bold hover:bg-white/20 transition">
              <BookOpenText size={14} />
              <span>COURSES</span>
            </button>
            <button className="p-2 bg-white/10 rounded-full relative hover:bg-white/20 transition">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#F57C00] rounded-full"></span>
            </button>
          </div>
        </div>

        <nav className="border-t border-white/5 bg-black/10 hidden lg:block">
          <div className="container mx-auto px-4 flex items-center justify-between py-2.5">
            <ul className="flex items-center gap-10">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={`flex items-center gap-2 text-[11px] font-black tracking-widest transition-all uppercase ${isActive(item.path) ? "text-[#F57C00]" : "text-gray-300 hover:text-white"}`}>
                    <span className={isActive(item.path) ? "text-[#F57C00]" : "text-[#1E88E5]"}>{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-[10px] font-black text-[#F57C00] cursor-pointer hover:brightness-125 transition-all">
              <MapPin size={14} />
              <span className="tracking-widest uppercase">All Locations</span>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              className="fixed inset-0 bg-[#2D3D6A] z-[105] flex flex-col pt-24 px-8 gap-6 lg:hidden"
            >
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileOpen(false)} className="text-xl font-black flex items-center gap-5 border-b border-white/5 pb-4 uppercase tracking-widest">
                  <span className="text-[#1E88E5]">{item.icon}</span> {item.name}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <button onClick={() => { setIsAuthOpen(true); setIsMobileOpen(false); }} className="w-full bg-white/10 py-4 rounded-xl font-black text-sm tracking-widest uppercase">Login</button>
                <button onClick={() => { setIsAuthOpen(true); setIsMobileOpen(false); }} className="w-full bg-[#F57C00] py-4 rounded-xl font-black text-white text-sm tracking-widest uppercase shadow-lg">Sign Up</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* RENDER THE AUTH MODAL */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}