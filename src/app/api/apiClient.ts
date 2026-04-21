const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

/* ================= TOKEN ================= */
export const getToken = () => {
  if (typeof document === "undefined") return null;

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

/* ================= HEADERS ================= */
export const authHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* ================= CORE FETCH WRAPPER ================= */
const request = async (url: string, options?: RequestInit) => {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API Error: ${url}`);
  }

  return res.json();
};

/* ================= EXPORT METHODS ================= */
export const apiGet = (url: string) =>
  request(url, { method: "GET" });

export const apiPost = (url: string, body: any) =>
  request(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiPut = (url: string, body?: any) =>
  request(url, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });