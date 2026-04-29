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
  Phone, Video, Check, CheckCheck, Smile, Paperclip, ThumbsUp,
  Circle, Edit3, Trash2, Reply, Heart, Laugh, Angry
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE = "https://toturhub-dev.onrender.com/api/v1";

/* ─────────────── TYPES ─────────────── */
interface Message {
  id: number;
  content: string;
  senderId: number;
  recipientId: number;
  timestamp: string;
  read: boolean;
  mediaUrl?: string;
  messageType?: "USER" | "TEXT" | "IMAGE" | "AUDIO" | "SYSTEM" | "VIDEO" | "FILE";
  reaction?: string;
  replyTo?: number;
  replyToContent?: string;
}

interface ChatContact {
  userId: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  unreadCount: number;
  lastTime: string;
  isOnline?: boolean;
}

interface TypingState {
  [userId: number]: boolean;
}

/* ─────────────── UTILS ─────────────── */
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
    const now = new Date();
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch { return ""; }
};

const formatGroupDate = (ts: string): string => {
  try {
    const d = new Date(ts);
    const diff = Date.now() - d.getTime();
    if (diff < 86400000) return "Today";
    if (diff < 172800000) return "Yesterday";
    return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  } catch { return ""; }
};

/* ─────────────── EMOJI QUICK REACTIONS ─────────────── */
const REACTIONS = ["❤️", "😆", "😮", "😢", "😠", "👍"];

/* ─────────────── AUDIO PLAYER ─────────────── */
const BARS = 32;

const AudioPlayer = ({ url, isMe }: { url: string; isMe: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const bars = useMemo(() => Array.from({ length: BARS }, () => 0.15 + Math.random() * 0.85), []);
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
    <div className="flex items-center gap-3" style={{ minWidth: 220, maxWidth: 280 }}>
      <button
        type="button"
        onClick={togglePlay}
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 shadow-sm ${
          isMe
            ? "bg-white/25 hover:bg-white/35 text-white"
            : "bg-[#0084ff] hover:bg-[#0073e6] text-white"
        }`}
      >
        {isPlaying
          ? <Pause size={15} fill="currentColor" />
          : <Play size={15} fill="currentColor" style={{ marginLeft: 2 }} />}
      </button>
      <div className="flex flex-col flex-1 gap-1.5">
        <div ref={trackRef} onClick={handleSeek} className="flex items-center gap-[2px] h-8 cursor-pointer">
          {bars.map((h, i) => (
            <div key={i} style={{
              height: `${Math.round(h * 100)}%`,
              minHeight: 4, flex: 1,
              borderRadius: 99,
              transition: "background-color 0.15s, transform 0.15s",
              transform: isPlaying && Math.abs(i - activeBars) <= 2 ? "scaleY(1.3)" : "scaleY(1)",
              backgroundColor: i < activeBars
                ? isMe ? "rgba(255,255,255,0.95)" : "#0084ff"
                : isMe ? "rgba(255,255,255,0.28)" : "#c4cdd6",
            }} />
          ))}
        </div>
        <span className="text-[11px] font-semibold tabular-nums"
          style={{ color: isMe ? "rgba(255,255,255,0.6)" : "#65676b" }}>
          {isPlaying || currentTime > 0 ? formatTime(currentTime) : formatTime(duration)}
        </span>
      </div>
      <audio
        ref={audioRef} src={url}
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

/* ─────────────── VOICE RECORDER ─────────────── */
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
        <div className="absolute right-full mr-2 flex items-center gap-2 bg-white border border-red-100 rounded-full px-3 py-1.5 whitespace-nowrap shadow-md z-10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[12px] font-bold text-red-500 tabular-nums">{formatTime(seconds)}</span>
          <span className="text-[11px] text-gray-400">Release to send</span>
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
          recording
            ? "bg-red-500 text-white scale-110 shadow-lg shadow-red-200"
            : "text-[#0084ff] hover:bg-[#f0f2f5] active:bg-[#e4e6eb]"
        }`}
      >
        {recording ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
    </div>
  );
};

/* ─────────────── IMAGE PREVIEW ─────────────── */
const ImagePreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <div className="relative inline-block group">
      <img src={url} alt="preview" className="h-24 w-24 object-cover rounded-2xl border-2 border-[#0084ff]/30 shadow-md" />
      <button type="button" onClick={onRemove}
        className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-gray-900 transition-colors">
        <X size={11} />
      </button>
    </div>
  );
};

/* ─────────────── TYPING DOTS ─────────────── */
const TypingIndicator = ({ avatar, name }: { avatar?: string; name: string }) => (
  <div className="flex items-end gap-2 mb-2">
    <img src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e4e6eb&color=1c1e21`}
      alt={name} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-0.5" />
    <div className="bg-[#f0f2f5] rounded-[18px] rounded-bl-[4px] px-4 py-3 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-2 h-2 rounded-full bg-[#65676b]"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </div>
  </div>
);

/* ─────────────── REACTION PICKER ─────────────── */
const ReactionPicker = ({ onPick, onClose, style }: {
  onPick: (emoji: string) => void;
  onClose: () => void;
  style?: React.CSSProperties;
}) => (
  <>
    <div className="fixed inset-0 z-10" onClick={onClose} />
    <div
      className="absolute z-20 bg-white rounded-full shadow-2xl border border-gray-100 flex items-center px-2 py-1.5 gap-0.5"
      style={style}
    >
      {REACTIONS.map((emoji) => (
        <button key={emoji} type="button" onClick={() => { onPick(emoji); onClose(); }}
          className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-[20px] transition-all hover:scale-125 active:scale-110">
          {emoji}
        </button>
      ))}
    </div>
  </>
);

/* ─────────────── MAIN ─────────────── */
const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const scrollRef = useRef<HTMLDivElement>(null);
  const stompRef = useRef<Stomp.Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messagesRef = useRef<Message[]>([]);
  const recipientIdRef = useRef<number | undefined>(undefined);
  const currentUserIdRef = useRef<number>(0);
  const tokenRef = useRef<string | null>(null);

  // ── Track last message count to only scroll on genuine new messages ──
  const lastMsgCountRef = useRef<number>(0);

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
  const [typing, setTyping] = useState<TypingState>({});
  const [reactionTarget, setReactionTarget] = useState<number | null>(null);
  const [reactionPos, setReactionPos] = useState<React.CSSProperties>({});
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const scrollToBottom = useCallback((smooth = true) => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
    });
  }, []);

  // ── Only scroll when message COUNT increases (new messages), not on every render ──
  useEffect(() => {
    if (messages.length > lastMsgCountRef.current) {
      lastMsgCountRef.current = messages.length;
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

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
      if (!Array.isArray(data)) return;

      // ── Only update if contacts actually changed ──
      setContacts((prev) => {
        const prevJson = JSON.stringify(prev);
        const nextJson = JSON.stringify(data);
        return prevJson === nextJson ? prev : data;
      });
    } catch {}
  }, []);

  /* ── MESSAGES ── */
  const loadMessages = useCallback(async (rid?: number) => {
    const tk = tokenRef.current;
    const target = rid ?? recipientIdRef.current;
    if (!target || !tk) return;
    try {
      const res = await fetch(`${API_BASE}/chat/history/${target}`, { headers: { Authorization: `Bearer ${tk}` } });
      const data = await res.json();
      if (!Array.isArray(data)) return;

      // ── Only update state if something actually changed ──
      setMessages((prev) => {
        // Fast path: same length and last id matches — nothing new
        if (
          prev.length === data.length &&
          prev.length > 0 &&
          prev[prev.length - 1].id === data[data.length - 1].id
        ) {
          return prev; // return same reference → React skips re-render
        }
        messagesRef.current = data;
        return data;
      });

      // Mark as read silently — no state update needed
      fetch(`${API_BASE}/chat/read/${target}`, { method: "PUT", headers: { Authorization: `Bearer ${tk}` } }).catch(() => {});
    } catch {}
  }, []);

  // ── Separate contacts poll so it doesn't piggyback on every message poll ──
  useEffect(() => {
    loadContacts();
    const interval = setInterval(loadContacts, 15000); // contacts refresh every 15s is plenty
    return () => clearInterval(interval);
  }, [loadContacts]);

  useEffect(() => {
    setMessages([]);
    messagesRef.current = [];
    lastMsgCountRef.current = 0;
    setReplyTo(null);
    if (recipientId) {
      loadMessages(recipientId).then(() => scrollToBottom(false));
    }
  }, [recipientId]); // eslint-disable-line

  /* ── POLLING FALLBACK ── */
  useEffect(() => {
    if (!recipientId) return;
    const interval = setInterval(() => loadMessages(recipientId), 4000);
    return () => clearInterval(interval);
  }, [recipientId, loadMessages]);

  /* ── WEBSOCKET ── */
  useEffect(() => {
    if (!token || !userEmail) return;
    const socket = new SockJS("https://toturhub-dev.onrender.com/ws");
    const stomp = Stomp.over(socket);
    stomp.debug = () => {};

    stomp.connect({ Authorization: `Bearer ${token}` }, () => {
      setConnected(true);
      stompRef.current = stomp;

      // Messages subscription
      stomp.subscribe("/user/queue/messages", (frame) => {
        const incoming: Message = JSON.parse(frame.body);
        const me = currentUserIdRef.current;
        const activeId = recipientIdRef.current;
        const otherPartyId = incoming.senderId === me ? incoming.recipientId : incoming.senderId;

        if (otherPartyId === activeId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            const next = [...prev, incoming];
            messagesRef.current = next;
            return next;
          });
          const tk = tokenRef.current;
          if (tk && incoming.senderId === activeId) {
            fetch(`${API_BASE}/chat/read/${activeId}`, { method: "PUT", headers: { Authorization: `Bearer ${tk}` } });
          }
        }

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

      // Typing subscription
      stomp.subscribe("/user/queue/typing", (frame) => {
        try {
          const { userId, isTyping } = JSON.parse(frame.body);
          setTyping((prev) => ({ ...prev, [userId]: isTyping }));
          if (isTyping) {
            setTimeout(() => setTyping((prev) => ({ ...prev, [userId]: false })), 3000);
          }
        } catch {}
      });
    });

    return () => {
      try { if (stomp?.connected) stomp.disconnect(() => {}); } catch {}
      setConnected(false);
    };
  }, [token, userEmail]);

  /* ── TYPING INDICATOR ── */
  const sendTyping = useCallback((isTyping: boolean) => {
    const stomp = stompRef.current;
    if (!stomp?.connected || !recipientId) return;
    try {
      stomp.send("/app/typing", {}, JSON.stringify({ recipientId, isTyping }));
    } catch {}
  }, [recipientId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    sendTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTyping(false), 2000);
  };

  /* ── SEND ── */
  const handleSend = async (e?: React.FormEvent, fileOverride?: File) => {
    if (e) e.preventDefault();
    const file = fileOverride ?? pendingFile;
    if (!input.trim() && !file) return;
    if (!recipientId) return;

    const msgContent = input.trim();
    setInput("");
    setPendingFile(null);
    setReplyTo(null);
    sendTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (file) setIsUploading(true);

    const form = new FormData();
    form.append("recipientId", recipientId.toString());
    form.append("content", msgContent || "");
    if (file) form.append("file", file);
    if (replyTo) form.append("replyToId", replyTo.id.toString());

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
    } catch (err) { console.error("Send failed", err); }
    finally { setIsUploading(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith("image/")) setPendingFile(file);
    else handleSend(undefined, file);
    e.target.value = "";
  };

  const handleReaction = useCallback((msgId: number, emoji: string) => {
    setMessages((prev) => prev.map((m) =>
      m.id === msgId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m
    ));
  }, []);

  /* ── GROUP BY DATE ── */
  const messageGroups = useMemo(() => {
    const groups: { date: string; msgs: Message[] }[] = [];
    messages.forEach((m) => {
      const d = formatGroupDate(m.timestamp);
      const last = groups[groups.length - 1];
      if (!last || last.date !== d) groups.push({ date: d, msgs: [m] });
      else last.msgs.push(m);
    });
    return groups;
  }, [messages]);

  /* ── CONSECUTIVE GROUPING ── */
  const isConsecutive = (msgs: Message[], idx: number) => {
    if (idx === 0) return false;
    const prev = msgs[idx - 1];
    const curr = msgs[idx];
    return prev.senderId === curr.senderId &&
      new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime() < 60000;
  };

  const isLastInGroup = (msgs: Message[], idx: number) => {
    if (idx === msgs.length - 1) return true;
    return msgs[idx + 1].senderId !== msgs[idx].senderId;
  };

  /* ── BUBBLE ── */
  const MessageBubble = React.memo(({ msg, msgs, idx }: { msg: Message; msgs: Message[]; idx: number }) => {
    const isMe = msg.senderId === currentUserId;
    const consecutive = isConsecutive(msgs, idx);
    const lastInGroup = isLastInGroup(msgs, idx);
    const isHovered = hoveredMsg === msg.id;
    const isText = (!msg.messageType || msg.messageType === "USER" || msg.messageType === "TEXT") && !msg.mediaUrl;
    const replyMsg = msg.replyTo ? messages.find((m) => m.id === msg.replyTo) : null;

    const bubbleBase = isText
      ? isMe
        ? "bg-[#0084ff] text-white"
        : "bg-[#f0f2f5] text-[#1c1e21]"
      : isMe
        ? "bg-[#0084ff] text-white"
        : "bg-[#f0f2f5]";

    const borderRadius = isMe
      ? `18px 18px ${lastInGroup ? "4px" : "18px"} 18px`
      : `18px 18px 18px ${lastInGroup ? "4px" : "18px"}`;

    return (
      <div
        className={`flex items-end gap-2 ${consecutive ? "mt-0.5" : "mt-3"} group/msg ${isMe ? "flex-row-reverse" : "flex-row"}`}
        onMouseEnter={() => setHoveredMsg(msg.id)}
        onMouseLeave={() => setHoveredMsg(null)}
      >
        {/* Avatar */}
        {!isMe ? (
          lastInGroup
            ? <img src={recipientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientName)}&background=e4e6eb&color=1c1e21`}
                alt={recipientName}
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 self-end mb-0.5" />
            : <div className="w-7 flex-shrink-0" />
        ) : <div className="w-7 flex-shrink-0" />}

        {/* Hover actions */}
        <div className={`flex items-center gap-1 transition-all duration-150 flex-shrink-0 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
        } ${isMe ? "flex-row-reverse" : "flex-row"}`}>
          <button type="button"
            onClick={(e) => {
              const rect = (e.target as HTMLElement).closest("button")!.getBoundingClientRect();
              setReactionPos({ bottom: "calc(100% + 8px)", left: isMe ? "auto" : 0, right: isMe ? 0 : "auto" });
              setReactionTarget(reactionTarget === msg.id ? null : msg.id);
            }}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-md transition-all text-[14px]">
            😊
          </button>
          <button type="button" onClick={() => setReplyTo(msg)}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-md transition-all">
            <Reply size={14} />
          </button>
        </div>

        {/* Bubble + reaction */}
        <div className={`relative flex flex-col max-w-[72%] md:max-w-[62%] ${isMe ? "items-end" : "items-start"}`}>
          {/* Reply preview */}
          {replyMsg && (
            <div className={`text-[11px] mb-1 px-3 py-1.5 rounded-xl border-l-2 border-[#0084ff] bg-[#0084ff]/8 text-gray-500 max-w-full truncate ${isMe ? "mr-1" : "ml-1"}`}>
              <span className="font-semibold text-[#0084ff] mr-1">
                {replyMsg.senderId === currentUserId ? "You" : recipientName}:
              </span>
              {replyMsg.content || "📎 Media"}
            </div>
          )}

          <div
            className={`break-words overflow-hidden cursor-pointer select-text ${
              isText ? "px-4 py-2.5" : "p-2"
            } ${bubbleBase}`}
            style={{ borderRadius, wordBreak: "break-word" }}
          >
            {msg.messageType === "IMAGE" && msg.mediaUrl && (
              <img src={msg.mediaUrl} alt="img"
                className="max-h-72 max-w-full object-cover cursor-pointer block"
                style={{ borderRadius: 14 }}
                onClick={() => window.open(msg.mediaUrl, "_blank")} />
            )}
            {msg.messageType === "AUDIO" && msg.mediaUrl && (
              <div className="py-1 px-1"><AudioPlayer url={msg.mediaUrl} isMe={isMe} /></div>
            )}
            {msg.messageType === "VIDEO" && msg.mediaUrl && (
              <video src={msg.mediaUrl} controls className="max-h-60 max-w-full block" style={{ borderRadius: 14 }} />
            )}
            {msg.content?.trim() && (
              <p className="text-[15px] leading-[1.45] whitespace-pre-wrap">{msg.content}</p>
            )}
          </div>

          {/* Reaction */}
          {msg.reaction && (
            <button type="button"
              onClick={() => handleReaction(msg.id, msg.reaction!)}
              className={`text-[16px] leading-none -mt-2 z-10 bg-white rounded-full shadow-md border border-gray-100 w-7 h-7 flex items-center justify-center hover:scale-110 transition-transform ${isMe ? "mr-1" : "ml-1"}`}>
              {msg.reaction}
            </button>
          )}

          {/* Reaction picker */}
          {reactionTarget === msg.id && (
            <div className="relative">
              <ReactionPicker
                onPick={(emoji) => handleReaction(msg.id, emoji)}
                onClose={() => setReactionTarget(null)}
                style={{ bottom: "100%", marginBottom: 4, ...(isMe ? { right: 0 } : { left: 0 }) }}
              />
            </div>
          )}

          {/* Timestamp */}
          {lastInGroup && (
            <div className={`flex items-center gap-1 px-0.5 mt-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              <span className="text-[11px] text-[#65676b]">{formatTimestamp(msg.timestamp)}</span>
              {isMe && (msg.read
                ? <CheckCheck size={13} className="text-[#0084ff]" />
                : <Check size={13} className="text-[#bcc0c4]" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  });

  const SystemAlert = ({ msg }: { msg: Message }) => (
    <div className="flex justify-center my-4">
      <span className="text-[12px] text-[#65676b] bg-[#f0f2f5] rounded-full px-4 py-1.5 font-medium">
        {msg.content}
      </span>
    </div>
  );

  const isRecipientTyping = recipientId ? !!typing[recipientId] : false;

  const filteredContacts = useMemo(() =>
    contacts.filter((c) => c.name?.toLowerCase().includes(searchQuery.toLowerCase())),
    [contacts, searchQuery]
  );

  /* ── RENDER ── */
  return (
    <div
      className="flex h-screen bg-white overflow-hidden"
      style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" }}
    >
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .msg-enter { animation: fadeSlideUp 0.2s ease both; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d0d3d9; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #bcc0c4; }
      `}</style>

      {/* ══ SIDEBAR ══ */}
      <div className={`w-full md:w-[360px] bg-white border-r border-[#e4e6eb] flex flex-col flex-shrink-0 ${recipientId ? "hidden md:flex" : "flex"}`}>

        {/* Sidebar header */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[22px] font-bold text-[#1c1e21]">
              {t("ការជជែក", "Chats")}
            </h1>
            <button
              onClick={() => setSidebarSearch((s) => !s)}
              className="w-9 h-9 rounded-full bg-[#f0f2f5] hover:bg-[#e4e6eb] flex items-center justify-center text-[#1c1e21] transition-colors">
              <Search size={16} />
            </button>
          </div>

          {/* Search */}
          <div className={`overflow-hidden transition-all duration-200 ${sidebarSearch ? "max-h-12 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#65676b]" size={14} />
              <input
                type="text"
                placeholder={t("ស្វែងរក...", "Search Messenger")}
                className="w-full bg-[#f0f2f5] rounded-full py-2 pl-9 pr-4 text-[14px] outline-none placeholder-[#65676b] text-[#1c1e21] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={sidebarSearch}
              />
            </div>
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <div className="w-14 h-14 rounded-full bg-[#f0f2f5] flex items-center justify-center mb-3">
                <MessageSquare size={24} className="text-[#65676b]" />
              </div>
              <p className="text-[14px] font-semibold text-[#65676b]">
                {t("មិនមានការជជែក", "No conversations yet")}
              </p>
            </div>
          )}

          {filteredContacts.map((c) => {
            const isActive = recipientId === c.userId;
            return (
              <button
                key={c.userId}
                onClick={() => navigate("/messages", {
                  state: { recipientId: c.userId, recipientName: c.name, avatar: c.avatar },
                })}
                className={`w-full flex items-center gap-3 px-2 py-2 mx-1 rounded-xl transition-colors text-left active:bg-[#e4e6eb] ${
                  isActive ? "bg-[#e7f3ff]" : "hover:bg-[#f0f2f5]"
                }`}
                style={{ width: "calc(100% - 8px)" }}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=e4e6eb&color=1c1e21`}
                    alt={c.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {/* Online dot */}
                  <div className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${c.isOnline !== false ? "bg-[#31a24c]" : "bg-[#bcc0c4]"}`} />
                  {/* Unread badge */}
                  {c.unreadCount > 0 && (
                    <div className="absolute -top-0.5 -right-0.5 bg-[#0084ff] text-white text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm">
                      {c.unreadCount > 9 ? "9+" : c.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-1">
                    <span className={`text-[15px] truncate ${c.unreadCount > 0 ? "font-bold" : "font-semibold"} text-[#1c1e21]`}>
                      {c.name}
                    </span>
                    <span className={`text-[12px] flex-shrink-0 ${c.unreadCount > 0 ? "text-[#0084ff] font-bold" : "text-[#65676b]"}`}>
                      {c.lastTime ? formatTimestamp(c.lastTime) : ""}
                    </span>
                  </div>
                  <p className={`text-[13px] truncate mt-0.5 ${c.unreadCount > 0 ? "font-semibold text-[#1c1e21]" : "text-[#65676b]"}`}>
                    {typing[c.userId] ? (
                      <span className="text-[#0084ff] italic">typing…</span>
                    ) : (
                      c.lastMessage || t("ចាប់ផ្តើមការសន្ទនា", "Start a conversation")
                    )}
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
            {/* ── Header ── */}
            <div className="px-3 py-2.5 border-b border-[#e4e6eb] flex items-center justify-between bg-white flex-shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate("/messages", { state: null })}
                  className="md:hidden p-2 text-[#0084ff] -ml-1 rounded-full hover:bg-[#f0f2f5] transition-colors"
                >
                  <ChevronLeft size={22} />
                </button>
                <div className="relative cursor-pointer group">
                  <img
                    src={recipientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientName)}&background=e4e6eb&color=1c1e21`}
                    alt={recipientName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#0084ff]/30 transition-all"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${connected ? "bg-[#31a24c]" : "bg-[#bcc0c4]"}`} />
                </div>
                <div>
                  <p className="font-bold text-[15px] text-[#1c1e21] leading-tight">{recipientName}</p>
                  <p className={`text-[12px] transition-colors ${isRecipientTyping ? "text-[#0084ff] font-semibold" : "text-[#65676b]"}`}>
                    {isRecipientTyping
                      ? t("កំពុងវាយ...", "typing…")
                      : connected ? t("អនឡាញ", "Active now") : t("គ្មានការតភ្ជាប់", "Offline")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[
                  { Icon: Phone, label: "Call" },
                  { Icon: Video, label: "Video" },
                  { Icon: MoreVertical, label: "More" },
                ].map(({ Icon, label }) => (
                  <button key={label}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-[#0084ff] hover:bg-[#f0f2f5] transition-colors active:bg-[#e4e6eb]"
                    title={label}>
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Messages area ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-white" ref={scrollRef}>
              {messageGroups.map((group) => (
                <div key={group.date}>
                  {/* Date divider */}
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-[#e4e6eb]" />
                    <span className="text-[12px] text-[#65676b] font-semibold whitespace-nowrap bg-white px-1">
                      {group.date}
                    </span>
                    <div className="flex-1 h-px bg-[#e4e6eb]" />
                  </div>
                  {group.msgs.map((msg, idx) =>
                    msg.messageType === "SYSTEM"
                      ? <SystemAlert key={`sys-${msg.id ?? idx}`} msg={msg} />
                      : <MessageBubble key={`msg-${msg.id ?? idx}`} msg={msg} msgs={group.msgs} idx={idx} />
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isRecipientTyping && (
                <div className="msg-enter">
                  <TypingIndicator avatar={recipientAvatar} name={recipientName} />
                </div>
              )}

              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* ── Input bar ── */}
            <div className="px-3 py-2.5 bg-white border-t border-[#e4e6eb] flex-shrink-0">
              {/* Reply preview */}
              {replyTo && (
                <div className="flex items-center justify-between bg-[#f0f6ff] rounded-xl px-3 py-2 mb-2 border-l-3 border-[#0084ff]">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#0084ff] mb-0.5">
                      {replyTo.senderId === currentUserId ? "You" : recipientName}
                    </p>
                    <p className="text-[12px] text-gray-600 truncate">{replyTo.content || "📎 Media"}</p>
                  </div>
                  <button type="button" onClick={() => setReplyTo(null)} className="ml-2 text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* File preview */}
              {pendingFile && (
                <div className="mb-2 px-1">
                  <ImagePreview file={pendingFile} onRemove={() => setPendingFile(null)} />
                </div>
              )}

              <form onSubmit={handleSend} className="flex items-end gap-1.5">
                {/* Attach */}
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-[#0084ff] hover:bg-[#f0f2f5] transition-colors flex-shrink-0 active:bg-[#e4e6eb]">
                  {isUploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                </button>
                <input type="file" ref={fileInputRef} className="hidden"
                  accept="image/*,audio/*,video/*" onChange={handleFileChange} />

                {/* Voice */}
                <VoiceRecorder disabled={isUploading} onRecorded={(file) => handleSend(undefined, file)} />

                {/* Text input */}
                <div className="flex-1 bg-[#f0f2f5] rounded-[22px] flex items-end px-4 py-2 min-h-[42px] transition-all focus-within:bg-[#e8eaed]">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                    }}
                    placeholder={t("Aa", "Aa")}
                    className="flex-1 bg-transparent text-[15px] text-[#1c1e21] placeholder-[#65676b] outline-none resize-none leading-[1.4]"
                    style={{ minHeight: 22, maxHeight: 120 }}
                  />
                </div>

                {/* Send / Like */}
                {input.trim() || pendingFile ? (
                  <button type="submit" disabled={isUploading}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0084ff] text-white hover:bg-[#0073e6] active:scale-90 transition-all flex-shrink-0 shadow-md disabled:opacity-50">
                    <Send size={16} />
                  </button>
                ) : (
                  <button type="button"
                    onClick={() => handleSend(undefined, undefined)}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-[#0084ff] hover:bg-[#f0f2f5] transition-colors flex-shrink-0 text-[22px] leading-none active:scale-90">
                    👍
                  </button>
                )}
              </form>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center bg-white">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0084ff] to-[#0073e6] flex items-center justify-center mb-5 shadow-xl shadow-blue-200">
              <MessageSquare size={44} className="text-white" strokeWidth={1.5} />
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