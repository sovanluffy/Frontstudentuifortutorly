"use client";

import React, {
  useEffect, useState, useCallback, useMemo, useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
  Send, Search, MessageSquare, Image as ImageIcon, Loader2,
  Play, Pause, ChevronLeft, MoreVertical, Mic, MicOff, X,
  Phone, Video, Check, CheckCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

/* ─────────────────────────── TYPES ─────────────────────────── */
interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  timestamp: string;
  read: boolean;
  mediaUrl?: string;
  messageType?: "USER" | "TEXT" | "IMAGE" | "AUDIO" | "SYSTEM" | "VIDEO" | "FILE";
}

interface ChatContact {
  userId: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  unreadCount: number;
  lastTime: string;
}

/* ─────────────────────────── UTILS ─────────────────────────── */
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").find((r) => r.startsWith(name + "="))?.split("=")[1] ?? null;
};

const decodeToken = (token: string) => {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
};

const formatTime = (s: number): string => {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
};

const formatTimestamp = (ts: string): string => {
  try {
    const d = new Date(ts);
    const diff = Date.now() - d.getTime();
    return diff < 86400000
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch { return ""; }
};

/* ─────────────────────────── AUDIO PLAYER ─────────────────────────── */
const BARS = 28;

const AudioPlayer = ({ url, isMe }: { url: string; isMe: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const bars = useMemo(() => Array.from({ length: BARS }, () => 0.2 + Math.random() * 0.8), []);
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    isPlaying ? a.pause() : a.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    const track = trackRef.current;
    if (!a || !track || !duration) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * duration;
    setProgress(ratio);
  };

  const activeBars = Math.round(progress * BARS);

  return (
    <div className="flex items-center gap-2.5" style={{ minWidth: 210, maxWidth: 260 }}>
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${
          isMe ? "bg-white/25 hover:bg-white/35 text-white" : "bg-[#0084ff] hover:bg-[#0073e6] text-white"
        }`}
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" style={{ marginLeft: 1 }} />}
      </button>

      <div className="flex flex-col flex-1 gap-1.5">
        <div ref={trackRef} onClick={handleSeek} className="flex items-end gap-[2px] h-7 cursor-pointer">
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                height: `${Math.round(h * 100)}%`, minHeight: 3, flex: 1, borderRadius: 99,
                transition: "background-color 0.1s",
                backgroundColor: i < activeBars
                  ? isMe ? "rgba(255,255,255,0.92)" : "#0084ff"
                  : isMe ? "rgba(255,255,255,0.32)" : "#c4cdd6",
              }}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold tabular-nums"
          style={{ color: isMe ? "rgba(255,255,255,0.6)" : "#65676b" }}>
          {isPlaying || currentTime > 0 ? formatTime(currentTime) : formatTime(duration)}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={url}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (!a) return;
          setCurrentTime(a.currentTime);
          setProgress(a.duration ? a.currentTime / a.duration : 0);
        }}
        onEnded={() => { setIsPlaying(false); setProgress(0); setCurrentTime(0); }}
        className="hidden"
      />
    </div>
  );
};

/* ─────────────────────────── VOICE RECORDER ─────────────────────────── */
const VoiceRecorder = ({ onRecorded, disabled }: { onRecorded: (f: File) => void; disabled?: boolean }) => {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = async () => {
    if (disabled || recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecorded(new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" }));
        stream.getTracks().forEach((t) => t.stop());
      };
      mrRef.current = mr;
      mr.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (e) { console.error("Mic denied", e); }
  };

  const stop = () => {
    if (!recording) return;
    mrRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="relative flex items-center">
      {recording && (
        <div className="absolute right-full mr-2 flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-3 py-1 whitespace-nowrap shadow-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[12px] font-semibold text-red-500 tabular-nums">{formatTime(seconds)}</span>
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onMouseDown={start}
        onMouseUp={stop}
        onTouchStart={(e) => { e.preventDefault(); start(); }}
        onTouchEnd={(e) => { e.preventDefault(); stop(); }}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all select-none ${
          recording ? "bg-red-500 text-white scale-110 shadow-lg shadow-red-200" : "text-[#0084ff] hover:bg-[#f0f2f5]"
        }`}
      >
        {recording ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
    </div>
  );
};

/* ─────────────────────────── IMAGE PREVIEW ─────────────────────────── */
const ImagePreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <div className="relative inline-block">
      <img src={url} alt="preview" className="h-20 w-20 object-cover rounded-2xl border-2 border-[#0084ff]/30 shadow" />
      <button type="button" onClick={onRemove}
        className="absolute -top-2 -right-2 bg-[#65676b] text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
        <X size={11} />
      </button>
    </div>
  );
};

/* ─────────────────────────── MAIN ─────────────────────────── */
const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const scrollRef = useRef<HTMLDivElement>(null);
  const stompRef = useRef<Stomp.Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── refs for stable WS callbacks ──
  const messagesRef = useRef<Message[]>([]);
  const recipientIdRef = useRef<number | undefined>(undefined);
  const currentUserIdRef = useRef<number>(0);
  const tokenRef = useRef<string | null>(null);

  const token = getCookie("token");
  const userData = useMemo(() => (token ? decodeToken(token) : null), [token]);
  const currentUserId: number = userData?.userId;
  const userEmail: string = userData?.sub;

  tokenRef.current = token;
  currentUserIdRef.current = currentUserId;

  const recipientId: number | undefined = location.state?.recipientId;
  const recipientName: string = location.state?.recipientName || t("ការជជែក", "Chat");
  const recipientAvatar: string | undefined = location.state?.avatar;

  recipientIdRef.current = recipientId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Keep messagesRef in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // Auto-scroll on new messages
  const scrollToBottom = useCallback((smooth = true) => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  /* ── CONTACTS ── */
  const loadContacts = useCallback(async () => {
    const tk = tokenRef.current;
    if (!tk) return;
    try {
      const res = await fetch(`${API_BASE}/chat/contacts`, { headers: { Authorization: `Bearer ${tk}` } });
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  /* ── MESSAGES ── */
  const loadMessages = useCallback(async (rid?: number) => {
    const tk = tokenRef.current;
    const target = rid ?? recipientIdRef.current;
    if (!target || !tk) return;
    try {
      const res = await fetch(`${API_BASE}/chat/history/${target}`, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
        messagesRef.current = data;
        scrollToBottom(false);
      }
      await fetch(`${API_BASE}/chat/read/${target}`, {
        method: "PUT", headers: { Authorization: `Bearer ${tk}` },
      });
      loadContacts();
    } catch {}
  }, [loadContacts, scrollToBottom]);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  useEffect(() => {
    setMessages([]);
    messagesRef.current = [];
    if (recipientId) loadMessages(recipientId);
  }, [recipientId]); // eslint-disable-line

  /* ── POLLING FALLBACK — catches missed WS frames ── */
  useEffect(() => {
    if (!recipientId) return;
    const interval = setInterval(() => loadMessages(recipientId), 3000);
    return () => clearInterval(interval);
  }, [recipientId, loadMessages]);

  /* ── WEBSOCKET — connect once, never re-subscribe ── */
  useEffect(() => {
    if (!token || !userEmail) return;

    const socket = new SockJS("https://toturhub-dev.onrender.com/ws");
    const stomp = Stomp.over(socket);
    stomp.debug = () => {};

    stomp.connect({ Authorization: `Bearer ${token}` }, () => {
      setConnected(true);
      stompRef.current = stomp;

      stomp.subscribe("/user/queue/messages", (frame) => {
        const incoming: Message = JSON.parse(frame.body);
        const me = currentUserIdRef.current;
        const activeId = recipientIdRef.current;
        const otherPartyId = incoming.senderId === me ? incoming.recipientId : incoming.senderId;

        // ── append to active chat instantly ──
        if (otherPartyId === activeId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            const next = [...prev, incoming];
            messagesRef.current = next;
            return next;
          });
          // mark read
          const tk = tokenRef.current;
          if (tk && incoming.senderId === activeId) {
            fetch(`${API_BASE}/chat/read/${activeId}`, {
              method: "PUT", headers: { Authorization: `Bearer ${tk}` },
            });
          }
        }

        // ── update sidebar ──
        setContacts((prev) => {
          const isCurrentChat = otherPartyId === activeId;
          const addUnread = !isCurrentChat && incoming.senderId !== me ? 1 : 0;
          const exists = prev.some((c) => c.userId === otherPartyId);
          const updated = exists
            ? prev.map((c) => c.userId !== otherPartyId ? c : {
                ...c,
                lastMessage: incoming.content || "📎",
                lastTime: incoming.timestamp,
                unreadCount: isCurrentChat ? 0 : c.unreadCount + addUnread,
              })
            : [...prev, {
                userId: otherPartyId,
                name: t("ទំនាក់ទំនងថ្មី", "New Contact"),
                lastMessage: incoming.content || "📎",
                lastTime: incoming.timestamp,
                unreadCount: addUnread,
              }];
          return updated.sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());
        });
      });
    });

    return () => {
      try { if (stomp?.connected) stomp.disconnect(() => {}); } catch {}
      setConnected(false);
    };
  }, [token, userEmail]); // ✅ no recipientId — never re-creates subscription

  /* ── SEND ── */
  const handleSend = async (e?: React.FormEvent, fileOverride?: File) => {
    if (e) e.preventDefault();
    const file = fileOverride ?? pendingFile;
    if (!input.trim() && !file) return;
    if (!recipientId) return;

    const msgContent = input.trim();
    setInput("");
    setPendingFile(null);
    if (file) setIsUploading(true);

    const form = new FormData();
    form.append("recipientId", recipientId.toString());
    form.append("content", msgContent || "");
    if (file) form.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/chat/send`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const newMsg: Message = await res.json();

      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        const next = [...prev, newMsg];
        messagesRef.current = next;
        return next;
      });

      setContacts((prev) =>
        prev.map((c) => c.userId === recipientId
          ? { ...c, lastMessage: msgContent || "📎", lastTime: new Date().toISOString() }
          : c
        ).sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime())
      );
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) setPendingFile(file);
    else handleSend(undefined, file);
    e.target.value = "";
  };

  /* ── GROUP BY DATE ── */
  const messageGroups = useMemo(() => {
    const groups: { date: string; msgs: Message[] }[] = [];
    messages.forEach((m) => {
      const d = new Date(m.timestamp).toLocaleDateString([], {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
      const last = groups[groups.length - 1];
      if (!last || last.date !== d) groups.push({ date: d, msgs: [m] });
      else last.msgs.push(m);
    });
    return groups;
  }, [messages]);

  /* ── BUBBLE ── */
  const MessageBubble = ({ msg }: { msg: Message }) => {
    const isMe = msg.senderId === currentUserId;
    const isTextOnly =
      (!msg.messageType || msg.messageType === "USER" || msg.messageType === "TEXT") && !msg.mediaUrl;

    const bubbleCls = isTextOnly
      ? isMe
        ? "bg-[#0084ff] text-white rounded-[18px] rounded-br-[4px] px-4 py-2.5"
        : "bg-[#f0f2f5] text-[#1c1e21] rounded-[18px] rounded-bl-[4px] px-4 py-2.5"
      : isMe
        ? "bg-[#0084ff] text-white rounded-[18px] rounded-br-[4px] p-2"
        : "bg-[#f0f2f5] text-[#1c1e21] rounded-[18px] rounded-bl-[4px] p-2";

    return (
      <div className={`flex items-end gap-2 mb-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
        {!isMe ? (
          <img
            src={recipientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientName)}&background=e4e6eb&color=1c1e21`}
            alt={recipientName}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-0.5"
          />
        ) : <div className="w-7 flex-shrink-0" />}

        <div className={`flex flex-col gap-0.5 max-w-[72%] md:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
          <div className={`break-words ${bubbleCls}`} style={{ wordBreak: "break-word" }}>
            {msg.messageType === "IMAGE" && msg.mediaUrl && (
              <img src={msg.mediaUrl} alt="img"
                className="max-h-72 max-w-full rounded-[14px] object-cover cursor-pointer block"
                onClick={() => window.open(msg.mediaUrl, "_blank")} />
            )}
            {msg.messageType === "AUDIO" && msg.mediaUrl && (
              <div className="py-1 px-1"><AudioPlayer url={msg.mediaUrl} isMe={isMe} /></div>
            )}
            {msg.messageType === "VIDEO" && msg.mediaUrl && (
              <video src={msg.mediaUrl} controls className="max-h-60 max-w-full rounded-[14px] block" />
            )}
            {msg.content?.trim() && (
              <p className="text-[15px] leading-[1.4] whitespace-pre-wrap">{msg.content}</p>
            )}
          </div>
          <div className={`flex items-center gap-1 px-0.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
            <span className="text-[11px] text-[#65676b]">{formatTimestamp(msg.timestamp)}</span>
            {isMe && (msg.read
              ? <CheckCheck size={13} className="text-[#0084ff]" />
              : <Check size={13} className="text-[#bcc0c4]" />
            )}
          </div>
        </div>
      </div>
    );
  };

  const SystemAlert = ({ msg }: { msg: Message }) => (
    <div className="flex justify-center my-3">
      <span className="text-[12px] text-[#65676b] bg-white border border-[#e4e6eb] rounded-full px-4 py-1.5 shadow-sm">
        {msg.content}
      </span>
    </div>
  );

  /* ── RENDER ── */
  return (
    <div className="flex h-screen bg-white overflow-hidden"
      style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}>

      {/* ══ SIDEBAR ══ */}
      <div className={`w-full md:w-[360px] bg-white border-r border-[#e4e6eb] flex flex-col flex-shrink-0 ${recipientId ? "hidden md:flex" : "flex"}`}>
        <div className="px-4 pt-5 pb-2">
          <h1 className="text-[22px] font-bold text-[#1c1e21] mb-4">
            {t("ការជជែក", "Chats")}
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65676b]" size={15} />
            <input
              type="text"
              placeholder={t("ស្វែងរក...", "Search...")}
              className="w-full bg-[#f0f2f5] rounded-full py-2 pl-9 pr-4 text-[15px] outline-none placeholder-[#65676b] text-[#1c1e21]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {contacts
            .filter((c) => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((c) => {
              const isActive = recipientId === c.userId;
              return (
                <button
                  key={c.userId}
                  onClick={() => navigate("/messages", {
                    state: { recipientId: c.userId, recipientName: c.name, avatar: c.avatar },
                  })}
                  className={`w-full flex items-center gap-3 px-2 py-2 mx-1 rounded-xl transition-colors text-left ${isActive ? "bg-[#e7f3ff]" : "hover:bg-[#f2f2f2]"}`}
                  style={{ width: "calc(100% - 8px)" }}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=e4e6eb&color=1c1e21`}
                      alt={c.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#31a24c] border-2 border-white" />
                    {c.unreadCount > 0 && (
                      <div className="absolute -top-0.5 -right-0.5 bg-[#0084ff] text-white text-[11px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-white">
                        {c.unreadCount > 9 ? "9+" : c.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className={`text-[15px] truncate ${c.unreadCount > 0 ? "font-bold" : "font-semibold"} text-[#1c1e21]`}>
                        {c.name}
                      </span>
                      <span className="text-[12px] text-[#65676b] flex-shrink-0">
                        {c.lastTime ? formatTimestamp(c.lastTime) : ""}
                      </span>
                    </div>
                    <p className={`text-[13px] truncate mt-0.5 ${c.unreadCount > 0 ? "font-semibold text-[#1c1e21]" : "text-[#65676b]"}`}>
                      {c.lastMessage || t("ចាប់ផ្តើមការសន្ទនា", "Start a conversation")}
                    </p>
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {/* ══ CHAT WINDOW ══ */}
      <div className={`flex-1 flex flex-col min-w-0 bg-white ${!recipientId ? "hidden md:flex" : "flex"}`}>
        {recipientId ? (
          <>
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-[#e4e6eb] flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/messages", { state: null })}
                  className="md:hidden p-2 text-[#0084ff] -ml-2"
                >
                  <ChevronLeft size={22} />
                </button>
                <div className="relative">
                  <img
                    src={recipientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientName)}&background=e4e6eb&color=1c1e21`}
                    alt={recipientName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${connected ? "bg-[#31a24c]" : "bg-[#bcc0c4]"}`} />
                </div>
                <div>
                  <p className="font-bold text-[15px] text-[#1c1e21] leading-tight">{recipientName}</p>
                  <p className="text-[12px] text-[#65676b]">
                    {connected ? t("អនឡាញ", "Active now") : t("គ្មានការតភ្ជាប់", "Offline")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[Phone, Video, MoreVertical].map((Icon, i) => (
                  <button key={i} className="w-9 h-9 flex items-center justify-center rounded-full text-[#0084ff] hover:bg-[#f0f2f5] transition-colors">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
              {messageGroups.map((group) => (
                <div key={group.date}>
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-[#e4e6eb]" />
                    <span className="text-[12px] text-[#65676b] font-medium whitespace-nowrap">{group.date}</span>
                    <div className="flex-1 h-px bg-[#e4e6eb]" />
                  </div>
                  {group.msgs.map((msg, idx) =>
                    msg.messageType === "SYSTEM"
                      ? <SystemAlert key={`sys-${msg.id ?? idx}`} msg={msg} />
                      : <MessageBubble key={`msg-${msg.id ?? idx}`} msg={msg} />
                  )}
                </div>
              ))}
              {/* scroll anchor */}
              <div ref={scrollRef} className="h-2" />
            </div>

            {/* Input bar */}
            <div className="px-3 py-3 bg-white border-t border-[#e4e6eb] flex-shrink-0">
              {pendingFile && (
                <div className="mb-2 px-1">
                  <ImagePreview file={pendingFile} onRemove={() => setPendingFile(null)} />
                </div>
              )}
              <form onSubmit={handleSend} className="flex items-end gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-[#0084ff] hover:bg-[#f0f2f5] transition-colors flex-shrink-0">
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                </button>
                <input type="file" ref={fileInputRef} className="hidden"
                  accept="image/*,audio/*,video/*" onChange={handleFileChange} />

                <VoiceRecorder disabled={isUploading} onRecorded={(file) => handleSend(undefined, file)} />

                <div className="flex-1 bg-[#f0f2f5] rounded-[22px] flex items-end px-4 py-2.5 min-h-[42px]">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                    }}
                    placeholder="Aa"
                    className="flex-1 bg-transparent text-[15px] text-[#1c1e21] placeholder-[#65676b] outline-none resize-none leading-[1.4]"
                    style={{ minHeight: 22, maxHeight: 120 }}
                  />
                </div>

                {input.trim() || pendingFile ? (
                  <button type="submit" disabled={isUploading}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0084ff] text-white hover:bg-[#0073e6] active:scale-90 transition-all flex-shrink-0 shadow-sm">
                    <Send size={17} />
                  </button>
                ) : (
                  <button type="button"
                    className="w-10 h-10 flex items-center justify-center rounded-full text-[#0084ff] hover:bg-[#f0f2f5] transition-colors flex-shrink-0 text-[22px] leading-none">
                    👍
                  </button>
                )}
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white">
            <div className="w-24 h-24 rounded-full bg-[#e7f3ff] flex items-center justify-center mb-5">
              <MessageSquare size={44} className="text-[#0084ff]" strokeWidth={1.5} />
            </div>
            <h2 className="text-[22px] font-bold text-[#1c1e21] mb-2">
              {t("សារបស់អ្នក", "Your messages")}
            </h2>
            <p className="text-[15px] text-[#65676b] text-center max-w-xs leading-relaxed">
              {t("ផ្ញើសារឯកជនទៅគ្រូ និងសិស្ស", "Send private messages to your tutors and students.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;