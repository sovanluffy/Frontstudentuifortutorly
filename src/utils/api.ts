const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getToken();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // ✅ FIX
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    console.error("Unauthorized - redirect login");
    // optional:
    // window.location.href = "/login";
  }

  return res;
};