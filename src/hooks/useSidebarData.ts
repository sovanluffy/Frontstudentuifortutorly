import { useState, useEffect, useCallback, useRef } from "react";
import Cookies from "js-cookie";

const API_BASE = import.meta.env.VITE_API_BASE || "https://toturhub-dev.onrender.com/api/v1";

export const useSidebarData = (role: string | null, user: any) => {
  const [counts, setCounts] = useState({ unread: 0, pending: 0 });
  const isFetching = useRef(false);

  const fetchCounts = useCallback(async () => {
    if (!user || isFetching.current) return;
    const token = Cookies.get("token");
    if (!token) return;

    try {
      isFetching.current = true;
      const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
      
      const [chatRes, bookingRes] = await Promise.all([
        fetch(`${API_BASE}/chat/unread-count`, { headers }),
        role === "TUTOR" 
          ? fetch(`${API_BASE}/bookings/tutor/me/pending-count`, { headers }) 
          : Promise.resolve(null),
      ]);

      const unread = chatRes?.ok ? await chatRes.json() : 0;
      const pending = bookingRes?.ok ? await bookingRes.json() : 0;
      
      setCounts({ unread, pending });
    } catch (err) {
      console.warn("Sidebar sync failed", err);
    } finally {
      isFetching.current = false;
    }
  }, [role, user]);

  useEffect(() => {
    fetchCounts();
    window.addEventListener("refreshCounts", fetchCounts);
    return () => window.removeEventListener("refreshCounts", fetchCounts);
  }, [fetchCounts]);

  return { counts, fetchCounts };
};