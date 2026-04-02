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
          const res = await fetch(`${API_BASE}/locations`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
          });

          if (!res.ok) {
            if (res.status === 401) throw new Error("Unauthorized — check backend CORS or JWT");
            throw new Error(`Failed to fetch locations (${res.status})`);
          }

          const data = await res.json();
          const locs = data.data || data; // adapt depending on API
          setLocations(locs);
          if (locs.length > 0) setLocationId(locs[0].locationId.toString());
        } catch (err: any) {
          console.error(err);
          toast.error(err.message || "Could not load locations");
        }
      };

      fetchLocations();
    }
  }, [isOpen, mode]);

  // --- 2. HANDLE LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.data?.token || result.token);
        toast.success("Welcome back!");
        onClose();
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. HANDLE SIGNUP ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationId) return toast.error("Please select a location");

    setLoading(true);
    const formData = new FormData();

    const requestPayload = JSON.stringify({
      fullname,
      email,
      password,
      phone,
      address,
      locationId: parseInt(locationId),
    });

    formData.append("request", requestPayload);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Account created! Please sign in.");
        setMode("login");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
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
            className="relative w-full max-w-[850px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100"
          >
            {/* Left Side */}
            <div className="hidden md:flex w-1/3 bg-slate-50 p-10 flex-col justify-between border-r border-slate-100">
              <div>
                <div className="w-10 h-10 bg-blue-600 rounded-xl mb-6 shadow-lg shadow-blue-200" />
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  Join the community of experts.
                </h3>
              </div>
              <img
                src="https://illustrations.popsy.co/amber/student-going-to-school.svg"
                className="w-full opacity-60"
                alt="auth-art"
              />
            </div>

            {/* Right Side Form */}
            <div className="flex-1 p-8 md:p-12 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end mb-2">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-w-[340px] mx-auto">
                <h2 className="text-2xl font-black text-slate-900 mb-1">
                  {mode === "login" ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-slate-400 text-sm mb-8">
                  {mode === "login"
                    ? "Please enter your details."
                    : "Fill in your information to register."}
                </p>

                <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
                  {mode === "signup" && (
                    <>
                      <div className="flex justify-center mb-6">
                        <label className="relative group cursor-pointer">
                          <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400 group-hover:bg-blue-50">
                            {avatar ? (
                              <img
                                src={URL.createObjectURL(avatar)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Camera className="text-slate-300 group-hover:text-blue-400" size={24} />
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>

                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          required
                          type="text"
                          placeholder="Full Name"
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
                        />
                      </div>
                    </>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
                    />
                  </div>

                  {mode === "signup" && (
                    <>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          required
                          type="tel"
                          placeholder="Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
                        />
                      </div>

                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                          required
                          value={locationId}
                          onChange={(e) => setLocationId(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none text-sm appearance-none transition-all"
                        >
                          <option value="">Select Location</option>
                          {locations.map((loc) => (
                            <option key={loc.locationId} value={loc.locationId}>
                              {loc.locationName}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          size={16}
                        />
                      </div>

                      <input
                        required
                        type="text"
                        placeholder="Detail Address (House #, Street)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
                      />
                    </>
                  )}

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
                    />
                  </div>

                  <button
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : mode === "login" ? "Sign In" : "Create Account"}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-sm font-bold text-blue-600 hover:underline transition-all"
                  >
                    {mode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
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