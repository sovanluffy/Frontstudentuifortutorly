"use client";
import React, { useState, useMemo } from "react";
import {
  Loader2, Edit3, Upload, Plus, Trash2, ChevronLeft,
  Image as ImageIcon, Video as VideoIcon, User, BookOpen, Briefcase, Camera,
  CheckCircle2, X
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import {
  Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription
} from "@/app/components/figma/ui/dialog";
import { toast } from "sonner";

interface PortfolioEditorProps {
  tutor: any;
  token: string | null;
  onRefresh: () => void;
}

const STEPS = [
  { label: "About", icon: User },
  { label: "Media", icon: Camera },
];

export default function PortfolioEditor({ tutor, token, onRefresh }: PortfolioEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Text fields ──
  const [bio, setBio] = useState(tutor?.bio || "");
  const [education, setEducation] = useState<any[]>(tutor?.education || []);
  const [experience, setExperience] = useState<any[]>(tutor?.experience || []);

  // ── Media ──
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [coverRemoved, setCoverRemoved] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [certPreviews, setCertPreviews] = useState<string[]>(tutor?.certificateImages || []);

  // ── Computed previews ──
  const profilePreview = useMemo(
    () => (profileImg ? URL.createObjectURL(profileImg) : tutor?.profilePicture),
    [profileImg, tutor]
  );
  const coverPreview = useMemo(() => {
    if (coverRemoved) return null;
    return coverImg ? URL.createObjectURL(coverImg) : tutor?.coverImage;
  }, [coverImg, coverRemoved, tutor]);
  const videoPreview = useMemo(
    () => (videoFile ? URL.createObjectURL(videoFile) : tutor?.introVideoUrl),
    [videoFile, tutor]
  );

  // ── Reset form to tutor defaults ──
  const resetForm = () => {
    setBio(tutor?.bio || "");
    setEducation(tutor?.education || []);
    setExperience(tutor?.experience || []);
    setProfileImg(null);
    setCoverImg(null);
    setCoverRemoved(false);
    setVideoFile(null);
    setCertificates([]);
    setCertPreviews(tutor?.certificateImages || []);
    setStep(0);
  };

  // ── Handle dialog open/close ──
  const handleOpenChange = (v: boolean) => {
    setIsOpen(v);
    if (!v) {
      setShowSuccess(false);
      resetForm();
    }
  };

  // ── Submit ──
  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify({ bio, education, experience }));
      if (profileImg) fd.append("profileImg", profileImg);
      if (coverImg) fd.append("coverImg", coverImg);
      if (coverRemoved) fd.append("removeCover", "true");
      if (videoFile) fd.append("videoFile", videoFile);
      certificates.forEach(f => fd.append("certificates", f));

      const res = await fetch(
        `https://toturhub-dev.onrender.com/api/v1/tutors/profile?publish=false`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, accept: "*/*" },
          body: fd,
        }
      );

      if (res.ok) {
        // Show inline success banner
        setShowSuccess(true);
        // Reset all file/dirty state (keep text for reference, user can re-edit)
        setProfileImg(null);
        setCoverImg(null);
        setCoverRemoved(false);
        setVideoFile(null);
        setCertificates([]);
        onRefresh();

        // Auto-close after 2.5 s
        setTimeout(() => {
          setShowSuccess(false);
          setIsOpen(false);
          resetForm();
        }, 2500);
      } else {
        toast.error("Update failed: " + (await res.text()));
      }
    } catch {
      toast.error("Connection error");
    } finally {
      setUpdating(false);
    }
  };

  // ── Certificate helpers ──
  const addCerts = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setCertificates(p => [...p, ...arr]);
    setCertPreviews(p => [...p, ...arr.map(f => URL.createObjectURL(f))]);
  };
  const removeCert = (i: number) => {
    setCertificates(p => p.filter((_, idx) => idx !== i));
    setCertPreviews(p => p.filter((_, idx) => idx !== i));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 h-9">
          <Edit3 size={14} /> Edit profile
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 gap-0 rounded-2xl overflow-hidden w-full max-w-lg mx-auto border border-gray-200 shadow-xl">
        <DialogTitle className="sr-only">Edit Tutor Profile</DialogTitle>
        <DialogDescription className="sr-only">
          Update your biography, education, experience, and media.
        </DialogDescription>

        {/* ── Success Banner ── */}
        {showSuccess && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-4 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-gray-900 mb-1">Profile updated!</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Your changes have been saved successfully.<br />
                  This window will close automatically.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setIsOpen(false);
                  resetForm();
                }}
                className="mt-1 text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Close now
              </button>
            </div>
          </div>
        )}

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
          <h2 className="text-[15px] font-semibold text-gray-900">Edit profile</h2>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                  step === i
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <s.icon size={13} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto max-h-[70vh] bg-gray-50">

          {/* STEP 0 — About */}
          {step === 0 && (
            <div className="p-4 space-y-4">

              {/* Bio */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                  <User size={13} className="text-blue-600" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Bio</span>
                </div>
                <div className="p-3">
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell students about yourself..."
                    className="w-full text-[13px] text-gray-700 placeholder-gray-400 bg-transparent resize-none outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <BookOpen size={13} className="text-blue-600" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Education</span>
                  </div>
                  <button
                    onClick={() => setEducation([...education, { school: "", degree: "", year: "" }])}
                    className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={12} className="text-blue-600" />
                  </button>
                </div>
                {education.length === 0 ? (
                  <p className="text-[12px] text-gray-400 text-center py-4 italic">No education added yet.</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {education.map((edu, i) => (
                      <div key={i} className="p-3 space-y-2">
                        <div className="flex gap-2">
                          <input
                            className="flex-1 text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder-gray-400"
                            placeholder="School name"
                            value={edu.school}
                            onChange={e => { const n = [...education]; n[i].school = e.target.value; setEducation(n); }}
                          />
                          <button
                            onClick={() => setEducation(education.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            className="flex-1 text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder-gray-400"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={e => { const n = [...education]; n[i].degree = e.target.value; setEducation(n); }}
                          />
                          <input
                            className="w-20 text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 focus:bg-white transition-colors text-center placeholder-gray-400"
                            placeholder="Year"
                            value={edu.year}
                            onChange={e => { const n = [...education]; n[i].year = e.target.value; setEducation(n); }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Briefcase size={13} className="text-gray-500" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Experience</span>
                  </div>
                  <button
                    onClick={() => setExperience([...experience, { company: "", role: "", duration: "" }])}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={12} className="text-gray-600" />
                  </button>
                </div>
                {experience.length === 0 ? (
                  <p className="text-[12px] text-gray-400 text-center py-4 italic">No experience added yet.</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {experience.map((exp, i) => (
                      <div key={i} className="p-3 space-y-2">
                        <div className="flex gap-2">
                          <input
                            className="flex-1 text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder-gray-400"
                            placeholder="Company"
                            value={exp.company}
                            onChange={e => { const n = [...experience]; n[i].company = e.target.value; setExperience(n); }}
                          />
                          <button
                            onClick={() => setExperience(experience.filter((_, idx) => idx !== i))}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            className="flex-1 text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 focus:bg-white transition-colors placeholder-gray-400"
                            placeholder="Role / Position"
                            value={exp.role}
                            onChange={e => { const n = [...experience]; n[i].role = e.target.value; setExperience(n); }}
                          />
                          <input
                            className="w-24 text-[12px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-400 focus:bg-white transition-colors text-center placeholder-gray-400"
                            placeholder="Duration"
                            value={exp.duration}
                            onChange={e => { const n = [...experience]; n[i].duration = e.target.value; setExperience(n); }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 1 — Media */}
          {step === 1 && (
            <div className="p-4 space-y-4">

              {/* Profile + Cover photos */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                  <ImageIcon size={13} className="text-blue-600" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Photos</span>
                </div>
                <div className="p-3 grid grid-cols-2 gap-3">

                  {/* Profile photo */}
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-400 font-medium">Profile photo</p>
                    <label className="relative group block aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-blue-400 transition-colors">
                      {profilePreview ? (
                        <img src={profilePreview} className="w-full h-full object-cover" alt="profile" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-1.5">
                          <Upload size={18} className="text-gray-300" />
                          <span className="text-[11px] text-gray-400">Upload</span>
                        </div>
                      )}
                      {profilePreview && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload size={16} className="text-white" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => setProfileImg(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  {/* Cover photo */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-gray-400 font-medium">Cover photo</p>
                      {coverPreview && (
                        <button
                          type="button"
                          onClick={() => { setCoverImg(null); setCoverRemoved(true); }}
                          className="flex items-center gap-1 text-[10px] font-medium text-red-400 hover:text-red-600 transition-colors"
                          title="Remove cover image"
                        >
                          <X size={11} />
                          Remove
                        </button>
                      )}
                    </div>
                    <label className="relative group block aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-blue-400 transition-colors">
                      {coverPreview ? (
                        <img src={coverPreview} className="w-full h-full object-cover" alt="cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-1.5">
                          <Upload size={18} className="text-gray-300" />
                          <span className="text-[11px] text-gray-400">Upload</span>
                        </div>
                      )}
                      {coverPreview && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload size={16} className="text-white" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          setCoverRemoved(false);
                          setCoverImg(e.target.files?.[0] || null);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Intro video */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                  <VideoIcon size={13} className="text-blue-600" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Intro video</span>
                </div>
                <div className="p-3">
                  <label className="relative group block rounded-xl overflow-hidden bg-gray-900 aspect-video cursor-pointer">
                    {videoPreview ? (
                      <video
                        src={videoPreview}
                        className="w-full h-full object-cover"
                        controls
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        <VideoIcon size={22} className="text-gray-500" />
                        <span className="text-[12px] text-gray-500">Click to upload video</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Upload size={18} className="text-white" />
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={e => setVideoFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>

              {/* Certificates */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100">
                  <BookOpen size={13} className="text-blue-600" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Certificates
                  </span>
                  <span className="ml-auto text-[11px] text-gray-400">{certPreviews.length} added</span>
                </div>
                <div className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {certPreviews.map((url, i) => (
                      <div
                        key={i}
                        className="relative w-[72px] h-[72px] rounded-lg overflow-hidden border border-gray-200 group"
                      >
                        <img src={url} className="w-full h-full object-cover" alt={`cert-${i}`} />
                        <button
                          onClick={() => removeCert(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={11} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                    <label className="w-[72px] h-[72px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors gap-1">
                      <Plus size={16} className="text-gray-400" />
                      <span className="text-[10px] text-gray-400">Add</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={e => addCerts(e.target.files)}
                      />
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white">
          {step === 1 && (
            <button
              onClick={() => setStep(0)}
              className="flex items-center gap-1 text-[13px] font-medium text-gray-500 hover:text-gray-800 transition-colors px-2"
            >
              <ChevronLeft size={14} /> Back
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={() => handleOpenChange(false)}
            className="text-[13px] font-medium text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5"
          >
            Cancel
          </button>
          <button
            onClick={step === 0 ? () => setStep(1) : handleUpdate}
            disabled={updating}
            className={`flex items-center gap-1.5 text-[13px] font-semibold text-white px-4 py-1.5 rounded-lg transition-colors ${
              step === 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } disabled:opacity-60`}
          >
            {updating && <Loader2 size={13} className="animate-spin" />}
            {step === 0 ? "Next" : "Save changes"}
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
}