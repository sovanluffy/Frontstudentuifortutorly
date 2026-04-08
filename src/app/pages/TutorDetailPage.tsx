"use client";

import React from "react";
import { useLoaderData } from "react-router-dom";
import { useClasses } from "@/hooks/useClasses";
import { TutorCover } from "../components/TutorCover";
import { TutorHeader } from "../components/TutorHeader";
import { TutorSidebar } from "../components/TutorSidebar";
import { TutorTabs } from "../components/TutorTabs";

// Define the Tutor interface (Keep this here or move to a types file)
interface Tutor {
  tutorId: number;
  fullname: string;
  bio?: string;
  profilePicture?: string;
  coverImage?: string;
  introVideoUrl?: string;
  certificateImages?: string[];
  rating?: number;
  studentsTaught?: number;
  education?: { school: string; degree: string; year: string }[];
  experience?: { company: string; role: string; duration: string }[];
  public?: boolean;
  location?: string;
}

export default function TutorDetailPage() {
  const tutor = useLoaderData() as Tutor;
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Fetch classes based on the tutor ID
  const { classes, loading } = useClasses(tutor.tutorId);

  // Setup Cover Image Carousel logic
  const slides = [
    tutor.coverImage || "https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=2070",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644"
  ];

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen pb-12 bg-[#F8FAFC]">
      {/* 1. Cover Carousel */}
      <TutorCover coverImages={slides} currentSlide={currentSlide} />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="relative -mt-16 flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN: Header & Tabs */}
          <div className="flex-1 space-y-6">
            <TutorHeader
              fullname={tutor.fullname}
              profilePicture={tutor.profilePicture || "/fallback-avatar.png"}
              rating={tutor.rating}
              location={tutor.location}
              studentsTaught={tutor.studentsTaught}
              isPublic={tutor.public}
            />
            
            {/* The Tab content (About, Classes, Credentials) */}
            <TutorTabs tutor={tutor} classes={classes} loading={loading} />
          </div>

          {/* RIGHT COLUMN: Inquiry Sidebar */}
          <TutorSidebar
            studentsTaught={tutor.studentsTaught}
            education={tutor.education}
            experience={tutor.experience}
          />
        </div>
      </div>
    </div>
  );
}