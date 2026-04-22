import { useState, useEffect } from "react";

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

const API = "https://toturhub-dev.onrender.com/api/v1/public/tutor-cards";

export function useTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 9;

  useEffect(() => {
    const controller = new AbortController();

    const fetchTutors = async () => {
      try {
        setLoading(true);

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

        // backend expected format:
        // { data: [], totalPages: number }
        const tutorData = result.data || result;

        setTutors(Array.isArray(tutorData) ? tutorData : []);

        // safe fallback
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

    // pagination
    page,
    setPage,
    totalPages,
  };
}