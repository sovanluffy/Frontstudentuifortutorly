"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  MapPin, 
  DollarSign, 
  Users, 
  BookOpen,
  Info
} from "lucide-react";
import { Toaster, toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE;

const TutorEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    basePrice: 0,
    maxStudents: 0,
    location: "",
    specificAddress: "",
    subjects: [] as string[],
    status: "OPEN",
    visibilityStatus: "PUBLIC"
  });

  /* ================= FETCH EXISTING DATA ================= */
  useEffect(() => {
    const fetchClassData = async () => {
      const token = Cookies.get("token");
      try {
        const res = await fetch(`${API_BASE}/open-classes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch class details");
        const data = await res.json();
        
        setFormData({
          title: data.title || "",
          description: data.description || "",
          basePrice: data.basePrice || 0,
          maxStudents: data.maxStudents || 0,
          location: data.location || "",
          specificAddress: data.specificAddress || "",
          subjects: data.subjects || [],
          status: data.status || "OPEN",
          visibilityStatus: data.visibilityStatus || "PUBLIC"
        });
      } catch (error) {
        toast.error("Error loading class data");
        navigate("/tutor/classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id, navigate]);

  /* ================= UPDATE HANDLER ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = Cookies.get("token");

    try {
      const res = await fetch(`${API_BASE}/open-classes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Class updated successfully!");
        setTimeout(() => navigate("/tutor/classes"), 1500);
      } else {
        toast.error("Failed to update class");
      }
    } catch (error) {
      toast.error("Network error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FE]">
        <Loader2 className="animate-spin text-[#4318FF]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-4 md:p-8">
      <Toaster position="top-center" richColors />
      
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation */}
        <button 
          onClick={() => navigate("/tutor/classes")}
          className="flex items-center gap-2 text-slate-500 hover:text-[#4318FF] font-bold transition mb-6"
        >
          <ArrowLeft size={20} /> Back to Classes
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Area */}
          <div className="bg-[#4318FF] p-8 md:p-12 text-white">
            <h1 className="text-3xl font-black mb-2">Edit Class Details</h1>
            <p className="opacity-80 font-medium">Update your class information, pricing, and location.</p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            
            {/* Basic Info Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-[#1B2559] border-b pb-2">
                <Info size={20} className="text-[#4318FF]" />
                <h2 className="text-xl font-bold">General Information</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B2559] ml-1">Class Title</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#F4F7FE] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#4318FF]/20 text-[#1B2559] font-medium"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B2559] ml-1">Description</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full bg-[#F4F7FE] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#4318FF]/20 text-[#1B2559] font-medium"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            </section>

            {/* Pricing & Capacity Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#1B2559] border-b pb-2">
                  <DollarSign size={20} className="text-[#4318FF]" />
                  <h2 className="text-xl font-bold">Pricing</h2>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B2559] ml-1">Base Price ($)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-[#F4F7FE] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#4318FF]/20 text-[#1B2559] font-bold"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#1B2559] border-b pb-2">
                  <Users size={20} className="text-[#4318FF]" />
                  <h2 className="text-xl font-bold">Capacity</h2>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B2559] ml-1">Max Students</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-[#F4F7FE] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#4318FF]/20 text-[#1B2559] font-bold"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({...formData, maxStudents: Number(e.target.value)})}
                  />
                </div>
              </div>
            </section>

            {/* Location Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-[#1B2559] border-b pb-2">
                <MapPin size={20} className="text-[#4318FF]" />
                <h2 className="text-xl font-bold">Location Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B2559] ml-1">City / Region</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#F4F7FE] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#4318FF]/20 text-[#1B2559] font-medium"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1B2559] ml-1">Specific Address</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#F4F7FE] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-[#4318FF]/20 text-[#1B2559] font-medium"
                    value={formData.specificAddress}
                    onChange={(e) => setFormData({...formData, specificAddress: e.target.value})}
                  />
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="pt-6 flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#4318FF] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#3311CC] transition shadow-lg shadow-[#4318FF]/20 flex items-center justify-center gap-3 disabled:bg-slate-400"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => navigate("/tutor/classes")}
                className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default TutorEditPage;