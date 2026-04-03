import * as React from "react";
import { X, Mail, Lock, User, Phone, MapPin, Camera, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Location {
  locationId: number;
  locationName: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [loading, setLoading] = React.useState(false);

  // Data states
  const [locations, setLocations] = React.useState<Location[]>([]);

  // Form states
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [locationId, setLocationId] = React.useState<string>("");
  const [avatar, setAvatar] = React.useState<File | null>(null);

  const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

  // --- 1. FETCH LOCATIONS ---
  React.useEffect(() => {
    if (isOpen && mode === "signup") {
      const fetchLocations = async () => {
        try {
          const res = await fetch(`${API_BASE}/public/locations`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          const locs = data.data || data;
          setLocations(locs);
          if (locs.length > 0) setLocationId(locs[0].locationId.toString());
        } catch (err) {
          console.error("Location fetch error:", err);
        }
      };
      fetchLocations();
    }
  }, [isOpen, mode]);

  // --- 2. SHARED LOGIN LOGIC ---
  const executeLogin = async (loginEmail: string, loginPass: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPass }),
    });
    const result = await res.json();
    if (res.ok) {
      localStorage.setItem("token", result.data?.token || result.token);
      return true;
    }
    return false;
  };

  // --- 3. HANDLE LOGIN BUTTON ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await executeLogin(email, password);
      if (success) {
        toast.success("Welcome back!");
        onClose();
        window.location.href = "/"; // Redirect & Refresh Navbar
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. HANDLE SIGNUP (WITH AUTO-LOGIN) ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationId) return toast.error("Please select a location");

    setLoading(true);
    const formData = new FormData();
    const requestPayload = JSON.stringify({
      fullname, email, password, phone, address,
      locationId: parseInt(locationId),
    });

    formData.append("request", requestPayload);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Account created! Logging you in...");
        // Auto-login after successful registration
        const loginSuccess = await executeLogin(email, password);
        if (loginSuccess) {
          onClose();
          window.location.href = "/"; // Go to home immediately
        } else {
          setMode("login"); // Fallback if auto-login fails
        }
      } else {
        const result = await res.json();
        toast.error(result.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Server error during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-[800px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100"
          >
            {/* Left Side Info (Small Scale) */}
            <div className="hidden md:flex w-[280px] bg-slate-50 p-8 flex-col justify-between border-r border-slate-100 shrink-0">
              <div>
                <div className="w-8 h-8 bg-blue-600 rounded-lg mb-4 shadow-md shadow-blue-100" />
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  Start your learning journey today.
                </h3>
              </div>
              <img
                src="https://illustrations.popsy.co/amber/student-going-to-school.svg"
                className="w-full opacity-50 grayscale"
                alt="auth-art"
              />
            </div>

            {/* Right Side Form */}
            <div className="flex-1 p-6 md:p-10 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-end mb-1">
                <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="max-w-[320px] mx-auto">
                <h2 className="text-xl font-black text-slate-900 mb-1">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-slate-400 text-[12px] mb-6">
                  {mode === "login" ? "Enter your credentials to continue." : "Join our community for free."}
                </p>

                <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-3">
                  {mode === "signup" && (
                    <div className="flex justify-center mb-4">
                      <label className="relative group cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400">
                          {avatar ? (
                            <img src={URL.createObjectURL(avatar)} className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="text-slate-300" size={20} />
                          )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
                      </label>
                    </div>
                  )}

                  {mode === "signup" && (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input required type="text" placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl outline-none text-[13px] border border-transparent focus:border-blue-500/20 transition-all" />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl outline-none text-[13px] border border-transparent focus:border-blue-500/20 transition-all" />
                  </div>

                  {mode === "signup" && (
                    <>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input required type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl outline-none text-[13px] border border-transparent focus:border-blue-500/20 transition-all" />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select required value={locationId} onChange={(e) => setLocationId(e.target.value)}
                          className="w-full pl-10 pr-8 py-2.5 bg-slate-50 rounded-xl outline-none text-[13px] appearance-none border border-transparent focus:border-blue-500/20 transition-all">
                          <option value="">Select Location</option>
                          {locations.map((loc) => (<option key={loc.locationId} value={loc.locationId}>{loc.locationName}</option>))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      </div>
                    </>
                  )}

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl outline-none text-[13px] border border-transparent focus:border-blue-500/20 transition-all" />
                  </div>

                  <button disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[13px] shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={16} /> : (mode === "login" ? "Sign In" : "Register Now")}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-all">
                    {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}