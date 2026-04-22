"use client";

import React from "react";
import { 
  X, 
  Info, 
  ShieldCheck, 
  Send, 
  Loader2, 
  MessageSquare 
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";

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
  // Return null if not open to keep the DOM clean
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
        <form onSubmit={onSubmit} className="p-8 pt-4 space-y-6">
          
          {/* TELEGRAM INPUT */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              <Send size={14} className="text-indigo-500" />
              Telegram Handle
            </label>
            <input
              required
              type="text"
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
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
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[120px] resize-none placeholder:text-slate-300 text-sm leading-relaxed"
              placeholder="e.g. I want to focus on Algebra basics..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 text-red-600 animate-shake">
              <Info size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-relaxed">{error}</p>
            </div>
          )}

          {/* TRUST BADGE */}
          <div className="bg-indigo-50/50 p-4 rounded-2xl flex gap-3 items-center border border-indigo-100/50">
            <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-tighter">Verified Booking</p>
              <p className="text-[10px] text-indigo-700/70 font-medium leading-tight">
                Your payment is held securely until the tutor confirms.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="py-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold border-none"
            >
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading} 
              className={`py-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                loading 
                  ? "bg-indigo-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Processing...</span>
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </form>

        {/* BOTTOM DECORATION */}
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      </div>
    </div>
  );
}