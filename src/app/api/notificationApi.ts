import axios from "axios";

const API_BASE_URL = "https://toturhub-dev.onrender.com/api/v1/notifications";

// Helper to get token from cookies
const getAuthHeaders = () => {
  const token = document.cookie
    .match(new RegExp("(^| )token=([^;]+)"))?.[2];
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export interface Notification {
  id: number;
  recipientEmail: string;
  content: string;
  type: string;
  bookingId: number;
  classId: number;
  read: boolean; // Maps to isRead in your Java Entity
  createdAt: string;
}

/* ================= API METHODS ================= */

export const getMyNotifications = async (): Promise<Notification[]> => {
  const response = await axios.get(`${API_BASE_URL}/my-notifications`, getAuthHeaders());
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await axios.get(`${API_BASE_URL}/unread-count`, getAuthHeaders());
  return response.data;
};

export const markAsRead = async (id: number): Promise<void> => {
  await axios.patch(`${API_BASE_URL}/read/${id}`, {}, getAuthHeaders());
};

export const markAllAsRead = async (): Promise<void> => {
  await axios.patch(`${API_BASE_URL}/read-all`, {}, getAuthHeaders());
};

export const deleteNotification = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
};