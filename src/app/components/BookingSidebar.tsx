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
  CheckCircle2 // Added for success icon
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import { toast, Toaster } from "sonner"; // 1. Import Sonner

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

  // Check if the error is specifically about an existing booking
  const isDuplicateError = error?.includes("PENDING") || error?.includes("CONFIRMED");

  // 2. Enhanced Submit Handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only show "sending" toast if no duplicate error
    if (!isDuplicateError) {
      toast.loading("Sending request to tutor...", { id: "booking-status" });
    }
    
    onSubmit(e);
  };

  // 3. Optional: Trigger toast when error changes
  React.useEffect(() => {
    if (error && open) {
      toast.error("Booking failed", {
        description: error,
        id: "booking-status", // Replaces the loading toast
      });
    }
  }, [error, open]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* TOASTER - Place this here or in your Root Layout */}
      <Toaster position="top-center" richColors />

      {/* BACKDROP */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* MODAL CONTENT */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* HEADER */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <div>
            <h3 className="font-black text-2xl text-slate-900 tracking-tight">Complete Booking</h3>
            <p className="text-slate-400 text-sm font-medium">Finalize your request to the tutor</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleFormSubmit} className="p-8 pt-4 space-y-6">
          
          {/* TELEGRAM INPUT */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              <Send size={14} className="text-indigo-500" />
              Telegram Handle
            </label>
            <input
              required
              disabled={isDuplicateError || loading}
              type="text"
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 disabled:opacity-50"
              placeholder="@yourusername"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
          </div>

          {/* NOTE TEXTAREA */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              <MessageSquare size={14} className="text-indigo-500" />
              Note to Tutor
            </label>
            <textarea
              disabled={isDuplicateError || loading}
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[120px] resize-none placeholder:text-slate-300 text-sm leading-relaxed disabled:opacity-50"
              placeholder="e.g. I want to focus on Algebra basics..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* INTERNAL ERROR BOX (KEEPING FOR EXTRA CLARITY) */}
          {error && (
            <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 
              ${isDuplicateError ? "bg-amber-50 border border-amber-100 text-amber-700" : "bg-red-50 border border-red-100 text-red-600"}`}>
              {isDuplicateError ? <AlertCircle size={18} className="shrink-0 mt-0.5" /> : <Info size={18} className="shrink-0 mt-0.5" />}
              <p className="text-xs font-bold leading-relaxed">
                {isDuplicateError 
                  ? "You already have an active request. Please wait for tutor response." 
                  : error}
              </p>
            </div>
          )}

          {/* TRUST BADGE */}
          {!isDuplicateError && (
            <div className="bg-emerald-50/50 p-4 rounded-2xl flex gap-3 items-center border border-emerald-100/50">
              <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-tighter">Secure Request</p>
                <p className="text-[10px] text-emerald-700/70 font-medium leading-tight">
                  Tutor will be notified instantly of your interest.
                </p>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold border-none transition-all"
            >
              {isDuplicateError ? "Close" : "Cancel"}
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading || isDuplicateError} 
              className={`py-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                loading || isDuplicateError
                  ? "bg-slate-300 cursor-not-allowed shadow-none" 
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Processing...</span>
                </>
              ) : isDuplicateError ? (
                "Requested"
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Confirm</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* BOTTOM DECORATION */}
        <div className={`h-2 w-full transition-colors duration-500 ${isDuplicateError ? "bg-amber-400" : loading ? "bg-indigo-300" : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"}`} />
      </div>
    </div>
  );
}