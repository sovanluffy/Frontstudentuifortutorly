import { useEffect, useState, useCallback } from "react";
import axios from "axios";

/* ================= ENV API ================= */
// fallback if env is not defined
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ||
  "http://localhost:8080/api/v1";

/* ================= TYPES ================= */
export interface Tutor {
  tutorId: number;
  name: string;
  avatar?: string | null;
  rating: number;
  email?: string;
  phone?: string;
}

export interface Schedule {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  bookedCount: number;
}

export interface OpenClass {
  classId: number;
  title: string;
  description: string;
  status: string;
  classImage?: string;
  basePrice: number;
  maxStudents: number;
  currentStudents: number;
  location: string;
  specificAddress: string;
  subjects: string[];
  new?: boolean;

  tutor: Tutor;
  schedules: Schedule[];
}

/* ================= CLASS API HOOK ================= */
export function ClassApi(classId?: string | number) {
  const [data, setData] = useState<OpenClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* GET CLASS DETAIL */
  const fetchClass = useCallback(async () => {
    if (!classId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${API_BASE}/open-classes/${classId}`
      );

      setData(res.data);
    } catch (err: any) {
      setError(err?.message || "Failed to load class");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  /* BOOK CLASS */
  const bookClass = async (payload: {
    scheduleId: number;
    telegram: string;
    note?: string;
  }) => {
    try {
      const token = document.cookie.match(/token=([^;]+)/)?.[1];

      const res = await axios.post(
        `${API_BASE}/bookings/book-class/${classId}`,
        {
          dayTimeSlotId: payload.scheduleId,
          telegram: payload.telegram,
          note: payload.note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Booking failed");
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchClass,
    bookClass,
  };
}