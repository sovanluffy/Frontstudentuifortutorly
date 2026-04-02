import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand/Info */}
        <div className="md:w-1/2 bg-[#2D3D6A] p-10 text-white flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <img src="src/image/logogo.png" alt="Logo" className="w-12 h-12" />
            <h2 className="text-3xl font-bold">Tutor<span className="text-[#F57C00]">Hub</span></h2>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-gray-300 mb-8">Log in to access your dashboard, schedule new lessons, and chat with your tutors.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-[#F57C00] flex items-center justify-center">✓</div>
              <span>Track your learning progress</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-[#F57C00] flex items-center justify-center">✓</div>
              <span>Manage your bookings 24/7</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-[#2D3D6A] mb-2">Login</h2>
          <p className="text-gray-500 mb-8 text-sm">Enter your details to access your account.</p>
          
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F57C00] focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F57C00] focus:border-transparent outline-none transition"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-[#2D3D6A]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <a href="#" className="text-xs font-bold text-[#1E88E5] hover:underline">Forgot password?</a>
              </div>
            </div>

            <button className="w-full bg-[#2D3D6A] text-white py-3 rounded-lg font-bold hover:bg-[#1e2a4a] transition-all flex items-center justify-center gap-2 group">
              Login Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-600">
            Don't have an account? 
            <Link to="/signup" className="text-[#F57C00] font-bold ml-1 hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}