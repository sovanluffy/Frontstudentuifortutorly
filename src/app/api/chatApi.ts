import axios from "axios";

const API = "https://toturhub-dev.onrender.com/api/v1";

/* ================= TOKEN ================= */
const getToken = () => {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

/* ================= SEND MESSAGE ================= */
export const sendMessage = async (recipientId: number, content: string) => {
  const token = getToken();

  const res = await axios.post(
    `${API}/chat/send`,
    {
      recipientId,
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* ================= CHAT HISTORY ================= */
export const getChatHistory = async (otherUserId: number) => {
  const token = getToken();

  const res = await axios.get(
    `${API}/chat/history/${otherUserId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* ================= MARK AS READ ================= */
export const markAsRead = async (senderId: number) => {
  const token = getToken();

  await axios.put(
    `${API}/chat/read/${senderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};