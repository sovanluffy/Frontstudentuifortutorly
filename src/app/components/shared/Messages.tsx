"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Send, Search, MoreVertical, Phone, Video, User, MessageSquare, ShieldAlert } from "lucide-react";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

/* ================= TYPES ================= */
interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  timestamp: string;
  read: boolean;
  messageType?: "USER" | "SYSTEM";
}

interface ChatContact {
  userId: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  unreadCount: number;
  lastTime: string;
}

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").find((row) => row.startsWith(name + "="))?.split("=")[1];
};

const decodeToken = (token: string) => {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
};

const chatCache: Record<number, Message[]> = {};

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const stompRef = useRef<Stomp.Client | null>(null);

  const token = getCookie("token");
  const userData = useMemo(() => (token ? decodeToken(token) : null), [token]);
  const currentUserId = userData?.userId;

  const recipientId = location.state?.recipientId;
  const recipientName = location.state?.recipientName || "Chat";
  const recipientAvatar = location.state?.avatar;

  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /* ================= API ACTIONS ================= */
  const loadContacts = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/chat/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
      window.dispatchEvent(new Event("refreshCounts"));
    } catch (err) { console.error("Contacts load error:", err); }
  }, [token]);

  const loadMessages = useCallback(async () => {
    // GUARD: Prevent 400 error by ensuring ID is a valid number
    if (!recipientId || isNaN(Number(recipientId)) || !token) return;

    try {
      if (chatCache[recipientId]) setMessages(chatCache[recipientId]);
      
      const res = await fetch(`${API_BASE}/chat/history/${recipientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await res.json();

      if (Array.isArray(data)) {
        chatCache[recipientId] = data;
        setMessages(data);
      } else {
        console.error("API Error (History):", data);
        setMessages([]); // Fallback to empty array
      }
      
      setTimeout(scrollToBottom, 100);
    } catch (err) { 
      console.error("History fetch failure:", err);
      setMessages([]); 
    }
  }, [recipientId, token, scrollToBottom]);

  /* ================= EFFECTS ================= */
  useEffect(() => { loadContacts(); }, [loadContacts]);
  useEffect(() => { loadMessages(); }, [loadMessages, recipientId]);

  useEffect(() => {
    if (!recipientId || isNaN(Number(recipientId)) || !token) return;
    fetch(`${API_BASE}/chat/read/${recipientId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      loadContacts();
      window.dispatchEvent(new Event("refreshCounts"));
    }).catch(console.error);
  }, [recipientId, token, loadContacts]);

  useEffect(() => {
    if (!token || !recipientId) return;

    const socket = new SockJS("https://toturhub-dev.onrender.com/ws");
    const stomp = Stomp.over(socket);
    stomp.debug = () => {}; 

    stomp.connect({ Authorization: `Bearer ${token}` }, 
      () => {
        setConnected(true);
        stompRef.current = stomp;
        stomp.subscribe("/user/queue/messages", (msg) => {
          const data: Message = JSON.parse(msg.body);
          setMessages((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            if (safePrev.some((m) => m.id === data.id)) return safePrev;
            const updated = [...safePrev, data]; 
            chatCache[recipientId] = updated;
            return updated;
          });
          loadContacts();
          window.dispatchEvent(new Event("refreshCounts"));
        });
      }, 
      (err) => {
        console.error("STOMP connection failed:", err);
        setConnected(false);
      }
    );

    return () => {
      if (stomp.connected) stomp.disconnect(() => setConnected(false));
    };
  }, [token, recipientId, loadContacts]);

  /* ================= SEND HANDLER ================= */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = input.trim();
    if (!messageContent || !recipientId || !token || !connected) return;

    try {
      const res = await fetch(`${API_BASE}/chat/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId, content: messageContent }),
      });

      if (!res.ok) throw new Error("Send failed");
      const newMsg = await res.json();
      
      const finalizedMsg = {
        ...newMsg,
        timestamp: newMsg.timestamp || new Date().toISOString()
      };

      setMessages((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const updated = [...safePrev, finalizedMsg]; 
        chatCache[recipientId] = updated;
        return updated;
      });
      
      setInput("");
      loadContacts();
      window.dispatchEvent(new Event("refreshCounts"));
    } catch (err) { console.error("Send error:", err); }
  };

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-slate-900">
      {/* SIDEBAR */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Messages</h2>
            <div className="p-2 bg-white rounded-full border border-slate-200 shadow-sm">
               <ShieldAlert size={16} className={connected ? "text-green-500" : "text-red-500"} />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search"
              className="w-full bg-white border border-slate-200 rounded-2xl py-2 pl-10 pr-4 text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
          {filteredContacts.map((c) => (
            <button
              key={c.userId}
              onClick={() => navigate("/messages", { state: { recipientId: c.userId, recipientName: c.name, avatar: c.avatar } })}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl transition-all ${
                recipientId === c.userId ? "bg-white shadow-md ring-1 ring-black/5" : "hover:bg-slate-200/50"
              }`}
            >
              <div className="relative flex-shrink-0">
                {c.avatar ? <img src={c.avatar} className="w-12 h-12 rounded-2xl object-cover" /> : <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{c.name?.charAt(0)}</div>}
                {c.unreadCount > 0 && <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-50">{c.unreadCount}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-slate-800 truncate text-[14.5px]">{c.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{c.lastTime && new Date(c.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className={`text-xs truncate ${c.unreadCount > 0 ? "text-slate-900 font-semibold" : "text-slate-500"}`}>{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT VIEW */}
      <div className="flex-1 flex flex-col relative">
        {recipientId ? (
          <>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                  {recipientAvatar ? <img src={recipientAvatar} className="w-full h-full object-cover" /> : <User className="p-2 text-slate-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">{recipientName}</h3>
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500" : "bg-red-400 animate-pulse"}`} />
                    {connected ? "Active now" : "Connecting..."}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC] flex flex-col">
              <div className="flex-1" />
              <div className="space-y-6">
                {(Array.isArray(messages) ? messages : []).map((msg, idx) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-[70%]">
                        <div className={`px-4 py-2.5 shadow-sm text-sm ${isMe ? "bg-blue-600 text-white rounded-2xl rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-none"}`}>
                          {msg.content}
                        </div>
                        <p className={`text-[10px] mt-1 text-slate-400 font-medium ${isMe ? "text-right" : "text-left"}`}>
                           {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div ref={scrollRef} className="pt-4" />
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="flex items-center gap-3 max-w-4xl mx-auto">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={connected ? "Type a message..." : "Waiting..."} disabled={!connected} className="flex-1 px-5 py-3 rounded-2xl bg-slate-100 outline-none text-sm" />
                <button type="submit" disabled={!input.trim() || !connected} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl disabled:opacity-50"><Send size={18} /></button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
             <MessageSquare size={48} className="mb-2 opacity-20" />
             <p className="font-bold text-slate-600">Select a chat to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;