// src/services/apiClient.ts
export async function apiClient(url: string, options?: RequestInit) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`https://toturhub-dev.onrender.com${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}