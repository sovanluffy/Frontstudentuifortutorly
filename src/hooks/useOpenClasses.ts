import { useEffect, useState, useCallback } from "react";
import axios from "axios";

/* ================= API BASE ================= */
const API_BASE =
  import.meta.env?.VITE_API_BASE || "http://localhost:8080/api/v1";

/* ================= TYPES ================= */
export interface Schedule {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  maxStudents?: number | null;
  bookedCount?: number | null;
}

export interface StudentPreview {
  studentId: number;
  studentName: string;
  avatar?: string | null;
  email?: string;
}

export interface OpenClass {
  classId: number;
  title: string;
  description: string;
  status: string;

  visibilityStatus?: string | null;

  tutor: {
    tutorId: number;
    name: string;
    avatar?: string | null;
    rating: number;
    email?: string;
    phone?: string;
  };

  location: string;
  specificAddress: string;

  subjects: string[];
  learningModes: string[];

  basePrice: number;
  maxStudents: number;
  currentStudents: number;

  classImage?: string | null;

  schedules: Schedule[];

  isNew: boolean;

  confirmedStudents?: StudentPreview[];
}

/* ================= HOOK ================= */
export function useOpenClasses() {
  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapClass = (item: any): OpenClass => ({
    classId: item.classId,
    title: item.title ?? "Untitled",
    description: item.description ?? "",
    status: item.status ?? "",

    visibilityStatus: item.visibilityStatus ?? null,

    tutor: {
      tutorId: item.tutor?.tutorId ?? 0,
      name: item.tutor?.name ?? "Unknown",
      avatar: item.tutor?.avatar ?? null,
      rating: item.tutor?.rating ?? 0,
      email: item.tutor?.email,
      phone: item.tutor?.phone,
    },

    location: item.location ?? "",
    specificAddress: item.specificAddress ?? "",

    subjects: item.subjects ?? [],
    learningModes: item.learningModes ?? [],

    basePrice: item.basePrice ?? 0,
    maxStudents: item.maxStudents ?? 0,
    currentStudents: item.currentStudents ?? 0,

    classImage: item.classImage ?? null,

    schedules: item.schedules ?? [],

    isNew: item.isNew ?? item.new ?? false,

    confirmedStudents: item.confirmedStudents ?? [],
  });

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${API_BASE}/open-classes/public`);

      const mapped: OpenClass[] = Array.isArray(res.data)
        ? res.data.map(mapClass)
        : [];

      setClasses(mapped);
    } catch (err: any) {
      setError(err?.message || "Failed to load classes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    loading,
    error,
    refetch: fetchClasses,
  };
}