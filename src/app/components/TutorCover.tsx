"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TutorCoverProps {
  coverImages: string[];
  currentSlide: number;
}

export function TutorCover({ coverImages, currentSlide }: TutorCoverProps) {
  return (
    <div className="relative h-[200px] w-full overflow-hidden bg-[#0F294D]">
      {coverImages.map((img, index) => (
        <img
          key={index}
          src={img}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            index === currentSlide ? "opacity-40" : "opacity-0"
          )}
          alt="Cover"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />
    </div>
  );
}