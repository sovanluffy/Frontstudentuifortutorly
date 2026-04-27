"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Plus, Users, Edit3, Loader2, Copy, Trash2,
  LayoutGrid, List, AlertTriangle, X, Search,
  Mail, GraduationCap, Calendar, DollarSign,
  ArrowUpRight, Tag, ChevronRight, Lock,
  PlayCircle, StopCircle, Star, MessageSquare,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import TutorEditPage from "@/app/pages/tutor/edit/TutorEditPage";

const API_BASE = import.meta.env.VITE_API_BASE as string;

/* ─────────────────────────────────────────
   TYPES & INTERFACES
───────────────────────────────────────── */
interface Review {
  id: number;
  comment: string;
  rating: number;
  studentName: string;
  studentAvatar: string | null;
  classTitle: string | null;
  createdAt: string;
}

interface ReviewData {
  tutorId: number;
  classId: number | null;
  classTitle: string | null;
  averageRating: number;
  totalReviewer: number;
  reviews: Review[];
}

interface BookedSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface Student {
  studentId: number;
  studentName: string;
  avatar: string | null;
  email: string;
  bookedSchedule: BookedSchedule;
}

interface Schedule {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  maxStudents: number | null;
  bookedCount: number;
}

interface Tutor {
  tutorId: number;
  name: string;
  avatar: string | null;
  rating: number;
  email: string;
  phone: string;
}

interface OpenClass {
  classId: number;
  title: string;
  description: string;
  classImage: string | null;
  status: "OPEN" | "CLOSED" | string;
  visibilityStatus: string | null;
  startDate: string | null;
  endDate: string | null;
  durationType: string | null;
  durationValue: number | null;
  tutor: Tutor;
  location: string;
  specificAddress: string;
  subjects: string[];
  learningModes: string[];
  basePrice: number;
  maxStudents: number;
  currentStudents: number;
  confirmedStudents: Student[];
  schedules: Schedule[];
  isCopy: boolean | null;
  originalClassId: number | null;
  new: boolean;
}

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "danger" | "primary";
  confirmText: string;
  onConfirm: () => void;
}

interface StudentModalState {
  isOpen: boolean;
  students: Student[];
  title: string;
}

interface ReviewModalState {
  isOpen: boolean;
  data: ReviewData | null;
  title: string;
  loading: boolean;
}

/* ─────────────────────────────────────────
   EDIT CLASS MODAL — wraps TutorEditPage
   Opens as a full-height slide-up sheet.
   Pass classId=null to close.
───────────────────────────────────────── */
interface EditClassModalProps {
  classId: number | null;
  onClose: () => void;
  onSaved: () => void; // refresh list after save
}

const EditClassModal: React.FC<EditClassModalProps> = ({ classId, onClose, onSaved }) => {
  const { t } = useLanguage();
  if (classId === null) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="
          relative bg-white w-full max-w-4xl
          rounded-t-3xl sm:rounded-3xl
          h-[95vh] sm:h-[90vh]
          flex flex-col overflow-hidden
          shadow-2xl shadow-slate-900/20
          animate-in slide-in-from-bottom sm:zoom-in-95 duration-300
        "
      >
        {/* Drag handle / modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            {/* Drag pill (mobile) */}
            <div className="sm:hidden w-10 h-1 rounded-full bg-slate-300 absolute top-3 left-1/2 -translate-x-1/2" />
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Edit3 size={16} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t("កែប្រែថ្នាក់", "Edit Class")}
              </h2>
              <p className="text-xs text-slate-400">
                {t("ធ្វើបច្ចុប្បន្នភាពព័ត៌មានថ្នាក់", "Update class information")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-8 h-8 flex items-center justify-center
              rounded-xl hover:bg-slate-100
              text-slate-400 hover:text-slate-700
              transition-colors
            "
          >
            <X size={18} />
          </button>
        </div>

        {/*
          Scrollable body — TutorEditPage renders here.
          We pass the classId via URL params by faking the router param
          through a wrapper, OR (simpler) TutorEditPage accepts a prop.

          If TutorEditPage reads classId from useParams(), use the
          MemoryRouter approach below.  If it accepts a prop directly,
          just pass classId={classId}.

          ── Option A: TutorEditPage accepts classId + onSuccess props ──
        */}
        <div className="flex-1 overflow-y-auto">
          <TutorEditPage
            classId={classId}
            onSuccess={() => {
              onSaved();   // refresh the class list
              onClose();   // close the modal
            }}
          />
        </div>
      </div>
    </div>
  );
};

/*
  ── Option B: TutorEditPage reads classId from useParams() only ──

  If you cannot modify TutorEditPage to accept props, replace the
  <TutorEditPage /> line above with a MemoryRouter shim:

  import { MemoryRouter, Route, Routes } from "react-router-dom";

  <MemoryRouter initialEntries={[`/tutor/edit/${classId}`]}>
    <Routes>
      <Route path="/tutor/edit/:classId" element={<TutorEditPage />} />
    </Routes>
  </MemoryRouter>

  And intercept the navigate("/back") call inside TutorEditPage by
  wrapping it in a NavigationInterceptor that calls onClose() instead.
*/

/* ─────────────────────────────────────────
   TOOLTIP WRAPPER
───────────────────────────────────────── */
interface TipProps {
  label: string;
  children: React.ReactNode;
}

const Tip: React.FC<TipProps> = ({ label, children }) => (
  <span className="relative group/tip inline-flex">
    {children}
    <span className="
      pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
      px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap
      bg-slate-900 text-white shadow-lg
      opacity-0 scale-95 group-hover/tip:opacity-100 group-hover/tip:scale-100
      transition-all duration-150 z-50
    ">
      {label}
      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
    </span>
  </span>
);

/* ─────────────────────────────────────────
   REVIEW MODAL
───────────────────────────────────────── */
interface ReviewListModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReviewData | null;
  title: string;
  loading: boolean;
}

const ReviewListModal: React.FC<ReviewListModalProps> = ({
  isOpen, onClose, data, title, loading,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg h-[82vh] sm:h-auto sm:max-h-[80vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Star size={18} className="fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t("មតិយោបល់", "Reviews")}
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">{title}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-indigo-500 mb-3" size={28} />
              <p className="text-slate-400 text-xs font-medium">{t("កំពុងផ្ទុក…", "Loading reviews…")}</p>
            </div>
          ) : (data?.reviews?.length ?? 0) > 0 ? (
            <>
              <div className="flex items-center justify-around bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">{Number(data!.averageRating).toFixed(1)}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t("ពិន្ទុមធ្យម", "avg rating")}</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-900">{data!.totalReviewer}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t("អ្នកវាយតម្លៃ", "reviewers")}</p>
                </div>
              </div>
              {data!.reviews.map((rev: Review) => (
                <div key={rev.id} className="bg-white border border-slate-100 rounded-2xl p-4 hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={rev.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.studentName)}&background=6366f1&color=fff&bold=true`}
                      className="w-9 h-9 rounded-xl object-cover" alt=""
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{rev.studentName}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"} />
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <MessageSquare size={40} className="text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm font-medium">{t("មិនទាន់មានមតិយោបល់", "No reviews yet")}</p>
            </div>
          )}
        </div>

        <div className="shrink-0 p-4 border-t border-slate-100 pb-8 sm:pb-4">
          <button onClick={onClose} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors">
            {t("បិទ", "Close")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   CONFIRM MODAL
───────────────────────────────────────── */
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  type?: "danger" | "primary";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, onClose, onConfirm, title, message, confirmText, type = "danger",
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        <div className="p-8 text-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${type === "danger" ? "bg-rose-50" : "bg-indigo-50"}`}>
            {type === "danger" ? <AlertTriangle size={26} className="text-rose-500" /> : <Copy size={26} className="text-indigo-500" />}
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-4 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors">
            {t("បោះបង់", "Cancel")}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-4 text-sm font-semibold text-white transition-colors ${type === "danger" ? "bg-rose-500 hover:bg-rose-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {confirmText || t("បញ្ជាក់", "Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   STUDENT LIST MODAL
───────────────────────────────────────── */
interface StudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  classTitle: string;
}

const StudentListModal: React.FC<StudentListModalProps> = ({ isOpen, onClose, students, classTitle }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg h-[82vh] sm:h-auto sm:max-h-[75vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <GraduationCap size={18} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t("បញ្ជីសិស្ស", "Student list")}</h3>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">{classTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {students?.length > 0 ? students.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
              <img
                src={s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.studentName)}&background=6366f1&color=fff&bold=true`}
                className="w-10 h-10 rounded-xl object-cover shrink-0" alt=""
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{s.studentName}</p>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                  <Mail size={11} /><span className="truncate">{s.email}</span>
                </div>
              </div>
              {s.bookedSchedule && (
                <div className="flex items-center gap-1.5 bg-indigo-100/60 text-indigo-700 px-3 py-1.5 rounded-xl shrink-0">
                  <Calendar size={12} />
                  <span className="text-[11px] font-semibold">{s.bookedSchedule.day} · {s.bookedSchedule.startTime?.slice(0, 5)}</span>
                </div>
              )}
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Users size={40} className="text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm font-medium">{t("មិនទាន់មានសិស្សសិក្សា", "No students enrolled yet")}</p>
            </div>
          )}
        </div>

        <div className="shrink-0 p-4 border-t border-slate-100 pb-8 sm:pb-4">
          <button onClick={onClose} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors">
            {t("រួចរាល់", "Done")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   SHARED CARD PROPS TYPE
───────────────────────────────────────── */
interface CardProps {
  c: OpenClass;
  actionId: number | null;
  onToggle: (id: number, status: string) => void;
  onCopy: (id: number) => void;
  onDelete: (c: OpenClass) => void;
  onStudents: (c: OpenClass) => void;
  onReviews: (id: number, title: string) => void;
  onNavigate: (path: string) => void;
  onEdit: (classId: number) => void; // ← NEW: opens edit modal
}

/* ─────────────────────────────────────────
   CLASS CARD (Grid / Mobile)
───────────────────────────────────────── */
const ClassCard: React.FC<CardProps> = ({
  c, actionId, onToggle, onCopy, onDelete, onStudents, onReviews, onNavigate, onEdit,
}) => {
  const { t } = useLanguage();
  const isOpen = c.status === "OPEN";
  const hasStudents = c.currentStudents > 0;

  return (
    <div className={`group bg-white rounded-3xl border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/8 hover:-translate-y-0.5 ${isOpen ? "border-slate-200" : "border-slate-100 opacity-90"}`}>
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-100">
        {c.classImage ? (
          <img src={c.classImage} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isOpen ? "grayscale-[0.4]" : ""}`} alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap size={40} className="text-indigo-200" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-600 shadow-sm">
            <Tag size={10} /> {c.subjects?.[0]}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-sm ${isOpen ? "bg-emerald-500 text-white" : "bg-slate-600 text-white"}`}>
            {isOpen ? t("បើក", "Open") : t("បិទ", "Closed")}
          </span>
        </div>
        <Tip label={t("មើលមតិ", "View class reviews")}>
          <button
            onClick={() => onReviews(c.classId, c.title)}
            className="absolute top-3 right-3 flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-sm transition-colors"
          >
            <Star size={11} className="fill-white" />
            {Number(c.tutor?.rating ?? 0).toFixed(1)}
          </button>
        </Tip>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">{c.title}</h3>
          <Tip label={isOpen ? t("បិទការចុះឈ្មោះ", "Close enrollment") : t("បើកការចុះឈ្មោះ", "Reopen enrollment")}>
            <button
              onClick={() => onToggle(c.classId, c.status)}
              disabled={actionId === c.classId}
              className={`shrink-0 p-2 rounded-xl transition-all ${isOpen ? "text-amber-500 hover:bg-amber-50" : "text-indigo-500 hover:bg-indigo-50"}`}
            >
              {actionId === c.classId ? <Loader2 size={18} className="animate-spin" /> : isOpen ? <StopCircle size={18} /> : <PlayCircle size={18} />}
            </button>
          </Tip>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-2 rounded-xl self-start text-xs font-semibold">
          <DollarSign size={13} />
          {(c.basePrice * c.currentStudents).toFixed(0)}
          <span className="text-emerald-400 font-normal ml-0.5">{t("ប្រាក់ចំណូលសរុប", "total income")}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Tip label={t("មើលសិស្ស", "View students")}>
            <button
              onClick={() => onStudents(c)}
              className="py-2.5 flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all w-full"
            >
              <Users size={14} /> {c.currentStudents}
            </button>
          </Tip>
          <Tip label={t("មើលមតិថ្នាក់", "View class reviews")}>
            <button
              onClick={() => onReviews(c.classId, c.title)}
              className="py-2.5 flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-amber-50 hover:text-amber-600 hover:border-amber-100 transition-all w-full"
            >
              <MessageSquare size={14} /> {t("មតិ", "Reviews")}
            </button>
          </Tip>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 mt-auto">
          {/* ── CHANGED: was navigate, now opens modal ── */}
          <Tip label={t("កែប្រែថ្នាក់", "Edit class")}>
            <button
              onClick={() => onEdit(c.classId)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all"
            >
              <Edit3 size={16} />
            </button>
          </Tip>

          <Tip label={t("ចម្លងថ្នាក់", "Duplicate class")}>
            <button
              onClick={() => onCopy(c.classId)}
              disabled={actionId === c.classId}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 transition-all"
            >
              {actionId === c.classId ? <Loader2 size={16} className="animate-spin" /> : <Copy size={16} />}
            </button>
          </Tip>

          {hasStudents ? (
            <Tip label={t("មិនអាចលុបបាន — មានសិស្ស", "Cannot delete — has students")}>
              <button disabled className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-200 cursor-not-allowed">
                <Lock size={16} />
              </button>
            </Tip>
          ) : (
            <Tip label={t("លុបថ្នាក់", "Delete class")}>
              <button
                onClick={() => onDelete(c)}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </Tip>
          )}

          <button
            onClick={() => onNavigate(`/classes/${c.classId}`)}
            className="flex-1 h-9 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            {t("គ្រប់គ្រង", "Manage")} <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   CLASS ROW (List / Desktop)
───────────────────────────────────────── */
const ClassRow: React.FC<CardProps> = ({
  c, actionId, onToggle, onCopy, onDelete, onStudents, onReviews, onNavigate, onEdit,
}) => {
  const { t } = useLanguage();
  const isOpen = c.status === "OPEN";
  const hasStudents = c.currentStudents > 0;

  return (
    <div className={`group bg-white border rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-slate-300 ${isOpen ? "border-slate-200" : "border-slate-100 opacity-90"}`}>
      {/* Thumbnail */}
      <div className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-100">
        {c.classImage ? (
          <img src={c.classImage} className={`w-full h-full object-cover ${!isOpen ? "grayscale-[0.4]" : ""}`} alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GraduationCap size={22} className="text-indigo-200" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{c.subjects?.[0]}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isOpen ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {isOpen ? t("បើក", "Open") : t("បិទ", "Closed")}
          </span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 truncate">{c.title}</h3>
        <p className="text-xs text-emerald-600 font-semibold mt-0.5">
          {t("ប្រាក់ចំណូល", "Income")}: ${(c.basePrice * c.currentStudents).toFixed(0)}
        </p>
      </div>

      {/* Stats */}
      <div className="hidden lg:flex items-center gap-8 shrink-0">
        <Tip label={t("មើលសិស្ស", "View students")}>
          <button onClick={() => onStudents(c)} className="flex flex-col items-center gap-0.5 group/s hover:text-indigo-600 transition-colors">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide group-hover/s:text-indigo-500">{t("ចុះឈ្មោះ", "enrolled")}</span>
            <span className="flex items-center gap-1 text-sm font-bold text-slate-700 group-hover/s:text-indigo-600">
              <Users size={12} className="text-indigo-400" /> {c.currentStudents}
            </span>
          </button>
        </Tip>
        <Tip label={t("មើលមតិថ្នាក់", "View class reviews")}>
          <button onClick={() => onReviews(c.classId, c.title)} className="flex flex-col items-center gap-0.5 group/r hover:text-amber-600 transition-colors">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide group-hover/r:text-amber-500">{t("ពិន្ទុ", "rating")}</span>
            <span className="flex items-center gap-1 text-sm font-bold text-slate-700 group-hover/r:text-amber-600">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              {Number(c.tutor?.rating ?? 0).toFixed(1)}
            </span>
          </button>
        </Tip>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Tip label={isOpen ? t("បិទការចុះឈ្មោះ", "Close enrollment") : t("បើកការចុះឈ្មោះ", "Reopen enrollment")}>
          <button
            onClick={() => onToggle(c.classId, c.status)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${isOpen ? "bg-amber-50 text-amber-500 hover:bg-amber-100" : "bg-indigo-50 text-indigo-500 hover:bg-indigo-100"}`}
          >
            {actionId === c.classId ? <Loader2 size={15} className="animate-spin" /> : isOpen ? <StopCircle size={16} /> : <PlayCircle size={16} />}
          </button>
        </Tip>

        <Tip label={t("ចម្លងថ្នាក់", "Duplicate class")}>
          <button onClick={() => onCopy(c.classId)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
            {actionId === c.classId ? <Loader2 size={15} className="animate-spin" /> : <Copy size={15} />}
          </button>
        </Tip>

        {/* ── CHANGED: was navigate, now opens modal ── */}
        <Tip label={t("កែប្រែថ្នាក់", "Edit class")}>
          <button
            onClick={() => onEdit(c.classId)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            <Edit3 size={15} />
          </button>
        </Tip>

        <button
          onClick={() => onNavigate(`/classes/${c.classId}`)}
          className="h-9 px-4 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
        >
          {t("គ្រប់គ្រង", "Manage")} <ChevronRight size={14} />
        </button>

        {hasStudents ? (
          <Tip label={t("មិនអាចលុបបាន — មានសិស្ស", "Cannot delete — has students")}>
            <span className="w-8 flex items-center justify-center text-slate-200"><Lock size={15} /></span>
          </Tip>
        ) : (
          <Tip label={t("លុបថ្នាក់", "Delete class")}>
            <button onClick={() => onDelete(c)} className="w-8 h-9 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors">
              <Trash2 size={15} />
            </button>
          </Tip>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const MyClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [actionId, setActionId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // ── NEW: edit modal state ──
  const [editClassId, setEditClassId] = useState<number | null>(null);

  const [studentModal, setStudentModal] = useState<StudentModalState>({ isOpen: false, students: [], title: "" });
  const [modal, setModal] = useState<ModalState>({ isOpen: false, title: "", message: "", type: "danger", confirmText: "", onConfirm: () => {} });
  const [reviewModal, setReviewModal] = useState<ReviewModalState>({ isOpen: false, data: null, title: "", loading: false });

  const getAuthHeader = useCallback((): Record<string, string> | null => {
    const token = Cookies.get("token");
    return token
      ? { Authorization: `Bearer ${token}`, accept: "*/*", "Content-Type": "application/json" }
      : null;
  }, []);

  const fetchMyClasses = useCallback(async (): Promise<void> => {
    const token = Cookies.get("token");
    if (!token) { setLoading(false); return; }
    try {
      setLoading(true);
      const payload = JSON.parse(atob(token.split(".")[1])) as { tutorId?: number; userId?: number };
      const tutorId = payload.tutorId ?? payload.userId;
      const res = await fetch(`${API_BASE}/open-classes/tutor/${tutorId}`, { headers: getAuthHeader() ?? {} });
      const data: OpenClass[] = await res.json();
      if (Array.isArray(data)) setClasses(data.sort((a, b) => b.classId - a.classId));
    } catch {
      toast.error(t("បរាជ័យក្នុងការទាញយកថ្នាក់", "Failed to fetch classes"));
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader, t]);

  const handleViewReviews = async (classId: number, classTitle: string): Promise<void> => {
    setReviewModal({ isOpen: true, data: null, title: classTitle, loading: true });
    try {
      const res = await fetch(`${API_BASE}/reviews/class/${classId}`, { headers: getAuthHeader() ?? {} });
      if (!res.ok) throw new Error("Failed");
      const data: ReviewData = await res.json();
      setReviewModal((prev) => ({ ...prev, data, loading: false }));
    } catch {
      toast.error(t("បរាជ័យក្នុងការផ្ទុកមតិ", "Failed to load reviews"));
      setReviewModal((prev) => ({ ...prev, isOpen: false, loading: false }));
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string): Promise<void> => {
    const headers = getAuthHeader();
    if (!headers) return;
    const isEnding = currentStatus === "OPEN";
    const endpoint = isEnding ? "end" : "reopen";
    const toastId = toast.loading(isEnding ? t("កំពុងបិទការចុះឈ្មោះ…", "Closing enrollment…") : t("កំពុងបើកការចុះឈ្មោះ…", "Reopening enrollment…"));
    try {
      setActionId(id);
      const res = await fetch(`${API_BASE}/open-classes/${id}/${endpoint}`, { method: "PATCH", headers });
      if (res.ok) {
        const updated: OpenClass = await res.json();
        setClasses((prev) => prev.map((c) => (c.classId === id ? updated : c)));
        toast.success(isEnding ? t("បានបិទការចុះឈ្មោះ", "Enrollment closed") : t("បានបើកការចុះឈ្មោះ", "Enrollment reopened"), { id: toastId });
      } else {
        toast.error(t("បរាជ័យក្នុងការប្តូរស្ថានភាព", "Failed to change status"), { id: toastId });
      }
    } catch {
      toast.error(t("កំហុសបណ្តាញ", "Network error"), { id: toastId });
    } finally {
      setActionId(null);
    }
  };

  const handleCopy = async (id: number): Promise<void> => {
    const headers = getAuthHeader();
    if (!headers) return;
    const toastId = toast.loading(t("កំពុងចម្លងថ្នាក់…", "Duplicating class…"));
    try {
      setActionId(id);
      const res = await fetch(`${API_BASE}/open-classes/${id}/copy`, { method: "POST", headers });
      if (!res.ok) throw new Error("Copy failed");
      await fetchMyClasses();
      toast.success(t("បានចម្លងថ្នាក់!", "Class duplicated!"), { id: toastId });
    } catch {
      toast.error(t("បរាជ័យក្នុងការចម្លង", "Failed to duplicate"), { id: toastId });
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    const headers = getAuthHeader();
    if (!headers) return;
    const toastId = toast.loading(t("កំពុងលុប…", "Deleting…"));
    try {
      setActionId(id);
      const res = await fetch(`${API_BASE}/open-classes/${id}`, { method: "DELETE", headers });
      if (res.status === 204 || res.ok) {
        setClasses((prev) => prev.filter((c) => c.classId !== id));
        toast.success(t("បានលុបថ្នាក់", "Class deleted"), { id: toastId });
      } else {
        const result = await res.json().catch(() => ({})) as { message?: string };
        toast.error(t("បរាជ័យក្នុងការលុប", "Delete failed"), {
          id: toastId,
          description: result.message ?? t("មិនអាចលុបថ្នាក់ដែលមានសិស្ស", "Cannot delete a class with students"),
        });
      }
    } catch {
      toast.error(t("កំហុសបណ្តាញ", "Network error"), { id: toastId });
    } finally {
      setActionId(null);
    }
  };

  const openDeleteModal = (c: OpenClass): void => {
    if (c.currentStudents > 0) {
      toast.error(t("មិនអាចលុបបាន", "Cannot delete"), {
        description: t(`ថ្នាក់នេះមានសិស្ស ${c.currentStudents} នាក់`, `This class has ${c.currentStudents} student(s) enrolled.`),
      });
      return;
    }
    setModal({
      isOpen: true,
      title: t("លុបថ្នាក់?", "Delete class?"),
      message: t(`"${c.title}" នឹងត្រូវបានលុបចោលជាអចិន្ត្រៃយ៍។`, `"${c.title}" will be permanently removed. This cannot be undone.`),
      type: "danger",
      confirmText: t("លុប", "Delete"),
      onConfirm: () => handleDelete(c.classId),
    });
  };

  useEffect(() => { fetchMyClasses(); }, [fetchMyClasses]);

  const filteredClasses = useMemo<OpenClass[]>(
    () => classes.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subjects?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [classes, searchQuery],
  );

  const sharedCardProps = (c: OpenClass): CardProps => ({
    c,
    actionId,
    onToggle: handleToggleStatus,
    onCopy: handleCopy,
    onDelete: openDeleteModal,
    onStudents: (cls: OpenClass) => setStudentModal({ isOpen: true, students: cls.confirmedStudents, title: cls.title }),
    onReviews: handleViewReviews,
    onNavigate: navigate,
    onEdit: (classId: number) => setEditClassId(classId), // ← opens the edit modal
  });

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-500 mb-3" size={36} />
        <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">{t("កំពុងផ្ទុក…", "Loading…")}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 antialiased pb-24 sm:pb-8">
      <Toaster position="top-center" richColors closeButton />

      {/* ── Edit Class Modal ── */}
      <EditClassModal
        classId={editClassId}
        onClose={() => setEditClassId(null)}
        onSaved={() => {
          fetchMyClasses(); // refresh list after a successful save
          setEditClassId(null);
        }}
      />

      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.confirmText}
        onClose={() => setModal((m) => ({ ...m, isOpen: false }))}
        onConfirm={modal.onConfirm}
      />
      <StudentListModal
        isOpen={studentModal.isOpen}
        students={studentModal.students}
        classTitle={studentModal.title}
        onClose={() => setStudentModal((m) => ({ ...m, isOpen: false }))}
      />
      <ReviewListModal
        isOpen={reviewModal.isOpen}
        data={reviewModal.data}
        title={reviewModal.title}
        loading={reviewModal.loading}
        onClose={() => setReviewModal((m) => ({ ...m, isOpen: false }))}
      />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3 flex-wrap">
          <h1 className="text-lg font-bold text-slate-900 hidden md:block mr-2">{t("ថ្នាក់របស់ខ្ញុំ", "My Classes")}</h1>
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder={t("ស្វែងរកតាមចំណងជើង ឬមុខវិជ្ជា…", "Search by title or subject…")}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl gap-0.5">
            <Tip label={t("មើលជាក្រឡាចត្រង្គ", "Grid view")}>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutGrid size={16} />
              </button>
            </Tip>
            <Tip label={t("មើលជាបញ្ជី", "List view")}>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                <List size={16} />
              </button>
            </Tip>
          </div>
          <button
            onClick={() => navigate("/tutor/manage")}
            className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all shadow-sm shadow-indigo-200"
          >
            <Plus size={16} /> {t("បង្កើតថ្នាក់", "Create class")}
          </button>
        </div>
      </header>

      {/* FAB (mobile) */}
      <button
        onClick={() => navigate("/tutor/manage")}
        className="fixed bottom-6 right-5 z-50 md:hidden w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-300 flex items-center justify-center active:scale-90 transition-transform"
      >
        <Plus size={26} />
      </button>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        {filteredClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <GraduationCap size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-semibold text-sm">{t("រកមិនឃើញថ្នាក់", "No classes found")}</p>
            <p className="text-slate-400 text-xs mt-1">{t("សាកល្បងស្វែងរកផ្សេង ឬបង្កើតថ្នាក់ថ្មី។", "Try a different search or create a new class.")}</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map((c) => <ClassCard key={c.classId} {...sharedCardProps(c)} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClasses.map((c) => (
              <React.Fragment key={c.classId}>
                <div className="md:hidden"><ClassCard {...sharedCardProps(c)} /></div>
                <div className="hidden md:block"><ClassRow {...sharedCardProps(c)} /></div>
              </React.Fragment>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyClassesPage;