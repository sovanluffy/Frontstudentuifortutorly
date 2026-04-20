import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  userId: number;
  roles: string[];
  email: string;
  sub?: string;
  iat?: number;
  exp?: number;
}

/* ================= GET TOKEN ================= */
export const getToken = () => Cookies.get("token");

/* ================= GET USER ================= */
export const getUser = (): TokenPayload | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};

/* ================= ROLE CHECK ================= */
export const hasRole = (role: "STUDENT" | "TUTOR") => {
  const user = getUser();
  return user?.roles?.includes(role) ?? false;
};