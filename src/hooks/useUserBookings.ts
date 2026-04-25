import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const API_BASE = import.meta.env.VITE_API_BASE;

export function useUserBookings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token"); // 👈 your cookie token

        const res = await fetch(`${API_BASE}/bookings/user/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Hook error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
}