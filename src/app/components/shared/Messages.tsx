"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Send } from "lucide-react";

/* ================= API ================= */
import {
  sendMessage,
  getChatHistory,
  markAsRead,
} from "@/app/api/chatApi";

/* ================= TYPE ================= */
interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  timestamp: string;
  read: boolean;
  type?: "USER" | "SYSTEM";
}

/* ================= COOKIE ================= */
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
};

/* ================= TOKEN ================= */
const decodeToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

/* ================= CACHE ================= */
const chatCache: Record<number, Message[]> = {};

export const Messages = () => {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const stompRef = useRef<Stomp.Client | null>(null);

  const token = getCookie("token");

  const passedData = location.state as any;
  const recipientId = passedData?.recipientId;
  const recipientName = passedData?.recipientName || "Chat";

  const userData = useMemo(
    () => (token ? decodeToken(token) : null),
    [token]
  );

  const currentUserId = userData?.userId || userData?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  /* ================= LOAD HISTORY ================= */
  const loadMessages = useCallback(async () => {
    if (!recipientId) return;

    try {
      if (chatCache[recipientId]) {
        setMessages(chatCache[recipientId]);
      }

      const data = await getChatHistory(recipientId);

      chatCache[recipientId] = data;
      setMessages(data);
    } catch (err) {
      console.error("Load error:", err);
    }
  }, [recipientId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  /* ================= MARK AS READ ================= */
  useEffect(() => {
    if (!recipientId) return;

    markAsRead(recipientId).catch(console.error);
  }, [recipientId]);

  /* ================= WEBSOCKET (SAFE FIXED) ================= */
  useEffect(() => {
    if (!token || !recipientId) return;

    const socket = new SockJS("https://toturhub-dev.onrender.com/ws");
    const stomp = Stomp.over(socket);
    stomp.debug = () => {};

    stomp.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        setConnected(true);

        stomp.subscribe("/user/queue/messages", (msg) => {
          const data: Message = JSON.parse(msg.body);

          setMessages((prev) => {
            if (prev.some((m) => m.id === data.id)) return prev;

            const updated = [...prev, data];
            chatCache[recipientId] = updated;
            return updated;
          });
        });
      },
      (err) => {
        console.error("WebSocket error:", err);
        setConnected(false);
      }
    );

    stompRef.current = stomp;

    return () => {
      stomp.disconnect(() => {
        setConnected(false);
      });
    };
  }, [token, recipientId]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !recipientId) return;

    try {
      const newMsg = await sendMessage(recipientId, input);

      setMessages((prev) => {
        const updated = [...prev, newMsg];
        chatCache[recipientId] = updated;
        return updated;
      });

      setInput("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= UI ================= */
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">

      {/* LEFT PANEL */}
      <div className="w-80 bg-white border-r hidden md:block p-6">
        <h2 className="text-2xl font-bold mb-6">Messages</h2>

        <div className="p-4 bg-blue-600 text-white rounded-xl">
          <p className="font-bold">{recipientName}</p>
          <p className="text-xs mt-1">
            {connected ? "🟢 Online" : "🔴 Offline"}
          </p>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 flex flex-col">

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">

          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;

            if (msg.type === "SYSTEM") {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-xl text-xs">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[60%] ${
                    isMe
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          <div ref={scrollRef} />
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSend}
          className="p-4 bg-white border-t flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 rounded-xl"
          >
            <Send size={18} />
          </button>
        </form>

      </div>
    </div>
  );
};