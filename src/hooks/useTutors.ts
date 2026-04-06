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

export function useTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Using an AbortController to prevent memory leaks if component unmounts
    const controller = new AbortController();

    const fetchTutors = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://toturhub-dev.onrender.com/api/v1/public/tutor-cards", {
          signal: controller.signal
        });

        if (res.status === 503) {
          throw new Error("Server is waking up. Please refresh in 30 seconds.");
        }

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const result = await res.json();
        
        // Handle both { data: [...] } and raw [...] responses
        const tutorData = result.data || result;
        setTutors(Array.isArray(tutorData) ? tutorData : []);
        
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || "Failed to load tutors");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();

    return () => controller.abort();
  }, []);

  return { tutors, loading, error };
}