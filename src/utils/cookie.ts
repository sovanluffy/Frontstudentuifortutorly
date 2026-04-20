/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];

    const [key, value] = cookie.split("=");

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return null;
};

/**
 * Set cookie
 */
export const setCookie = (
  name: string,
  value: string,
  days: number = 7
): void => {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie =
    `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
};

/**
 * Delete cookie
 */
export const deleteCookie = (name: string): void => {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};