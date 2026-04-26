"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Plus, Users, Edit3, Loader2,
  Copy, Trash2, RefreshCw, 
  LayoutGrid, List, AlertTriangle, X, Search, 
  Mail, GraduationCap, Calendar, DollarSign,
  ArrowUpRight, Tag, ChevronRight, Lock,
  PlayCircle, StopCircle, Star, MessageSquare
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE;

/* ================= TYPES ================= */
interface Review {
  id: number;
  comment: string;
  rating: number;
  studentName: string;
  studentAvatar: string | null;
  createdAt: string;
}

interface ReviewData {
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
  tutor: {
    tutorId: number;
    name: string;
    avatar: string | null;
    rating: number;
    email: string;
    phone: string;
  };
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

/* ================= MODALS ================= */

const ReviewListModal = ({ isOpen, onClose, data, classTitle, loading }: any) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl w-full max-w-xl h-[85vh] sm:h-[75vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Star size={24} className="fill-amber-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-black text-slate-900">{t("ការវាយតម្លៃ", "Class Reviews")}</h3>
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest truncate max-w-[200px]">{classTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 bg-slate-50/30 h-[calc(85vh-160px)] sm:h-[calc(75vh-160px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
              <p className="text-slate-400 text-xs font-bold uppercase">{t("កំពុងផ្ទុក...", "Loading...")}</p>
            </div>
          ) : data?.reviews?.length > 0 ? (
            <>
              <div className="bg-white p-6 rounded-[32px] mb-6 flex items-center justify-around border border-slate-100 shadow-sm">
                <div className="text-center">
                  <p className="text-4xl font-black text-slate-900">{data.averageRating}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Avg Rating</p>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div className="text-center">
                  <p className="text-4xl font-black text-slate-900">{data.totalReviewer}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total People</p>
                </div>
              </div>

              <div className="grid gap-4">
                {data.reviews.map((rev: Review) => (
                  <div key={rev.id} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={rev.studentAvatar || `https://ui-avatars.com/api/?name=${rev.studentName}`} 
                        className="w-10 h-10 rounded-xl object-cover" 
                        alt=""
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-900">{rev.studentName}</h4>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <MessageSquare size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{t("មិនទាន់មានការវាយតម្លៃ", "No reviews yet")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, type = "danger" }: any) => {
  const { t } = useLanguage();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 ${type === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
            {type === 'danger' ? <AlertTriangle size={32} /> : <Copy size={32} />}
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed px-2">{message}</p>
        </div>
        <div className="flex border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-5 font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            {t("បោះបង់", "Cancel")}
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 py-5 font-bold text-white transition-colors ${type === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {confirmText || t("យល់ព្រម", "Confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentListModal = ({ isOpen, onClose, students, classTitle }: any) => {
  const { t } = useLanguage();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl w-full max-w-xl h-[85vh] sm:h-auto overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        <div className="p-6 md:p-8 border-b border-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><GraduationCap size={24} /></div>
              <div className="min-w-0">
                <h3 className="text-xl font-black text-slate-900">{t("បញ្ជីឈ្មោះសិស្ស", "Student List")}</h3>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest truncate max-w-[150px] sm:max-w-[300px]">{classTitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
        </div>
        
        <div className="overflow-y-auto p-4 md:p-6 bg-slate-50/30 h-[calc(85vh-180px)] sm:max-h-[50vh]">
          {students && students.length > 0 ? (
            <div className="grid gap-3">
              {students.map((student: Student, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={student.avatar || `https://ui-avatars.com/api/?name=${student.studentName}&background=4318FF&color=fff&bold=true`} 
                      className="w-12 h-12 rounded-2xl object-cover shadow-sm" 
                      alt=""
                    />
                    <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{student.studentName}</h4>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                            <Mail size={12} /> <span className="truncate">{student.email}</span>
                        </div>
                    </div>
                  </div>
                  {student.bookedSchedule && (
                    <div className="flex items-center gap-2.5 bg-indigo-50/50 px-4 py-2 rounded-xl self-start sm:self-center">
                        <Calendar size={14} className="text-indigo-500" />
                        <p className="text-[10px] font-black text-indigo-900">
                            {student.bookedSchedule.day} • {student.bookedSchedule.startTime.slice(0, 5)}
                        </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <Users size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{t("មិនទាន់មានសិស្សចុះឈ្មោះ", "No students enrolled yet")}</p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-white border-t border-slate-50 pb-10 sm:pb-6">
          <button onClick={onClose} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
            {t("រួចរាល់", "Done")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
const MyClassesPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [actionId, setActionId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [studentModal, setStudentModal] = useState({ isOpen: false, students: [] as Student[], title: "" });
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "danger" as "danger" | "primary", confirmText: "", onConfirm: () => {} });
  
  // NEW: State for Reviews
  const [reviewModal, setReviewModal] = useState({ 
    isOpen: false, 
    data: null as ReviewData | null, 
    title: "", 
    loading: false 
  });

  const getAuthHeader = useCallback(() => {
    const token = Cookies.get("token");
    return token ? { "Authorization": `Bearer ${token}`, "accept": "*/*", "Content-Type": "application/json" } : null;
  }, []);

  const fetchMyClasses = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) { setLoading(false); return; }
    try {
      setLoading(true);
      const payload = JSON.parse(atob(token.split(".")[1]));
      const tutorId = payload.tutorId || payload.userId;
      
      const res = await fetch(`${API_BASE}/open-classes/tutor/${tutorId}`, { headers: getAuthHeader() || {} });
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setClasses(data.sort((a, b) => b.classId - a.classId));
      }
    } catch (error) {
      toast.error(t("ការទាញយកទិន្នន័យបរាជ័យ", "Failed to fetch data"));
    } finally { setLoading(false); }
  }, [getAuthHeader, t]);

  // NEW: Fetch Reviews function
  const handleViewReviews = async (classId: number, classTitle: string) => {
    setReviewModal({ isOpen: true, data: null, title: classTitle, loading: true });
    try {
      const res = await fetch(`${API_BASE}/api/reviews/class/${classId}`, { 
        headers: getAuthHeader() || {} 
      });
      const data = await res.json();
      setReviewModal(prev => ({ ...prev, data, loading: false }));
    } catch (error) {
      toast.error("Failed to load reviews");
      setReviewModal(prev => ({ ...prev, isOpen: false, loading: false }));
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const headers = getAuthHeader();
    if (!headers) return;

    const isEnding = currentStatus === "OPEN";
    const endpoint = isEnding ? "end" : "reopen";
    const toastId = toast.loading(isEnding ? t("កំពុងបិទការចុះឈ្មោះ...", "Closing enrollment...") : t("កំពុងបើកការចុះឈ្មោះឡើងវិញ...", "Reopening enrollment..."));

    try {
      setActionId(id);
      const res = await fetch(`${API_BASE}/open-classes/${id}/${endpoint}`, { 
        method: "PATCH", 
        headers 
      });

      if (res.ok) {
        const updatedClass = await res.json();
        setClasses(prev => prev.map(c => c.classId === id ? updatedClass : c));
        toast.success(isEnding ? t("បានបិទការចុះឈ្មោះជោគជ័យ", "Enrollment closed successfully") : t("បានបើកការចុះឈ្មោះឡើងវិញជោគជ័យ", "Enrollment reopened successfully"), { id: toastId });
      } else {
        toast.error(t("ការផ្លាស់ប្តូរស្ថានភាពបរាជ័យ", "Failed to change status"), { id: toastId });
      }
    } catch (error) {
      toast.error(t("បញ្ហាការតភ្ជាប់បណ្តាញ", "Network connection issue"), { id: toastId });
    } finally {
      setActionId(null);
    }
  };

  const handleCopy = async (id: number) => {
    const headers = getAuthHeader();
    if (!headers) return;
    const toastId = toast.loading(t("កំពុងចម្លងថ្នាក់រៀន...", "Copying class..."));
    try {
      setActionId(id);
      const res = await fetch(`${API_BASE}/open-classes/${id}/copy`, { method: "POST", headers });
      if (!res.ok) throw new Error();
      await fetchMyClasses();
      toast.success(t("បានចម្លងថ្នាក់រៀនថ្មីជោគជ័យ!", "Class copied successfully!"), { id: toastId });
    } catch {
      toast.error(t("ការចម្លងបានបរាជ័យ", "Failed to copy"), { id: toastId });
    } finally { setActionId(null); }
  };

  const handleDelete = async (id: number) => {
    const headers = getAuthHeader();
    if (!headers) return;
    const toastId = toast.loading(t("កំពុងលុប...", "Deleting..."));
    try {
      setActionId(id);
      const res = await fetch(`${API_BASE}/open-classes/${id}`, { 
        method: "DELETE", 
        headers 
      });

      if (res.status === 204 || res.ok) {
        setClasses(prev => prev.filter(c => c.classId !== id));
        toast.success(t("បានលុបថ្នាក់រៀនជោគជ័យ", "Class deleted successfully"), { id: toastId });
      } else {
        const result = await res.json().catch(() => ({}));
        const errorDetail = result.message || t("មិនអាចលុបថ្នាក់ដែលមានសិស្សបានទេ", "Cannot delete class with students");
        toast.error(t("លុបមិនបានសម្រេច", "Delete failed"), { id: toastId, description: errorDetail });
      }
    } catch (error) {
      toast.error(t("បញ្ហាការតភ្ជាប់", "Connection issue"), { id: toastId });
    } finally {
      setActionId(null);
    }
  };

  useEffect(() => { fetchMyClasses(); }, [fetchMyClasses]);

  const filteredClasses = useMemo(() => {
    return classes.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [classes, searchQuery]);

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <div className="absolute inset-0 blur-xl bg-indigo-400/20 animate-pulse" />
        </div>
        <p className="mt-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">{t("កំពុងទាញយកទិន្នន័យ...", "Loading data...")}</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] font-sans antialiased pb-24 sm:pb-0">
      <Toaster position="top-center" richColors closeButton />
      
      <ConfirmModal 
        isOpen={modal.isOpen} title={modal.title} message={modal.message} type={modal.type} confirmText={modal.confirmText}
        onClose={() => setModal({ ...modal, isOpen: false })} onConfirm={modal.onConfirm}
      />
      
      <StudentListModal 
        isOpen={studentModal.isOpen} title={studentModal.title} students={studentModal.students}
        onClose={() => setStudentModal({ ...studentModal, isOpen: false })}
      />

      {/* NEW: Review Modal */}
      <ReviewListModal 
        isOpen={reviewModal.isOpen} 
        data={reviewModal.data} 
        classTitle={reviewModal.title}
        loading={reviewModal.loading}
        onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
      />

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm px-4 md:px-8 py-4 md:py-6">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center justify-between md:hidden">
            <h1 className="text-xl font-black text-slate-900">{t("គ្រប់គ្រងថ្នាក់រៀន", "Manage Classes")}</h1>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder={t("ស្វែងរកតាមឈ្មោះ ឬមុខវិជ្ជា...", "Search by title or subject...")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 sm:py-3 bg-slate-100/50 border-none rounded-2xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            />
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button title={t("មើលជាក្រឡា", "Grid View")} onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}><LayoutGrid size={18} /></button>
              <button title={t("មើលជាបញ្ជី", "List View")} onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}><List size={18} /></button>
            </div>
            <button onClick={() => navigate("/tutor/manage")} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all">
              <Plus size={18} /> {t("បង្កើតថ្នាក់ថ្មី", "Create New Class")}
            </button>
          </div>
        </div>
      </header>

      <button 
        onClick={() => navigate("/tutor/manage")}
        className="fixed bottom-6 right-6 z-50 md:hidden w-16 h-16 bg-indigo-600 text-white rounded-3xl shadow-2xl shadow-indigo-300 flex items-center justify-center active:scale-90 transition-transform"
      >
        <Plus size={32} />
      </button>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" : "grid grid-cols-1 md:block gap-6 md:gap-0"}>
          {filteredClasses.map((c) => (
            <React.Fragment key={c.classId}>
              {/* CARD VIEW */}
              <div className={`${viewMode === "list" ? "md:hidden" : "block"} bg-white rounded-[32px] border overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group ${c.status === 'CLOSED' ? 'border-slate-100 opacity-90' : 'border-slate-200/60'}`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={c.classImage || ""} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${c.status === 'CLOSED' ? 'grayscale-[0.4]' : ''}`} alt="" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-indigo-600 shadow-sm flex items-center gap-1.5 uppercase tracking-tight">
                      <Tag size={12}/> {c.subjects[0]}
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm flex items-center gap-1.5 uppercase tracking-tight ${c.status === 'OPEN' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                      {c.status === 'OPEN' ? t('កំពុងបើក', 'OPEN') : t('បានបិទ', 'CLOSED')}
                    </div>
                    {/* NEW: Rating Overlay on Image */}
                    <button 
                      onClick={() => handleViewReviews(c.classId, c.title)}
                      className="bg-amber-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm flex items-center gap-1.5 uppercase tracking-tight"
                    >
                      <Star size={12} className="fill-white" /> {c.tutor.rating}
                    </button>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-slate-900 leading-tight line-clamp-2">{c.title}</h3>
                    <button 
                      onClick={() => handleToggleStatus(c.classId, c.status)}
                      className={`p-2 rounded-xl transition-all ${c.status === 'OPEN' ? 'text-amber-500 hover:bg-amber-50' : 'text-indigo-600 hover:bg-indigo-50'}`}
                    >
                      {c.status === 'OPEN' ? <StopCircle size={22} /> : <PlayCircle size={22} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl font-black text-xs self-start mb-6">
                    <DollarSign size={14} /> {(c.basePrice * c.currentStudents).toFixed(0)}
                    <span className="text-[9px] text-emerald-500/70 ml-1 font-bold">{t("ចំណូលសរុប", "Total Income")}</span>
                  </div>
                  
                  {/* Buttons Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => setStudentModal({ isOpen: true, students: c.confirmedStudents, title: c.title })}
                      className="py-4 bg-slate-50 text-slate-600 rounded-2xl text-[11px] font-black hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 border border-slate-100"
                    >
                      <Users size={16} /> {c.currentStudents}
                    </button>
                    <button 
                      onClick={() => handleViewReviews(c.classId, c.title)}
                      className="py-4 bg-slate-50 text-slate-600 rounded-2xl text-[11px] font-black hover:bg-amber-50 hover:text-amber-600 transition-all flex items-center justify-center gap-2 border border-slate-100"
                    >
                      <MessageSquare size={16} /> {t("ការវាយតម្លៃ", "Reviews")}
                    </button>
                  </div>

                  <div className="mt-auto pt-5 border-t border-slate-100 flex justify-between items-center gap-2">
                    <div className="flex gap-1">
                        <button onClick={() => navigate(`/tutor/edit/${c.classId}`)} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit3 size={20}/></button>
                        <button 
                          onClick={() => {
                            if(c.currentStudents > 0) {
                              toast.error(t("មិនអាចលុបបាន", "Cannot Delete"), { description: t(`ថ្នាក់នេះមានសិស្សចំនួន ${c.currentStudents} នាក់រួចហើយ។`, `This class already has ${c.currentStudents} students.`) });
                            } else {
                              setModal({ 
                                isOpen: true, title: t("លុបថ្នាក់រៀន?", "Delete Class?"), message: t("តើអ្នកប្រាកដទេ? ថ្នាក់នេះនឹងត្រូវលុបចេញជារៀងរហូត។", "Are you sure? This class will be permanently removed."), 
                                type: "danger", confirmText: t("លុបចេញ", "Delete"), onConfirm: () => handleDelete(c.classId) 
                              })
                            }
                          }}
                          className={`p-3 rounded-xl transition-all ${c.currentStudents > 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`}
                        >
                          {c.currentStudents > 0 ? <Lock size={20}/> : <Trash2 size={20}/>}
                        </button>
                    </div>
                    <button onClick={() => navigate(`/classes/${c.classId}`)} className="flex-1 h-12 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition-all">
                        {t("គ្រប់គ្រង", "Manage")} <ArrowUpRight size={14}/>
                    </button>
                  </div>
                </div>
              </div>

              {/* LIST VIEW */}
              <div className={`${viewMode === "grid" ? "hidden" : "hidden md:flex"} bg-white border rounded-[32px] p-5 mb-4 items-center gap-4 hover:shadow-xl hover:shadow-indigo-500/5 transition-all ${c.status === 'CLOSED' ? 'border-slate-100 opacity-90' : 'border-slate-200/60'}`}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img src={c.classImage || ""} className={`w-20 h-20 rounded-[20px] object-cover shadow-sm ${c.status === 'CLOSED' ? 'grayscale-[0.5]' : ''}`} alt="" />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">{c.subjects[0]}</span>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${c.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {c.status === 'OPEN' ? t('កំពុងបើក', 'OPEN') : t('បានបិទ', 'CLOSED')}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 truncate">{c.title}</h3>
                        <p className="text-emerald-600 text-xs font-black mt-0.5">{t("ចំណូល៖", "Income:")} ${(c.basePrice * c.currentStudents).toFixed(0)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <button onClick={() => setStudentModal({ isOpen: true, students: c.confirmedStudents, title: c.title })} className="flex flex-col items-center gap-0.5 text-center group">
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{t("សិស្សចុះឈ្មោះ", "Enrolled")}</span>
                        <div className="text-sm font-black text-slate-700 flex items-center gap-1.5">
                            <Users size={12} className="text-indigo-500" /> {c.currentStudents}
                        </div>
                    </button>
                    {/* NEW: Reviews Stat in List View */}
                    <button onClick={() => handleViewReviews(c.classId, c.title)} className="flex flex-col items-center gap-0.5 text-center group">
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-amber-600 transition-colors">{t("ការវាយតម្លៃ", "Reviews")}</span>
                        <div className="text-sm font-black text-slate-700 flex items-center gap-1.5">
                            <Star size={12} className="text-amber-500 fill-amber-500" /> {c.tutor.rating}
                        </div>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleToggleStatus(c.classId, c.status)} className={`h-11 w-11 flex items-center justify-center rounded-2xl transition-all ${c.status === 'OPEN' ? 'text-amber-500 bg-amber-50' : 'text-indigo-600 bg-indigo-50'}`}>
                        {c.status === 'OPEN' ? <StopCircle size={18} /> : <PlayCircle size={18} />}
                      </button>
                      <button onClick={() => handleCopy(c.classId)} className="h-11 w-11 bg-slate-50 flex items-center justify-center rounded-2xl text-slate-400 hover:text-emerald-600 transition-all">
                          {actionId === c.classId ? <RefreshCw className="animate-spin" size={16}/> : <Copy size={16}/>}
                      </button>
                      <button onClick={() => navigate(`/tutor/edit/${c.classId}`)} className="h-11 w-11 bg-slate-50 flex items-center justify-center rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"><Edit3 size={16}/></button>
                    </div>
                    
                    <button onClick={() => navigate(`/classes/${c.classId}`)} className="h-11 px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                        {t("គ្រប់គ្រង", "Manage")} <ChevronRight size={14}/>
                    </button>
                    
                    <button 
                      onClick={() => {
                        if(c.currentStudents > 0) {
                          toast.error(t("មិនអាចលុបបាន", "Cannot Delete"), { description: t("ថ្នាក់នេះមានសិស្សចុះឈ្មោះរួចហើយ។", "This class already has students enrolled.") });
                        } else {
                          setModal({ 
                            isOpen: true, title: t("លុបថ្នាក់រៀន", "Delete Class"), message: t("អ្នកអាចលុបបានតែថ្នាក់ដែលមិនទាន់មានសិស្សចុះឈ្មោះប៉ុណ្ណោះ។", "You can only delete classes with no students enrolled."), 
                            type: "danger", confirmText: t("លុបចេញ", "Delete"), onConfirm: () => handleDelete(c.classId) 
                          })
                        }
                      }} 
                      className={`h-11 w-10 flex items-center justify-center transition-all ${c.currentStudents > 0 ? 'text-slate-100 cursor-not-allowed' : 'text-slate-300 hover:text-rose-500'}`}
                    >
                      {c.currentStudents > 0 ? <Lock size={16}/> : <Trash2 size={16}/>}
                    </button>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        {/* ... [Rest of Empty State logic] ... */}
      </main>
    </div>
  );
};

export default MyClassesPage;