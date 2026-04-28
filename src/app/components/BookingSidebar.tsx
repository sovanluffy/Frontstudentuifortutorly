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
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigateLogin?: () => void;  // called when user needs to login
  telegram: string;
  setTelegram: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error?: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingSidebar({
  open,
  onClose,
  onNavigateLogin,
  telegram,
  setTelegram,
  note,
  setNote,
  onSubmit,
  loading,
  error,
}: Props) {
  if (!open) return null;

  // Detect duplicate booking errors (user already has a pending/confirmed booking)
  const isDuplicateError =
    !!error &&
    (error.toLowerCase().includes("pending") || error.toLowerCase().includes("confirmed"));

  // Detect login/auth error
  const isAuthError =
    !!error &&
    (error.toLowerCase().includes("login") ||
      error.toLowerCase().includes("unauthorized") ||
      error.toLowerCase().includes("token"));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegram.trim()) {
      toast.error("Telegram handle is required", {
        description: "Please enter your @username to continue.",
      });
      return;
    }
    if (!telegram.trim().startsWith("@")) {
      toast.error("Invalid Telegram handle", {
        description: "Your handle must start with @ (e.g. @username).",
      });
      return;
    }
    onSubmit(e);
  };

  // Progress bar width based on state
  const progressWidth = loading ? "50%" : isDuplicateError ? "100%" : "100%";
  const progressColor = loading
    ? "bg-indigo-400"
    : isDuplicateError
    ? "bg-amber-400"
    : isAuthError
    ? "bg-red-400"
    : "bg-indigo-600";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="px-7 pt-7 pb-4 flex justify-between items-start">
          <div>
            <h3 className="font-black text-xl text-slate-900 tracking-tight leading-none mb-1">
              Reserve a Spot
            </h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Enrollment Details
            </p>
          </div>
          <button
            onClick={!loading ? onClose : undefined}
            disabled={loading}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="px-7 pb-7 pt-2 space-y-4">

          {/* Telegram Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <Send size={11} className="text-indigo-500" />
              Your Telegram Handle <span className="text-red-500">*</span>
            </label>
            <input
              required
              disabled={loading || isDuplicateError || isAuthError}
              type="text"
              className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="@username"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
          </div>

          {/* Note Textarea */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
              <MessageSquare size={11} className="text-indigo-500" />
              Special Note <span className="text-slate-300 font-normal">(optional)</span>
            </label>
            <textarea
              disabled={loading || isDuplicateError || isAuthError}
              className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[90px] resize-none placeholder:text-slate-300 text-sm font-medium leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Tell the tutor about your goals..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Error Message Block */}
          {error && (
            <div
              className={`p-3.5 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200 ${
                isDuplicateError
                  ? "bg-amber-50 border border-amber-100 text-amber-700"
                  : isAuthError
                  ? "bg-red-50 border border-red-100 text-red-700"
                  : "bg-red-50 border border-red-100 text-red-600"
              }`}
            >
              {isDuplicateError ? (
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
              ) : (
                <Info size={15} className="shrink-0 mt-0.5" />
              )}
              <p className="text-[11px] font-bold leading-snug">
                {isDuplicateError
                  ? "You already have a pending or confirmed request for this session. Check your bookings page."
                  : isAuthError
                  ? "You are not logged in. Please sign in to complete your booking."
                  : error}
              </p>
            </div>
          )}

          {/* Trust / Shield Notice — only show when no duplicate/auth error */}
          {!isDuplicateError && !isAuthError && (
            <div className="bg-indigo-50/60 p-3.5 rounded-xl flex gap-3 items-center border border-indigo-100/60">
              <ShieldCheck size={16} className="text-indigo-500 shrink-0" />
              <p className="text-[10px] text-indigo-700 font-semibold leading-snug">
                Your information is only shared with the tutor to facilitate the class connection.
              </p>
            </div>
          )}

          {/* Auth Error Login Prompt */}
          {isAuthError && (
            <div className="bg-red-50 p-3.5 rounded-xl flex flex-col gap-3 border border-red-100">
              <div className="flex gap-3 items-center">
                <Lock size={16} className="text-red-500 shrink-0" />
                <p className="text-[11px] text-red-700 font-semibold leading-snug">
                  Please log in or create an account to enroll in this class.
                </p>
              </div>
              {onNavigateLogin && (
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black tracking-widest uppercase transition-all"
                >
                  Go to Login →
                </button>
              )}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              onClick={!loading ? onClose : undefined}
              disabled={loading}
              className="flex-1 py-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest border-none transition-all disabled:opacity-50"
            >
              {isDuplicateError ? "Close" : "Cancel"}
            </Button>

            <Button
              type="submit"
              disabled={loading || isDuplicateError || isAuthError}
              className={`flex-[1.6] py-6 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all ${
                loading || isDuplicateError || isAuthError
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 active:scale-95 text-white"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={15} />
                  <span>Sending...</span>
                </>
              ) : isDuplicateError ? (
                <>
                  <AlertCircle size={15} />
                  <span>Already Requested</span>
                </>
              ) : isAuthError ? (
                <>
                  <Lock size={15} />
                  <span>Login Required</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Confirm Booking</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Bottom progress bar decoration */}
        <div className="flex h-1.5 w-full">
          <div
            className={`h-full transition-all duration-700 ${progressColor}`}
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </div>
  );
}