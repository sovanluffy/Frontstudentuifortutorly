import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Globe, Sparkles, Camera, X } from "lucide-react";

export default function Signup() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-orange-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row min-h-[800px] border border-slate-100"
      >
        
        {/* LEFT SIDE: FORM */}
        <div className="md:w-[45%] p-10 md:p-16 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-10">
             <Link to="/" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                <ArrowRight className="rotate-180 text-slate-400" size={20} />
             </Link>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Already member? <Link to="/login" className="text-[#5D5FEF] hover:underline">Sign in</Link>
             </p>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Sign Up</h1>
            <p className="text-slate-400 font-medium mb-8">បញ្ចូលរូបភាព និងព័ត៌មានរបស់អ្នក</p>

            <form className="space-y-6">
              
              {/* --- AVATAR UPLOAD SECTION --- */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-50 overflow-hidden bg-slate-100 flex items-center justify-center shadow-inner transition-all group-hover:border-[#5D5FEF]/20">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-slate-300" />
                    )}
                  </div>
                  
                  {/* Upload Trigger */}
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-[#5D5FEF] text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-[#F57C00] transition-colors active:scale-90">
                    <Camera size={16} />
                    <input 
                      id="avatar-upload"
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>

                  {/* Remove Button */}
                  {preview && (
                    <button 
                      onClick={removeAvatar}
                      className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full shadow-md p-1 hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Profile Picture</span>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {[
                  { icon: <User size={18}/>, label: "Full Name", type: "text" },
                  { icon: <Mail size={18}/>, label: "Email Address", type: "email" },
                  { icon: <Lock size={18}/>, label: "Password", type: "password" },
                ].map((field, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute left-0 top-3 text-slate-300 group-focus-within:text-[#5D5FEF] transition-colors">
                      {field.icon}
                    </div>
                    <input 
                      type={field.type} 
                      placeholder={field.label}
                      className="w-full pl-8 py-3 border-b border-slate-100 outline-none focus:border-[#5D5FEF] transition-all placeholder:text-slate-200 font-medium text-sm"
                    />
                  </div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-xs tracking-[0.2em] uppercase shadow-lg shadow-slate-200 flex items-center justify-center gap-3 mt-10 hover:bg-[#F57C00] transition-colors group"
              >
                Create Account 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </form>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black mt-8">
            <Globe size={14} />
            <span className="tracking-widest uppercase">Global Academy Standard</span>
          </div>
        </div>

        {/* RIGHT SIDE: CARTOON ANIMATION */}
        <div className="md:w-[55%] bg-[#5D5FEF] relative flex items-center justify-center p-12 overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-10%] w-[550px] h-[550px] bg-white/10 rounded-full blur-[90px]"
          />
          <div className="relative z-10 w-full flex flex-col items-center">
             <motion.div 
               animate={{ y: [0, -15, 0], rotate: [0, 1, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="w-full max-w-[380px]"
             >
                <img 
                  src="https://illustrations.popsy.co/amber/student-going-to-school.svg" 
                  alt="Illustration"
                  className="w-full h-auto brightness-110 drop-shadow-[0_30px_50px_rgba(0,0,0,0.3)]"
                />
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.6 }}
               className="mt-12 bg-white/95 backdrop-blur-md rounded-[2rem] p-5 w-full max-w-[300px] border border-white shadow-2xl"
             >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-slate-900 leading-tight">Fastest Registration</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3D Experience Included</p>
                  </div>
                </div>
             </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}