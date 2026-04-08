// src/features/class/hooks/useClasses.ts
import { useEffect, useState } from "react";
import { getClassesByTutor } from "@/app/api/openClassService";
import { OpenClass } from "@/types/types";

export function useClasses(tutorId: number) {
  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tutorId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getClassesByTutor(tutorId);
        setClasses(data);
      } catch (error) {
        console.error("Fetch classes error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tutorId]);

  return { classes, loading };
}