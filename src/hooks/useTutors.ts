import { useState, useEffect } from "react";

/* ================= ENV API ================= */
const API_BASE =
  import.meta.env?.VITE_API_BASE || "http://localhost:8080/api/v1";

const API = `${API_BASE}/public/tutor-cards`;

/* ================= TYPES ================= */
export interface Tutor {
  tutorId: number;
  fullname: string;
  profilePicture: string;
  rating: number;
  studentsTaught: number;
  bio: string;
  subjects: string[];
  location: string;
  totalOpenClasses: number;
}

/* ================= HOOK ================= */
export function useTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 9;

  useEffect(() => {
    const controller = new AbortController();

    const fetchTutors = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API}?page=${page}&size=${pageSize}`,
          {
            signal: controller.signal,
          }
        );

        if (res.status === 503) {
          throw new Error("Server is waking up. Please try again.");
        }

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const result = await res.json();

        const tutorData = result.data || result;

        setTutors(Array.isArray(tutorData) ? tutorData : []);
        setTotalPages(result.totalPages || 1);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load tutors");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();

    return () => controller.abort();
  }, [page]);

  return {
    tutors,
    loading,
    error,
    page,
    setPage,
    totalPages,
  };
}