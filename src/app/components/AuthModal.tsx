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
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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
  const { login } = useAuth(); // 🔥 IMPORTANT FIX

  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [loading, setLoading] = React.useState(false);
  const [locations, setLocations] = React.useState<Location[]>([]);

  // form state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullname, setFullname] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [locationId, setLocationId] = React.useState("");
  const [avatar, setAvatar] = React.useState<File | null>(null);

  const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

  /* ================= FETCH LOCATIONS ================= */
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
          console.error(err);
        }
      };

      fetchLocations();
    }
  }, [isOpen, mode]);

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // 🔥 CRITICAL FIX: ONE LINE DOES EVERYTHING
        login(data.token);

        toast.success("Welcome back!");

        onClose();
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SIGNUP ================= */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
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
        toast.success("Account created!");

        // 🔥 auto login after signup
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.token) {
          login(loginData.token); // 🔥 instant role update
          onClose();
        }
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-[800px] bg-white rounded-2xl shadow-2xl flex overflow-hidden"
          >
            {/* LEFT PANEL */}
            <div className="hidden md:flex w-[280px] bg-slate-50 p-8 flex-col justify-between border-r">
              <div>
                <div className="w-8 h-8 bg-blue-600 rounded-lg mb-4" />
                <h3 className="font-bold text-lg">
                  Start your learning journey
                </h3>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 p-8 max-h-[85vh] overflow-y-auto">
              {/* CLOSE */}
              <div className="flex justify-end">
                <button onClick={onClose}>
                  <X />
                </button>
              </div>

              <h2 className="text-xl font-bold mb-4">
                {mode === "login" ? "Login" : "Sign Up"}
              </h2>

              <form
                onSubmit={mode === "login" ? handleLogin : handleSignup}
                className="space-y-3"
              >
                {/* FULLNAME */}
                {mode === "signup" && (
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" />
                    <input
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Full Name"
                      className="w-full pl-10 p-2 bg-gray-50 rounded"
                    />
                  </div>
                )}

                {/* EMAIL */}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full pl-10 p-2 bg-gray-50 rounded"
                  />
                </div>

                {/* PHONE */}
                {mode === "signup" && (
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone"
                      className="w-full pl-10 p-2 bg-gray-50 rounded"
                    />
                  </div>
                )}

                {/* LOCATION */}
                {mode === "signup" && (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" />
                    <select
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="w-full pl-10 p-2 bg-gray-50 rounded"
                    >
                      <option value="">Select Location</option>
                      {locations.map((l) => (
                        <option key={l.locationId} value={l.locationId}>
                          {l.city} - {l.district}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* PASSWORD */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 p-2 bg-gray-50 rounded"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  disabled={loading}
                  className="w-full bg-blue-600 text-white p-3 rounded"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : mode === "login" ? (
                    "Login"
                  ) : (
                    "Register"
                  )}
                </button>
              </form>

              {/* SWITCH MODE */}
              <p
                onClick={() =>
                  setMode(mode === "login" ? "signup" : "login")
                }
                className="text-center text-sm mt-4 cursor-pointer text-blue-600"
              >
                {mode === "login"
                  ? "Create account"
                  : "Already have account?"}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}