const API_BASE = "https://toturhub-dev.onrender.com/api/v1/bookings";

/* ================= TOKEN ================= */
const getToken = (): string | null => {
  if (typeof document === "undefined") return null;

  return document.cookie.match(/token=([^;]+)/)?.[1] || null;
};

/* ================= HEADERS ================= */
const authHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* ================= TYPES ================= */
export interface Booking {
  bookingId: number;
  userId: number;
  classId: number;
  classTitle: string;
  scheduleId: number;
  day: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  note: string;
  telegram: string;
  createdAt: string;
}

/* ================= STUDENT ================= */

/** GET MY BOOKINGS (STUDENT SELF) */
export const getMyBookings = async (): Promise<Booking[]> => {
  const res = await fetch(`${API_BASE}/user/me`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch my bookings");

  return res.json();
};

/** GET BY USER ID (ADMIN/DEBUG) */
export const getBookingsByUserId = async (
  userId: number
): Promise<Booking[]> => {
  const res = await fetch(`${API_BASE}/user/${userId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch bookings by user");

  return res.json();
};

/* ================= TUTOR ================= */

/** GET MY TUTOR BOOKINGS (RECOMMENDED) */
export const getMyTutorBookings = async (): Promise<Booking[]> => {
  const res = await fetch(`${API_BASE}/tutor/me`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch tutor bookings");

  return res.json();
};

/** GET BY TUTOR ID (OPTIONAL) */
export const getTutorBookings = async (
  tutorId: number
): Promise<Booking[]> => {
  const res = await fetch(`${API_BASE}/tutor/${tutorId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch tutor bookings");

  return res.json();
};

/* ================= CLASS ================= */
export const getBookingsByClassId = async (
  classId: number
): Promise<Booking[]> => {
  const res = await fetch(`${API_BASE}/class/${classId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch class bookings");

  return res.json();
};

/* ================= ACTIONS ================= */

/** CONFIRM BOOKING */
export const confirmBooking = async (bookingId: number) => {
  const res = await fetch(`${API_BASE}/confirm/${bookingId}`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to confirm booking");

  return res.json();
};

/** REJECT BOOKING */
export const rejectBooking = async (bookingId: number) => {
  const res = await fetch(`${API_BASE}/reject/${bookingId}`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to reject booking");

  return res.json();
};