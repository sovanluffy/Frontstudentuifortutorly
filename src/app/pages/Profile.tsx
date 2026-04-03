import * as React from "react";
import { 
  User, Mail, Phone, MapPin, Camera, 
  Settings, ShieldCheck, LogOut, Loader2, Zap, CheckCircle 
} from 'lucide-react';
import { Button } from '../components/figma/ui/button';
import { Input } from '../components/figma/ui/input';
import { Label } from '../components/figma/ui/label';
import { Badge } from "@/app/components/figma/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/figma/ui/tabs";
import { toast } from "sonner";

export function Profile() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [requesting, setRequesting] = React.useState(false);
  
  const API_BASE = "https://toturhub-dev.onrender.com/api/v1";
  const token = localStorage.getItem("token");

  const isAlreadyTutor = user?.roles?.includes("tutor");

  // --- 1. FETCH PROFILE ---
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          setUser(result);
        }
      } catch (err) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  // --- 2. REQUEST TUTOR ACCESS ---
  const handleRequestTutor = async () => {
    setRequesting(true);
    try {
      const res = await fetch(`${API_BASE}/profile/request-tutor`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        },
        body: '' // Empty body as per your CURL
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Tutor request successful!");
        
        // CRITICAL: Update the local token with the new one from the response
        if (result.token) {
          localStorage.setItem("token", result.token);
        }

        // Refresh to update roles in the entire app
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(result.message || "Failed to request tutor access");
      }
    } catch (err) {
      toast.error("Server connection failed");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen pb-12 bg-[#F8FAFC]">
      <div className="relative h-[160px] w-full bg-[#0F294D]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="relative -mt-12 flex flex-col lg:flex-row gap-6">
          
          <div className="flex-1 space-y-6">
            {/* Header section remains similar */}
            <div className="flex items-end gap-4">
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-white">
                  <img src={user?.avatarUrl} className="w-full h-full object-cover" alt="profile" />
                </div>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user?.fullname}</h1>
                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] h-5 px-2">
                    <ShieldCheck size={10} className="mr-1"/> {user?.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-[12px] font-bold text-slate-500">
                  <span className="flex items-center gap-1"><Mail size={14}/> {user?.email}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="bg-transparent border-b border-slate-200 h-9 p-0 gap-6 rounded-none justify-start">
                <TabsTrigger value="settings" className="rounded-none bg-transparent px-0 text-[12px] font-black uppercase tracking-tighter data-[state=active]:border-b-2 data-[state=active]:border-blue-600 shadow-none">Account Settings</TabsTrigger>
              </TabsList>

              <div className="py-6">
                <TabsContent value="settings" className="mt-0">
                   <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-slate-400">Full Name</Label>
                          <Input readOnly value={user?.fullname} className="h-10 text-[13px] rounded-xl bg-slate-50 border-none" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-slate-400">Phone</Label>
                          <Input readOnly value={user?.phone} className="h-10 text-[13px] rounded-xl bg-slate-50 border-none" />
                        </div>
                      </div>
                   </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-[300px] shrink-0">
            <div className="sticky top-6 space-y-4">
              
              {/* CURRENT ROLES */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                <h3 className="text-[11px] font-black text-slate-400 mb-3 uppercase tracking-widest">Active Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {user?.roles?.map((role: string) => (
                    <Badge key={role} className="bg-slate-900 text-white border-0 text-[10px] px-3 py-0.5 rounded-full capitalize">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* BECOME A TUTOR SECTION */}
              {!isAlreadyTutor ? (
                <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
                  <Zap className="absolute -right-2 -top-2 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform" />
                  <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest mb-1">Opportunities</p>
                  <h3 className="text-lg font-black mb-2 tracking-tight">Become a Tutor</h3>
                  <p className="text-[11px] text-blue-50 leading-relaxed mb-5 opacity-90">
                    Join our team of experts and start earning by teaching students worldwide.
                  </p>
                  <Button 
                    onClick={handleRequestTutor}
                    disabled={requesting}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black text-[12px] h-10 rounded-xl"
                  >
                    {requesting ? <Loader2 className="animate-spin" size={16}/> : "Apply Now"}
                  </Button>
                </div>
              ) : (
                <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-xl shadow-emerald-100">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <CheckCircle size={20} />
                  </div>
                  <h3 className="text-lg font-black mb-1">Tutor Access Active</h3>
                  <p className="text-[11px] text-emerald-50 opacity-90">
                    You can now manage classes and accept student bookings.
                  </p>
                </div>
              )}

              <Button 
                onClick={() => { localStorage.removeItem("token"); window.location.href="/"; }}
                variant="outline" 
                className="w-full h-10 text-[11px] font-black text-slate-400 hover:text-red-500 border-slate-100 rounded-xl"
              >
                Sign Out
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}