"use client";

import * as React from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Camera,
  Loader2,
  ChevronRight,
  ShieldCheck,
  ImagePlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import { useAuth } from "@/context/AuthContext";

/* ================= TYPES ================= */
interface Location {
  locationId: number;
  city: string;
  district: string;
  fullAddress: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();

  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [loading, setLoading] = React.useState(false);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [preview, setPreview] = React.useState<string | null>(null);

  // Form State
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [locationId, setLocationId] = React.useState("");
  const [avatar, setAvatar] = React.useState<File | null>(null);

  const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

  /* ================= HANDLERS ================= */
  
  // Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Fetch Locations
  React.useEffect(() => {
    if (isOpen && mode === "signup") {
      const fetchLocations = async () => {
        try {
          const res = await fetch(`${API_BASE}/locations`);
          const data = await res.json();
          setLocations(Array.isArray(data) ? data : []);
          if (Array.isArray(data) && data.length > 0) {
            setLocationId(String(data[0].locationId));
          }
        } catch (err) {
          console.error("Location fetch error", err);
        }
      };
      fetchLocations();
    }
  }, [isOpen, mode]);

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        login(data.token);
        toast.success("Welcome back!");
        onClose();
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SIGNUP ================= */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname || !email || !password || !phone || !locationId) {
        return toast.error("Please fill all required fields");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const request = {
        fullname,
        email,
        password,
        phone,
        locationId: Number(locationId),
      };

      formData.append("request", JSON.stringify(request));
      if (avatar) formData.append("avatar", avatar);

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        
        // Auto Login
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          login(loginData.token);
          onClose();
        }
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Server error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <Toaster richColors position="top-center" />
          
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* MODAL CONTAINER */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[850px] bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200"
          >
            {/* LEFT SIDEBAR (Marketing) */}
            <div className="hidden md:flex w-[320px] bg-indigo-600 p-10 flex-col justify-between text-white">
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center mb-8">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-2xl font-black leading-tight tracking-tight">
                  Join the <br /> Community.
                </h3>
                <p className="mt-4 text-indigo-100 text-sm font-medium leading-relaxed">
                  Access premium classes, chat with expert tutors, and track your learning progress in one place.
                </p>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                © 2026 TutorHub Cambodia
              </div>
            </div>

            {/* RIGHT SIDE (Form) */}
            <div className="flex-1 p-8 md:p-12 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    {mode === "login" ? "Enter your details to continue." : "Fill in the info to get started."}
                  </p>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
                
                {/* AVATAR UPLOAD (Signup only) */}
                {mode === "signup" && (
                  <div className="flex flex-col items-center mb-6">
                    <label className="relative group cursor-pointer">
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group-hover:border-indigo-500 transition-all">
                        {preview ? (
                          <img src={preview} className="w-full h-full object-cover" />
                        ) : (
                          <ImagePlus className="text-slate-400 group-hover:text-indigo-500" size={24} />
                        )}
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      <div className="absolute -bottom-2 -right-2 bg-white shadow-md p-1.5 rounded-lg text-indigo-600 border border-slate-100">
                        <Camera size={14} />
                      </div>
                    </label>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">Upload Profile Photo</span>
                  </div>
                )}

                {/* FULLNAME */}
                {mode === "signup" && (
                  <div className="space-y-1">
                    <div className="relative group">
                      <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        placeholder="Full Name"
                        className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* EMAIL */}
                <div className="space-y-1">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* SIGNUP EXTRA FIELDS */}
                {mode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative group">
                        <Phone className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone"
                          className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                        />
                      </div>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <select
                          value={locationId}
                          onChange={(e) => setLocationId(e.target.value)}
                          className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium appearance-none"
                        >
                          <option value="">Location</option>
                          {locations.map((l) => (
                            <option key={l.locationId} value={l.locationId}>
                              {l.city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* PASSWORD */}
                <div className="space-y-1">
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Register Now"}
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* FOOTER SWITCH */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {mode === "login"
                    ? "Don't have an account? Sign Up"
                    : "Already registered? Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}