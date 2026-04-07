"use client";
import React, { useState, useMemo } from "react";
import {
  Loader2,
  Edit3,
  Upload,
  Plus,
  Trash2,
  ChevronLeft,
  Image as ImageIcon,
  Video as VideoIcon
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/app/components/figma/ui/dialog";
import { Label } from "@/app/components/figma/ui/label";
import { toast } from "sonner";

interface PortfolioEditorProps {
  tutor: any;
  token: string | null;
  onRefresh: () => void;
}

export default function PortfolioEditor({ tutor, token, onRefresh }: PortfolioEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [updating, setUpdating] = useState(false);

  // Form States
  const [bio, setBio] = useState(tutor?.bio || "");
  const [education, setEducation] = useState<any[]>(tutor?.education || []);
  const [experience, setExperience] = useState<any[]>(tutor?.experience || []);

  // File States
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [certificatePreviews, setCertificatePreviews] = useState<string[]>(tutor?.certificateImages || []);

  // Previews
  const profilePreview = useMemo(() => profileImg ? URL.createObjectURL(profileImg) : tutor?.profilePicture, [profileImg, tutor]);
  const coverPreview = useMemo(() => coverImg ? URL.createObjectURL(coverImg) : tutor?.coverImage, [coverImg, tutor]);
  const videoPreview = useMemo(() => videoFile ? URL.createObjectURL(videoFile) : tutor?.introVideoUrl, [videoFile, tutor]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ bio, education, experience }));
      if (profileImg) formData.append("profileImg", profileImg);
      if (coverImg) formData.append("coverImg", coverImg);
      if (videoFile) formData.append("videoFile", videoFile);
      certificates.forEach(file => formData.append("certificates", file));

      const res = await fetch(`https://toturhub-dev.onrender.com/api/v1/tutors/profile?publish=false`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, accept: "*/*" },
        body: formData
      });

      if (res.ok) {
        toast.success("Profile updated!");
        setIsOpen(false);
        onRefresh();
      } else {
        const errText = await res.text();
        toast.error("Update failed: " + errText);
      }
    } catch {
      toast.error("Connection error");
    } finally {
      setUpdating(false);
    }
  };

  // Handle adding certificates
  const handleAddCertificates = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setCertificates(prev => [...prev, ...newFiles]);
    setCertificatePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
  };

  // Handle removing certificate
  const handleRemoveCertificate = (index: number) => {
    setCertificates(prev => prev.filter((_, i) => i !== index));
    setCertificatePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={v => { setIsOpen(v); if (!v) setStep(1); }}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 flex items-center gap-2">
          <Edit3 size={16} /> Edit Portfolio
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl rounded-2xl p-4 overflow-hidden shadow-xl">
        {/* Accessibility */}
        <DialogTitle>Edit Tutor Profile</DialogTitle>
        <DialogDescription>Update your biography, education, experience, media, and certificates.</DialogDescription>

        {/* Header */}
        <div className="flex justify-between items-center border-b px-4 py-3">
          <div>
            <h2 className="text-lg font-bold">Edit Profile</h2>
            <p className="text-xs text-indigo-500 font-semibold">Step {step} of 2</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {step === 1 ? (
            <div className="space-y-4 animate-fade-in">
              {/* Bio */}
              <div className="space-y-1">
                <Label className="text-xs font-bold uppercase text-gray-500">Biography</Label>
                <textarea
                  className="w-full p-2 border rounded-lg text-sm resize-none"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Education */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase text-gray-500">Education</Label>
                  <Button variant="ghost" size="sm" onClick={() => setEducation([...education, { school: "", degree: "", year: "" }])}>
                    <Plus size={14} />
                  </Button>
                </div>
                {education.map((edu, i) => (
                  <div key={i} className="grid grid-cols-12 gap-1 bg-gray-100 p-2 rounded-lg text-xs items-center">
                    <input className="col-span-5 p-1 border rounded" placeholder="School" value={edu.school} onChange={e => { const n = [...education]; n[i].school = e.target.value; setEducation(n); }} />
                    <input className="col-span-4 p-1 border rounded" placeholder="Degree" value={edu.degree} onChange={e => { const n = [...education]; n[i].degree = e.target.value; setEducation(n); }} />
                    <input className="col-span-2 p-1 border rounded text-center" placeholder="Year" value={edu.year} onChange={e => { const n = [...education]; n[i].year = e.target.value; setEducation(n); }} />
                    <button className="col-span-1 text-red-500" onClick={() => setEducation(education.filter((_, idx) => idx !== i))}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase text-gray-500">Experience</Label>
                  <Button variant="ghost" size="sm" onClick={() => setExperience([...experience, { company: "", role: "", duration: "" }])}>
                    <Plus size={14} />
                  </Button>
                </div>
                {experience.map((exp, i) => (
                  <div key={i} className="grid grid-cols-12 gap-1 bg-gray-100 p-2 rounded-lg text-xs items-center">
                    <input className="col-span-4 p-1 border rounded" placeholder="Company" value={exp.company} onChange={e => { const n = [...experience]; n[i].company = e.target.value; setExperience(n); }} />
                    <input className="col-span-4 p-1 border rounded" placeholder="Role" value={exp.role} onChange={e => { const n = [...experience]; n[i].role = e.target.value; setExperience(n); }} />
                    <input className="col-span-3 p-1 border rounded text-center" placeholder="Duration" value={exp.duration} onChange={e => { const n = [...experience]; n[i].duration = e.target.value; setExperience(n); }} />
                    <button className="col-span-1 text-red-500" onClick={() => setExperience(experience.filter((_, idx) => idx !== i))}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Profile & Cover */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative group aspect-square rounded-lg overflow-hidden border bg-gray-50">
                  <img src={profilePreview} className="w-full h-full object-cover" />
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setProfileImg(e.target.files?.[0] || null)} />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Upload className="text-white" /></div>
                </div>
                <div className="relative group aspect-square rounded-lg overflow-hidden border bg-gray-50">
                  {coverPreview ? <img src={coverPreview} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><ImageIcon size={24} className="text-gray-300" /></div>}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setCoverImg(e.target.files?.[0] || null)} />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Upload className="text-white" /></div>
                </div>
              </div>

              {/* Intro Video */}
              <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
                {videoPreview ? <video src={videoPreview} className="w-full h-full object-cover" controls /> : <div className="flex h-full items-center justify-center text-gray-400"><VideoIcon /></div>}
                <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
              </div>

              {/* Certificates */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-gray-500">Certificates</Label>
                <div className="flex flex-wrap gap-2">
                  {certificatePreviews.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                      <img src={url} className="w-full h-full object-cover" />
                      <button className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1" onClick={() => handleRemoveCertificate(i)}><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <label className="w-24 h-24 flex items-center justify-center border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <input type="file" multiple className="hidden" onChange={e => handleAddCertificates(e.target.files)} />
                    <Plus size={20} />
                  </label>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t">
          {step === 2 && <Button variant="outline" className="flex-1" onClick={() => setStep(1)}><ChevronLeft size={14} /> Back</Button>}
          <Button className={`flex-1 text-white ${step === 1 ? 'bg-indigo-600' : 'bg-green-600'}`} onClick={step === 1 ? () => setStep(2) : handleUpdate} disabled={updating}>
            {updating ? <Loader2 className="animate-spin" /> : step === 1 ? "Next" : "Save"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}