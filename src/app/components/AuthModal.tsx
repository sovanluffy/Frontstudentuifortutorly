"use client";

import * as React from "react";
import {
  X, Mail, Lock, User, Phone, MapPin, Camera,
  Loader2, ChevronRight, ShieldCheck, ImagePlus
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

/* ================= VALIDATION HELPERS ================= */
const validateEmail = (val: string): string => {
  if (!val) return "Email is required.";
  if (!val.includes("@")) return "Email must contain @.";
  const domain = val.split("@")[1] || "";
  if (!domain) return "Email must have a domain after @.";
  if (!domain.includes(".")) return "Email domain must contain a dot (e.g. gmail.com).";
  return "";
};

const validatePhone = (val: string): string => {
  if (!val) return "Phone is required.";
  if (!/^\d+$/.test(val)) return "Phone must contain digits only.";
  if (val[0] !== "0") return "Phone must start with 0.";
  if (val.length < 6 || val.length > 9) return "Phone must be 6–9 digits.";
  return "";
};

const validateFullname = (val: string): string => {
  if (!val) return "Full name is required.";
  if (val.trim().length < 4) return "Name must be at least 4 characters.";
  return "";
};

const validatePassword = (val: string): string => {
  if (!val) return "Password is required.";
  if (val.length < 6) return "Password must be at least 6 characters.";
  return "";
};

/* ================= FIELD ERROR ================= */
function FieldError({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <p className="text-[11px] font-semibold text-red-500 mt-1 ml-1 flex items-center gap-1">
      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
      {msg}
    </p>
  );
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();

  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [loading, setLoading] = React.useState(false);
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [preview, setPreview] = React.useState<string | null>(null);

  // Form state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [locationId, setLocationId] = React.useState("");
  const [avatar, setAvatar] = React.useState<File | null>(null);

  // Touched state — only show errors after user has interacted
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  // Derived errors
  const errors = {
    fullname: validateFullname(fullname),
    email: validateEmail(email),
    phone: validatePhone(phone),
    password: validatePassword(password),
    locationId: !locationId ? "Please select a location." : "",
  };

  const touch = (field: string) =>
    setTouched((p) => ({ ...p, [field]: true }));

  const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  React.useEffect(() => {
    if (isOpen && mode === "signup") {
      const fetchLocations = async () => {
        try {
          const res = await fetch(`${API_BASE}/locations`);
          const data = await res.json();
          setLocations(Array.isArray(data) ? data : []);
          if (Array.isArray(data) && data.length > 0)
            setLocationId(String(data[0].locationId));
        } catch (err) {
          console.error("Location fetch error", err);
        }
      };
      fetchLocations();
    }
  }, [isOpen, mode]);

  // Reset form when switching mode
  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setEmail(""); setPassword(""); setFullname("");
    setPhone(""); setLocationId(""); setPreview(null); setAvatar(null);
    setTouched({});
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (errors.email || errors.password) return;

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
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SIGNUP ================= */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullname: true, email: true, phone: true, password: true, locationId: true });

    if (errors.fullname || errors.email || errors.phone || errors.password || errors.locationId)
      return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("request", JSON.stringify({
        fullname, email, password, phone, locationId: Number(locationId),
      }));
      if (avatar) formData.append("avatar", avatar);

      const res = await fetch(`${API_BASE}/auth/register`, { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) { login(loginData.token); onClose(); }
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch {
      toast.error("Server error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full pl-10 p-2.5 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all text-sm font-medium ${
      touched[field] && errors[field as keyof typeof errors]
        ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <Toaster richColors position="top-center" />

          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[850px] bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200"
          >
            {/* LEFT SIDEBAR */}
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

            {/* RIGHT SIDE */}
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
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">

                {/* AVATAR */}
                {mode === "signup" && (
                  <div className="flex flex-col items-center mb-6">
                    <label className="relative group cursor-pointer">
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group-hover:border-indigo-500 transition-all">
                        {preview
                          ? <img src={preview} className="w-full h-full object-cover" />
                          : <ImagePlus className="text-slate-400 group-hover:text-indigo-500" size={24} />}
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
                  <div>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        onBlur={() => touch("fullname")}
                        placeholder="Full Name"
                        className={inputCls("fullname")}
                      />
                    </div>
                    {touched.fullname && <FieldError msg={errors.fullname} />}
                  </div>
                )}

                {/* EMAIL */}
                <div>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => touch("email")}
                      placeholder="Email Address"
                      className={inputCls("email")}
                    />
                  </div>
                  {touched.email && <FieldError msg={errors.email} />}
                </div>

                {/* PHONE + LOCATION */}
                {mode === "signup" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onBlur={() => touch("phone")}
                          placeholder="Phone"
                          className={inputCls("phone")}
                        />
                      </div>
                      {touched.phone && <FieldError msg={errors.phone} />}
                    </div>
                    <div>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <select
                          value={locationId}
                          onChange={(e) => setLocationId(e.target.value)}
                          onBlur={() => touch("locationId")}
                          className={inputCls("locationId") + " appearance-none"}
                        >
                          <option value="">Location</option>
                          {locations.map((l) => (
                            <option key={l.locationId} value={l.locationId}>{l.city}</option>
                          ))}
                        </select>
                      </div>
                      {touched.locationId && <FieldError msg={errors.locationId} />}
                    </div>
                  </div>
                )}

                {/* PASSWORD */}
                <div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => touch("password")}
                      placeholder="Password"
                      className={inputCls("password")}
                    />
                  </div>
                  {touched.password && <FieldError msg={errors.password} />}
                </div>

                {/* SUBMIT */}
                <button
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all disabled:opacity-70 active:scale-[0.98]"
                >
                  {loading
                    ? <Loader2 className="animate-spin" size={18} />
                    : <>{mode === "login" ? "Sign In" : "Register Now"}<ChevronRight size={16} /></>}
                </button>
              </form>

              {/* SWITCH MODE */}
              <div className="mt-8 text-center">
                <button
                  onClick={switchMode}
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