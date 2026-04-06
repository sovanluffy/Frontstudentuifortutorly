import * as React from "react";
import { X, Mail, Lock, User, Phone, MapPin, Camera, Loader2, ChevronDown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Location {
  id: number; // Changed to 'id' to match standard Backend naming
  city: string;
  district: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [loading, setLoading] = React.useState(false);
  const [locLoading, setLocLoading] = React.useState(false);

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

  // --- 1. FETCH LOCATIONS (With Error Handling) ---
  React.useEffect(() => {
    if (isOpen && mode === "signup") {
      const fetchLocations = async () => {
        setLocLoading(true);
        try {
          const res = await fetch(`${API_BASE}/public/locations`);
          
          if (res.status === 503) {
            toast.error("Server is waking up, please wait a moment...");
            return;
          }

          const result = await res.json();
          // Logic to handle wrapped or unwrapped data
          const locs = result.data || result; 
          setLocations(Array.isArray(locs) ? locs : []);
        } catch (err) {
          console.error("Location fetch error:", err);
          toast.error("Could not connect to server");
        } finally {
          setLocLoading(false);
        }
      };
      fetchLocations();
    }
  }, [isOpen, mode]);

  // --- 2. EXECUTE LOGIN ---
  const executeLogin = async (loginEmail: string, loginPass: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const result = await res.json();
      if (res.ok) {
        const token = result.data?.token || result.token;
        localStorage.setItem("token", token);
        return true;
      }
      toast.error(result.message || "Invalid credentials");
      return false;
    } catch (err) {
      toast.error("Server is currently unavailable (503)");
      return false;
    }
  };

  // --- 3. HANDLE LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await executeLogin(email, password);
    if (success) {
      toast.success("Welcome back!");
      onClose();
      window.location.reload(); // Refresh to update Auth state globally
    }
    setLoading(false);
  };

  // --- 4. HANDLE SIGNUP ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationId) return toast.error("Please select a location");

    setLoading(true);
    const formData = new FormData();
    
    // Blob required for Multipart JSON in Spring Boot
    const requestBlob = new Blob([JSON.stringify({
      fullname, email, password, phone, address,
      locationId: parseInt(locationId),
    })], { type: "application/json" });

    formData.append("request", requestBlob);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        body: formData, // No Content-Type header! Browser sets it for FormData
      });

      if (res.ok) {
        toast.success("Registration successful!");
        await executeLogin(email, password);
        onClose();
        window.location.reload();
      } else {
        const result = await res.json();
        toast.error(result.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Connection failed. Server might be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-[800px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
            
            {/* Left Decor */}
            <div className="hidden md:flex w-[280px] bg-slate-50 p-8 flex-col justify-between border-r border-slate-100 shrink-0">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">Master new skills with expert tutors.</h3>
              <img src="https://illustrations.popsy.co/amber/student-going-to-school.svg" className="w-full opacity-60" alt="art" />
            </div>

            {/* Right Form */}
            <div className="flex-1 p-6 md:p-10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end mb-2">
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
              </div>

              <div className="max-w-[340px] mx-auto">
                <h2 className="text-2xl font-black text-slate-900 mb-1">{mode === "login" ? "Sign In" : "Register"}</h2>
                <p className="text-slate-500 text-sm mb-8">{mode === "login" ? "Access your learning dashboard." : "Create your account in seconds."}</p>

                <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
                  {mode === "signup" && (
                    <>
                      <div className="flex justify-center mb-6">
                        <label className="relative cursor-pointer group">
                          <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group-hover:border-blue-500 transition-all">
                            {avatar ? <img src={URL.createObjectURL(avatar)} className="w-full h-full object-cover" /> : <Camera className="text-slate-400" />}
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
                        </label>
                      </div>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input required placeholder="Full Name" value={fullname} onChange={(e) => setFullname(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>
                    </>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>

                  {mode === "signup" && (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input required placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:border-blue-500 outline-none transition-all text-sm" />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select required value={locationId} onChange={(e) => setLocationId(e.target.value)} className="w-full pl-12 pr-10 py-3 bg-slate-50 rounded-xl border border-transparent focus:border-blue-500 outline-none appearance-none transition-all text-sm">
                          <option value="">{locLoading ? "Loading..." : "Select Location"}</option>
                          {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.city} - {loc.district}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-transparent focus:border-blue-500 outline-none transition-all text-sm" />
                  </div>

                  <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === "login" ? "Sign In" : "Create Account")}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    {mode === "login" ? "New to TutorHub? Sign Up" : "Already have an account? Sign In"}
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