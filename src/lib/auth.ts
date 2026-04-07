// src/lib/auth.ts
export function getToken(): string | null {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  if (match) return match[2];
  return localStorage.getItem("token");
}