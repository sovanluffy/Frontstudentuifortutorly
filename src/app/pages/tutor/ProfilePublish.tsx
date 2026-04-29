"use client";

import React from "react";
import { Globe, EyeOff } from "lucide-react";

interface ProfilePublishProps {
  token: string | null;
  initialPublished: boolean;
  onRefresh: () => void; // parent handles ALL logic (guard + API call)
}

export default function ProfilePublish({
  initialPublished,
  onRefresh,
}: ProfilePublishProps) {
  return (
    <button
      onClick={onRefresh}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-semibold transition-colors ${
        initialPublished
          ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
          : "bg-green-600 hover:bg-green-700 text-white"
      }`}
    >
      {initialPublished ? (
        <>
          <EyeOff size={15} />
          Unpublish
        </>
      ) : (
        <>
          <Globe size={15} />
          Publish Profile
        </>
      )}
    </button>
  );
}