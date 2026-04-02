import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Globe, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Backdrop (Blurred background) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          />

          {/* 2. Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] bg-white rounded-[2rem] overflow-hidden z-[210] flex flex-col md:flex-row shadow-2xl shadow-black/20"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 z-50 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-600" />
            </button>

            {/* LEFT SIDE: AUTH OPTIONS */}
            <div className="md:w-1/2 p-10 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
                Log in or sign up <br/> in seconds
              </h2>
              <p className="text-slate-500 text-sm mb-8 font-medium">
                ប្រើប្រាស់អ៊ីមែល ឬគណនីផ្សេងទៀតដើម្បីបន្តជាមួយ TutorHub។
              </p>

              <div className="space-y-3 w-full">
                {/* Social Buttons */}
                <button className="w-full border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  Continue with Google
                </button>
                
                <button className="w-full border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
                  Continue with Facebook
                </button>

                <button className="w-full border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-3 font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  <Mail size={20} className="text-slate-400" />
                  Continue with Email
                </button>
              </div>

              <div className="mt-8 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                  Academy Standard Security
                </span>
              </div>
            </div>

            {/* RIGHT SIDE: IMAGE/ANIMATION */}
            <div className="hidden md:flex md:w-1/2 bg-[#5D5FEF] relative items-center justify-center p-12">
              <div className="relative z-10 text-center text-white">
                 <motion.div 
                    animate={{ y: [0, -10, 0] }} 
                    transition={{ duration: 4, repeat: Infinity }}
                 >
                    <img 
                      src="https://illustrations.popsy.co/amber/student-going-to-school.svg" 
                      alt="Login Illustration"
                      className="w-full max-w-[300px] brightness-110 drop-shadow-2xl"
                    />
                 </motion.div>
                 
                 <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <p className="text-sm font-bold italic">"រៀនឱ្យបានពូកែ ដើម្បីអនាគតខ្លួនឯង"</p>
                 </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}