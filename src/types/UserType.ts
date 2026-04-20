export interface UserType {
  id: number; // ✅ FIXED (important)
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  fullname?: string;
}