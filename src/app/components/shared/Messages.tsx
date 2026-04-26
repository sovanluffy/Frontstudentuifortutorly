"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { 
  Send, Search, User, MessageSquare, 
  Mic, Image as ImageIcon, Loader2, Play, Pause, 
  ChevronLeft, MoreVertical
} from "lucide-react";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

/* ================= TYPES ================= */
interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  timestamp: string;
  read: boolean;
  mediaUrl?: string;
  messageType?: "USER" | "IMAGE" | "AUDIO" | "SYSTEM" | "VIDEO";
}

interface ChatContact {
  userId: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  unreadCount: number;
  lastTime: string;
}

/* ================= UTILS ================= */
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").find((row) => row.startsWith(name + "="))?.split("=")[1];
};

const decodeToken = (token: string) => {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
};

/* ================= AUDIO PLAYER ================= */
const AudioPlayer = ({ url, isMe }: { url: string; isMe: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-[24px] min-w-[200px] ${isMe ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"}`}>
      <button type="button" onClick={togglePlay} className={`p-2 rounded-full shadow-sm ${isMe ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}>
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>
      <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
        <div className={`h-full transition-all ${isMe ? "bg-white" : "bg-blue-600"}`} style={{ width: `${progress}%` }} />
      </div>
      <audio ref={audioRef} src={url} onTimeUpdate={() => setProgress((audioRef.current!.currentTime / audioRef.current!.duration) * 100)} onEnded={() => setIsPlaying(false)} className="hidden" />
    </div>
  );
};

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const stompRef = useRef<Stomp.Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = getCookie("token");
  const userData = useMemo(() => (token ? decodeToken(token) : null), [token]);
  const currentUserId = userData?.userId;
  const userEmail = userData?.sub; // Usually 'sub' holds the email/username in JWT

  const recipientId = location.state?.recipientId;
  const recipientName = location.state?.recipientName || "Chat";
  const recipientAvatar = location.state?.avatar;

  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  /* ================= FETCH INITIAL DATA ================= */
  const loadContacts = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/chat/contacts`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Contacts Error:", e); }
  }, [token]);

  const loadMessages = useCallback(async () => {
    if (!recipientId || !token) return;
    try {
      const res = await fetch(`${API_BASE}/chat/history/${recipientId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      
      // Mark as read immediately when opening the chat
      await fetch(`${API_BASE}/chat/read/${recipientId}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
      loadContacts();
    } catch (e) { console.error("Messages Error:", e); }
  }, [recipientId, token, loadContacts]);

  useEffect(() => { loadContacts(); }, [loadContacts]);
  useEffect(() => { loadMessages(); }, [loadMessages, recipientId]);

  /* ================= REAL-TIME WEBSOCKET SYNC ================= */
  useEffect(() => {
    if (!token) return;
    const socket = new SockJS("https://toturhub-dev.onrender.com/ws");
    const stomp = Stomp.over(socket);
    stomp.debug = () => {}; 
    
    stomp.connect({ Authorization: `Bearer ${token}` }, () => {
      setConnected(true);
      stompRef.current = stomp;
      
      // SUBSCRIBE TO PRIVATE QUEUE
      stomp.subscribe("/user/queue/messages", (msg) => {
        const incoming: Message = JSON.parse(msg.body);
        
        // 1. Update Chat Window
        const isFromCurrentChat = (incoming.senderId === recipientId || (incoming.messageType === "SYSTEM" && incoming.senderId === recipientId));
        const isToCurrentChat = (incoming.recipientId === recipientId);

        if (isFromCurrentChat || isToCurrentChat) {
          setMessages((prev) => {
             const exists = prev.some(m => m.id === incoming.id);
             return exists ? prev : [...prev, incoming];
          });
          
          // Auto-mark as read if we are looking at this chat right now
          if (incoming.senderId === recipientId) {
             fetch(`${API_BASE}/chat/read/${recipientId}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
          }
        }

        // 2. Update Sidebar Instantly
        setContacts((prev) => {
          const otherPartyId = incoming.senderId === currentUserId ? incoming.recipientId : incoming.senderId;
          
          const updated = prev.map((c) => {
            if (c.userId === otherPartyId) {
              return {
                ...c,
                lastMessage: incoming.content || "Attachment",
                lastTime: incoming.timestamp,
                unreadCount: (otherPartyId === recipientId || incoming.senderId === currentUserId) ? 0 : c.unreadCount + 1
              };
            }
            return c;
          });
          return updated.sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());
        });
      });
    });

    return () => { if (stomp?.connected) stomp.disconnect(() => {}); };
  }, [token, recipientId, currentUserId]);

  /* ================= SEND ACTIONS ================= */
  const handleSend = async (e?: React.FormEvent, file?: File) => {
    if (e) e.preventDefault();
    if (!input.trim() && !file) return;

    const msgContent = input.trim();
    if (!file) setInput(""); // Clear text immediately for better UX

    const formData = new FormData();
    formData.append("recipientId", recipientId.toString());
    if (msgContent) formData.append("content", msgContent);
    if (file) { 
        formData.append("file", file); 
        setIsUploading(true); 
    }

    try {
      const res = await fetch(`${API_BASE}/chat/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const newMsg = await res.json();
      
      // Update UI
      setMessages((prev) => [...prev, newMsg]);
      setIsUploading(false);
      
      // Update Sidebar for "Me"
      setContacts(prev => prev.map(c => 
        c.userId === recipientId ? { ...c, lastMessage: msgContent || "File", lastTime: new Date().toISOString() } : c
      ).sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()));
      
    } catch (err) { 
      setIsUploading(false); 
      console.error("Send failed", err);
    }
  };

  const SystemAlert = ({ msg }: { msg: Message }) => (
    <div className="flex justify-center my-4">
      <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 shadow-sm">
        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest text-center">{msg.content}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white font-sans">
      
      {/* SIDEBAR */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-100 flex flex-col ${recipientId ? "hidden md:flex" : "flex"}`}>
        <div className="p-6">
          <h2 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase mb-6">Messages</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" placeholder="Search chats..." 
              className="w-full bg-slate-50 rounded-2xl py-3 pl-12 text-xs font-bold outline-none border border-slate-100 focus:border-blue-300 transition-all"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {contacts.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
            <button key={c.userId} onClick={() => navigate("/messages", { state: { recipientId: c.userId, recipientName: c.name, avatar: c.avatar } })}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${recipientId === c.userId ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:bg-slate-50 text-slate-600"}`}>
              <div className="relative shrink-0">
                <img src={c.avatar || `https://ui-avatars.com/api/?name=${c.name}&background=random`} className="w-12 h-12 rounded-full object-cover border-2 border-white" alt="" />
                {c.unreadCount > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full border-2 border-white flex items-center justify-center font-black animate-bounce">{c.unreadCount}</div>}
              </div>
              <div className="flex-1 text-left truncate">
                <div className="flex justify-between items-center">
                    <span className="font-black text-sm truncate">{c.name}</span>
                    <span className="text-[9px] opacity-70 font-bold">{c.lastTime && new Date(c.lastTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
                <p className={`text-[11px] truncate mt-0.5 font-medium ${recipientId === c.userId ? "text-blue-100" : "text-slate-400"}`}>{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT MAIN WINDOW */}
      <div className={`flex-1 flex flex-col bg-white ${!recipientId ? "hidden md:flex" : "flex"}`}>
        {recipientId ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate("/messages", { state: null })} className="md:hidden p-2 text-slate-400"><ChevronLeft size={24}/></button>
                <div className="relative">
                    <img src={recipientAvatar || `https://ui-avatars.com/api/?name=${recipientName}`} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border shadow-sm" alt="" />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${connected ? "bg-emerald-500" : "bg-slate-300"}`} />
                </div>
                <div>
                  <h3 className="font-black text-sm md:text-base text-slate-800 leading-none mb-1">{recipientName}</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{connected ? "Active Now" : "Offline"}</span>
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={20}/></button>
            </div>

            {/* Messages Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-[#f8fafc]">
              {messages.map((msg, idx) => (
                msg.messageType === "SYSTEM" ? <SystemAlert key={idx} msg={msg} /> : (
                  <div key={idx} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-[24px] shadow-sm relative group ${msg.senderId === currentUserId ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-700 rounded-tl-none border border-slate-100"}`}>
                      {msg.messageType === "IMAGE" && (
                        <div className="mb-2 overflow-hidden rounded-xl">
                            <img src={msg.mediaUrl} className="max-h-80 w-full object-cover hover:scale-105 transition-transform duration-500" alt="" />
                        </div>
                      )}
                      {msg.messageType === "AUDIO" && <AudioPlayer url={msg.mediaUrl!} isMe={msg.senderId === currentUserId} />}
                      {msg.content && <p className="font-bold text-[13px] md:text-sm leading-relaxed">{msg.content}</p>}
                      <div className={`text-[8px] font-black opacity-40 mt-1.5 uppercase tracking-tighter ${msg.senderId === currentUserId ? "text-right" : "text-left"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                        {msg.senderId === currentUserId && (msg.read ? " • Read" : " • Sent")}
                      </div>
                    </div>
                  </div>
                )
              ))}
              <div ref={scrollRef} className="h-2" />
            </div>

            {/* Input Footer */}
            <div className="p-4 md:p-6 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="flex gap-2 md:gap-4 max-w-6xl mx-auto items-end">
                <div className="flex gap-1 mb-1">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                        {isUploading ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20}/>}
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,audio/*,video/*" onChange={(e) => e.target.files?.[0] && handleSend(undefined, e.target.files[0])} />
                </div>
                
                <div className="flex-1 relative">
                    <textarea 
                        rows={1}
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder="Write a message..." 
                        className="w-full px-6 py-3 bg-slate-50 border border-transparent focus:border-blue-200 focus:bg-white rounded-3xl font-bold text-sm outline-none transition-all resize-none overflow-hidden" 
                    />
                </div>

                <button type="submit" disabled={!input.trim() && !isUploading} className="bg-blue-600 text-white p-4 rounded-full font-black shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-90 transition-all disabled:opacity-50 disabled:shadow-none mb-0.5">
                    <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-200 bg-[#f8fafc]">
             <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-50 mb-6">
                <MessageSquare size={100} strokeWidth={1} className="text-blue-100" />
             </div>
             <h3 className="text-xl font-black uppercase tracking-widest italic text-slate-400">Select a connection</h3>
             <p className="text-slate-300 font-bold text-sm mt-2">Pick a person from the left to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;