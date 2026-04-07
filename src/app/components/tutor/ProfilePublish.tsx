"use client";
import React, { useState } from "react";
import { Button } from "@/app/components/figma/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfilePublishProps {
  token: string | null;
  initialPublished: boolean; // ✅ matches prop from parent
  onRefresh: () => void;
}

export default function ProfilePublish({
  token,
  initialPublished,
  onRefresh,
}: ProfilePublishProps) {
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(initialPublished);

  const handleTogglePublish = async () => {
    if (!token) {
      toast.error("Token not found");
      return;
    }

    setLoading(true);
    try {
      const url = isPublished
        ? "https://toturhub-dev.onrender.com/api/v1/tutors/unpublish"
        : "https://toturhub-dev.onrender.com/api/v1/tutors/publish";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      });

      if (res.ok) {
        const message = isPublished
          ? "Profile unpublished"
          : "Profile published";
        toast.success(message);
        setIsPublished(!isPublished); // update button immediately
        onRefresh(); // refresh tutor data if needed
      } else {
        toast.error("Action failed");
      }
    } catch {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold ${
        isPublished
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-600 hover:bg-green-700"
      }`}
      onClick={handleTogglePublish}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="animate-spin mr-2 inline-block" size={16} />
      ) : isPublished ? (
        "Unpublish Profile"
      ) : (
        "Publish Profile"
      )}
    </Button>
  );
}