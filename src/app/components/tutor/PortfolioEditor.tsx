import React, { useState, useMemo } from "react";
import { 
  Loader2, Edit3, Upload, Plus, Trash2, 
  ChevronRight, ChevronLeft, Image as ImageIcon, 
  Video as VideoIcon, X 
} from "lucide-react";
import { Button } from "@/app/components/figma/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/app/components/figma/ui/dialog";
import { Label } from "@/app/components/figma/ui/label";
import { toast } from "sonner";

interface PortfolioEditorProps {
  tutor: any;
  token: string | null;
  onRefresh: () => void;
}

// Note: Using "export default" here
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

  // Previews
  const profilePreview = useMemo(() => profileImg ? URL.createObjectURL(profileImg) : tutor?.profilePicture, [profileImg, tutor]);
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
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, accept: '*/*' },
        body: formData 
      });

      if (res.ok) {
        toast.success("Profile updated!");
        setIsOpen(false);
        onRefresh();
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => { setIsOpen(v); if(!v) setStep(1); }}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 text-white px-10 py-7 rounded-[2rem] shadow-xl hover:bg-black transition-all">
          <Edit3 size={18} className="mr-2" /> Edit Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header */}
        <div className="bg-slate-50 px-10 py-8 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">Edit Portal</h2>
            <p className="text-[10px] uppercase font-black text-indigo-500">Step {step} of 2</p>
          </div>
          <div className="flex gap-2">
            <div className={`h-2 w-12 rounded-full transition-all ${step >= 1 ? 'bg-indigo-600' : 'bg-indigo-100'}`} />
            <div className={`h-2 w-12 rounded-full transition-all ${step >= 2 ? 'bg-indigo-600' : 'bg-indigo-100'}`} />
          </div>
        </div>

        {/* Content */}
        <div className="p-10 max-h-[60vh] overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-slate-400">Biography</Label>
                <textarea 
                  className="w-full p-5 border-2 rounded-[1.5rem] h-32 bg-slate-50/50 outline-none focus:border-indigo-500" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Education</Label>
                  <Button variant="ghost" onClick={() => setEducation([...education, {school:"", degree:"", year:""}])}>
                    <Plus size={16}/>
                  </Button>
                </div>
                {education.map((edu, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 bg-indigo-50/50 p-3 rounded-2xl">
                    <input className="col-span-5 p-2 rounded-xl border text-xs" placeholder="School" value={edu.school} onChange={(e) => { const n = [...education]; n[i].school = e.target.value; setEducation(n); }} />
                    <input className="col-span-4 p-2 rounded-xl border text-xs" placeholder="Degree" value={edu.degree} onChange={(e) => { const n = [...education]; n[i].degree = e.target.value; setEducation(n); }} />
                    <input className="col-span-2 p-2 rounded-xl border text-xs text-center" placeholder="Year" value={edu.year} onChange={(e) => { const n = [...education]; n[i].year = e.target.value; setEducation(n); }} />
                    <button className="col-span-1 text-red-400" onClick={() => setEducation(education.filter((_, idx) => idx !== i))}><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div className="relative group aspect-square rounded-[2rem] overflow-hidden border-4 bg-slate-50">
                  <img src={profilePreview} className="w-full h-full object-cover" />
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setProfileImg(e.target.files?.[0] || null)} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Upload className="text-white" /></div>
                </div>
                <div className="relative group aspect-square rounded-[2rem] overflow-hidden border-4 bg-slate-50">
                  {coverImg ? <img src={URL.createObjectURL(coverImg)} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center"><ImageIcon className="text-slate-200" size={40}/></div>}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => setCoverImg(e.target.files?.[0] || null)} />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Upload className="text-white" /></div>
                </div>
              </div>
              <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 aspect-video">
                {videoPreview ? <video src={videoPreview} className="w-full h-full object-cover" controls /> : <div className="flex h-full items-center justify-center text-slate-500"><VideoIcon /></div>}
                <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-10 bg-slate-50 border-t flex gap-4">
          {step === 2 && <Button variant="outline" className="flex-1 py-8 rounded-[2rem]" onClick={() => setStep(1)}><ChevronLeft className="mr-2" /> Back</Button>}
          <Button 
            className={`flex-1 py-8 rounded-[2rem] text-white font-black shadow-xl ${step === 1 ? 'bg-indigo-600' : 'bg-emerald-600'}`} 
            onClick={step === 1 ? () => setStep(2) : handleUpdate} 
            disabled={updating}
          >
            {updating ? <Loader2 className="animate-spin" /> : step === 1 ? "Next Step" : "Confirm Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}