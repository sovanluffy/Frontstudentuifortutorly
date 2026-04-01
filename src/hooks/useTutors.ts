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
    const fetchTutors = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("https://toturhub-dev.onrender.com/api/v1/public/tutor-cards");
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setTutors(data.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return { tutors, loading, error };
}