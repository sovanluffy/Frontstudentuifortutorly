"use client";

import React from "react";
import { 
  X, 
  Info, 
  ShieldCheck, 
  Send, 
  Loader2, 
  MessageSquare,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import { toast, Toaster } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  telegram: string;
  setTelegram: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error?: string | null;
}

export default function BookingSidebar({
  open,
  onClose,
  telegram,
  setTelegram,
  note,
  setNote,
  onSubmit,
  loading,
  error,
}: Props) {
  
  if (!open) return null;

  // Detect if the user is trying to book something they already requested
  const isDuplicateError = error?.toLowerCase().includes("pending") || error?.toLowerCase().includes("confirmed");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegram.trim()) {
      toast.error("Telegram handle is required");
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Notifications container */}
      <Toaster position="top-center" richColors />

      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* MODAL CONTAINER */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* TOP HEADER */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <div>
            <h3 className="font-black text-2xl text-slate-900 tracking-tight leading-none mb-2">Reserve Spot</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Enrollment Details</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleFormSubmit} className="p-8 pt-4 space-y-5">
          
          {/* TELEGRAM INPUT */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">
              <Send size={12} className="text-indigo-500" />
              Your Telegram Handle
            </label>
            <input
              required
              disabled={loading || isDuplicateError}
              type="text"
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 text-[13px] font-medium disabled:opacity-50"
              placeholder="@username"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
          </div>

          {/* NOTE TEXTAREA */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">
              <MessageSquare size={12} className="text-indigo-500" />
              Special Note (Optional)
            </label>
            <textarea
              disabled={loading || isDuplicateError}
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[100px] resize-none placeholder:text-slate-300 text-[13px] font-medium leading-relaxed disabled:opacity-50"
              placeholder="Tell the tutor about your goals..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* DYNAMIC ERROR MESSAGE */}
          {error && (
            <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 
              ${isDuplicateError ? "bg-amber-50 border border-amber-100 text-amber-700" : "bg-red-50 border border-red-100 text-red-600"}`}>
              {isDuplicateError ? <AlertCircle size={16} className="shrink-0 mt-0.5" /> : <Info size={16} className="shrink-0 mt-0.5" />}
              <p className="text-[11px] font-bold leading-tight">
                {isDuplicateError 
                  ? "You have already sent a request for this session. Please check your bookings page." 
                  : error}
              </p>
            </div>
          )}

          {/* TRUST INDICATOR */}
          {!isDuplicateError && (
            <div className="bg-indigo-50/50 p-4 rounded-2xl flex gap-3 items-center border border-indigo-100/50">
              <ShieldCheck size={18} className="text-indigo-600 shrink-0" />
              <p className="text-[10px] text-indigo-700 font-bold leading-tight">
                Your information is only shared with the tutor to facilitate the class connection.
              </p>
            </div>
          )}

          {/* FOOTER BUTTONS */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest border-none transition-all"
            >
              {isDuplicateError ? "Close" : "Cancel"}
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading || isDuplicateError} 
              className={`flex-[1.5] py-6 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${
                loading || isDuplicateError
                  ? "bg-slate-300 cursor-not-allowed shadow-none" 
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 active:scale-95 text-white"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : isDuplicateError ? (
                "Already Requested"
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Confirm Booking</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* PROGRESS BAR DECORATION */}
        <div className="flex h-1.5 w-full">
            <div className={`h-full transition-all duration-700 ${loading ? 'w-1/2 bg-indigo-400' : isDuplicateError ? 'w-full bg-amber-400' : 'w-full bg-indigo-600'}`} />
        </div>
      </div>
    </div>
  );
}