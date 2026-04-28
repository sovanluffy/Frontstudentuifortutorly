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
  description?: string;
  classImage?: string | null;

  status?: string;
  visibilityStatus?: string | null;

  // Date & Duration
  startDate?: string | null;
  endDate?: string | null;
  durationType?: string | null;
  durationValue?: number | null;

  // Tutor
  tutor?: {
    tutorId?: number;
    name?: string;
    avatar?: string | null;
    rating?: number;
    email?: string;
    phone?: string;
  };

  // Location
  location?: string;
  specificAddress?: string;

  // Class Info
  subjects?: string[];
  learningModes?: string[];
  basePrice?: number;
  maxStudents?: number;
  currentStudents?: number;

  // Students
  confirmedStudents?: StudentPreview[];

  // Weekly Schedule
  schedules?: Schedule[];

  // Misc
  createdAt?: string | null;
  newUntil?: string | null;
  isCopy?: boolean | null;
  originalClassId?: number | null;
  isnew: boolean;           // ← Keep consistent with your original
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
    classImage: item.classImage ?? null,

    status: item.status ?? "",
    visibilityStatus: item.visibilityStatus ?? null,

    startDate: item.startDate ?? null,
    endDate: item.endDate ?? null,
    durationType: item.durationType ?? null,
    durationValue: item.durationValue ?? null,

    tutor: {
      tutorId: item.tutor?.tutorId ?? 0,
      name: item.tutor?.name ?? "Unknown Tutor",
      avatar: item.tutor?.avatar ?? null,
      rating: item.tutor?.rating ?? 0,
      email: item.tutor?.email ?? "",
      phone: item.tutor?.phone ?? "",
    },

    location: item.location ?? "",
    specificAddress: item.specificAddress ?? "",

    subjects: item.subjects ?? [],
    learningModes: item.learningModes ?? [],

    basePrice: item.basePrice ?? 0,
    maxStudents: item.maxStudents ?? 0,
    currentStudents: item.currentStudents ?? 0,

    schedules: item.schedules ?? [],

    confirmedStudents: item.confirmedStudents ?? [],

    // Fixed: Use 'isnew' to match the interface
    isnew: item.isNew ?? item.new ?? item.isnew ?? false,

    createdAt: item.createdAt ?? null,
    newUntil: item.newUntil ?? null,
    isCopy: item.isCopy ?? null,
    originalClassId: item.originalClassId ?? null,
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
      console.error("Error fetching open classes:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load classes");
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