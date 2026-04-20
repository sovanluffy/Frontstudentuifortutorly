const API_BASE =
  "https://toturhub-dev.onrender.com/api/v1/notifications";

/* ================= TOKEN ================= */
const getToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(^| )token=([^;]+)")
  );

  return match ? match[2] : null;
};

/* ================= HEADERS ================= */
const authHeaders = () => {
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ================= TYPES ================= */
export interface Notification {
  id: number;
  recipientEmail: string;
  type: string;
  content: string;
  bookingId: number;
  classId: number;
  createdAt: string;
  read: boolean;
}

/* ================= GET MY NOTIFICATIONS ================= */
export const getMyNotifications = async (): Promise<Notification[]> => {
  const res = await fetch(`${API_BASE}/my-notifications`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch notifications");
  }

  return data;
};

/* ================= UNREAD COUNT ================= */
export const getUnreadCount = async (): Promise<number> => {
  const res = await fetch(`${API_BASE}/unread-count`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch unread count");
  }

  return Number(data);
};

/* ================= MARK ONE AS READ ================= */
export const markAsRead = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/read/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Failed to mark as read");
  }
};

/* ================= MARK ALL AS READ ================= */
export const markAllAsRead = async (): Promise<void> => {
  const res = await fetch(`${API_BASE}/read-all`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Failed to mark all as read");
  }
};