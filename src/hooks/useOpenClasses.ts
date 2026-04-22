import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

export interface Schedule {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  maxStudents: number | null;
  bookedCount: number | null;
}

export interface OpenClass {
  classId: number;
  title: string;
  description: string;
  status: string;
  tutor: {
    tutorId: number;
    name: string;
    avatar: string;
    rating: number;
    email: string;
    phone: string;
  };
  location: string;
  specificAddress: string;
  subjects: string[];
  learningModes: string[];
  basePrice: number;
  maxStudents: number;
  currentStudents: number;
  classImage: string | null;
  schedules: Schedule[];
  new: boolean;
}

export function useOpenClasses() {
  const [classes, setClasses] = useState<OpenClass[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/open-classes/public`);
      setClasses(res.data);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  return { classes, loading, refetch: fetchClasses };
}