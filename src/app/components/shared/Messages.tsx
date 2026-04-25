"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { 
  Send, Search, User, MessageSquare, Paperclip, 
  Mic, Square, Trash2, Check, CheckCheck, MoreVertical, 
  Play, Pause, Smile, Image as ImageIcon, Volume2,ExternalLink
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
  messageType?: "USER" | "IMAGE" | "AUDIO" | "SYSTEM";
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

/* ================= AUDIO PLAYER COMPONENT ================= */
const AudioPlayer = ({ url, isMe }: { url: string; isMe: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-[24px] min-w-[220px] ${isMe ? "bg-blue-700/50" : "bg-slate-100"}`}>
      <button 
        type="button"
        onClick={togglePlay}
        className={`p-3 rounded-full transition-transform active:scale-90 shadow-md ${isMe ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
      </button>
      
      <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden relative">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-100 ${isMe ? "bg-white" : "bg-blue-600"}`} 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={handleEnded}
        className="hidden" 
      />
    </div>
  );
};

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const stompRef = useRef<Stomp.Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  /* ================= API & WS ================= */
  const loadContacts = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/chat/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Contact Load Error:", err); }
  }, [token]);

  const markAsRead = useCallback(async (senderId: number) => {
    if (!token || !senderId) return;
    await fetch(`${API_BASE}/chat/read/${senderId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadContacts();
  }, [token, loadContacts]);

  const loadMessages = useCallback(async () => {
    if (!recipientId || !token) return;
    const res = await fetch(`${API_BASE}/chat/history/${recipientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setMessages(data);
    markAsRead(recipientId);
  }, [recipientId, token, markAsRead]);

  useEffect(() => { loadContacts(); }, [loadContacts]);
  useEffect(() => { loadMessages(); }, [loadMessages, recipientId]);

  useEffect(() => {
    if (!token) return;
    const socket = new SockJS("https://toturhub-dev.onrender.com/ws");
    const stomp = Stomp.over(socket);
    stomp.debug = () => {};
    stomp.connect({ Authorization: `Bearer ${token}` }, () => {
      setConnected(true);
      stompRef.current = stomp;
      stomp.subscribe("/user/queue/messages", (msg) => {
        const data = JSON.parse(msg.body);
        if (data.senderId === recipientId) {
          setMessages((prev) => [...prev, data]);
          markAsRead(data.senderId);
        }
        loadContacts();
      });
    }, () => setConnected(false));
    return () => { if (stomp?.connected) stomp.disconnect(() => {}); };
  }, [token, recipientId, markAsRead, loadContacts]);

  /* ================= RECORDING LOGIC ================= */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        const file = new File([audioBlob], "voice_message.mp3", { type: 'audio/mpeg' });
        handleSend(undefined, file);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) { alert("Microphone access is required."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isRecording) interval = setInterval(() => setRecordingTime(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = async (e?: React.FormEvent, file?: File) => {
    if (e) e.preventDefault();
    if (!input.trim() && !file) return;
    const url = new URL(`${API_BASE}/chat/send`);
    url.searchParams.append("recipientId", recipientId.toString());
    url.searchParams.append("content", input.trim() || "");
    const formData = new FormData();
    if (file) { formData.append("file", file); setIsUploading(true); }
    try {
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const newMsg = await res.json();
      setMessages((p) => [...p, newMsg]);
      setInput("");
      setIsUploading(false);
      loadContacts();
    } catch (err) { setIsUploading(false); }
  };

  const SystemAlert = ({ msg }: { msg: Message }) => {
    const isConfirmed = msg.content.toLowerCase().includes("confirmed");
    const isRejected = msg.content.toLowerCase().includes("rejected");
    const cartoonImage = isConfirmed 
      ? "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png" 
      : isRejected 
      ? "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Cross%20Mark.png"  
      : "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png"; 

    return (
      <div className="flex justify-center my-14">
        <div className="relative flex flex-col items-center p-8 rounded-[40px] bg-white border-b-[8px] border-slate-200 max-w-[320px] text-center shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="absolute -top-12 bg-white rounded-full p-2 shadow-xl border-4 border-slate-50">
            <img src={cartoonImage} alt="status" className="w-20 h-20 object-contain animate-bounce" />
          </div>
          <div className="mt-8">
            <h4 className={`text-lg font-black italic mb-2 tracking-tight ${isConfirmed ? "text-emerald-500" : isRejected ? "text-rose-500" : "text-blue-600"}`}>
              {isConfirmed ? "AWESOME!" : isRejected ? "CANCELLED" : "NOTICE"}
            </h4>
            <p className="text-sm font-bold text-slate-600 bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">{msg.content}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans select-none text-slate-900">
      
      {/* SIDEBAR */}
      <div className="w-96 bg-white border-r-[3px] border-slate-100 flex flex-col hidden md:flex z-30 shadow-2xl">
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-black tracking-tighter text-slate-800 italic">ChatBox</h2>
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                <MoreVertical size={20} />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" placeholder="Search buddies..."
              className="w-full bg-slate-100 border-b-[4px] border-slate-200 rounded-[24px] py-4 pl-14 pr-4 text-sm font-bold outline-none focus:bg-white transition-all"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {contacts.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((c) => (
            <button key={c.userId} onClick={() => navigate("/messages", { state: { recipientId: c.userId, recipientName: c.name, avatar: c.avatar } })}
              className={`w-full text-left flex items-center gap-4 p-4 rounded-[32px] transition-all duration-300 border-b-[6px] ${recipientId === c.userId ? "bg-blue-600 text-white border-blue-800 shadow-xl -translate-y-1" : "hover:bg-slate-50 text-slate-600 border-transparent active:translate-y-0.5 active:border-b-2"}`}>
              <div className="relative flex-shrink-0">
                {c.avatar ? <img src={c.avatar} className="w-16 h-16 rounded-[22px] object-cover border-4 border-white/20 shadow-md" alt="" /> : <div className="w-16 h-16 rounded-[22px] bg-slate-200 flex items-center justify-center text-slate-500 font-black text-xl shadow-inner">{c.name?.charAt(0)}</div>}
                {c.unreadCount > 0 && <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-7 h-7 rounded-full flex items-center justify-center border-4 border-white font-black animate-pulse">{c.unreadCount}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-black truncate text-lg tracking-tight">{c.name}</h4>
                  <span className="text-[10px] font-black opacity-50 uppercase tracking-widest">{c.lastTime && new Date(c.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className={`text-xs truncate font-bold italic ${recipientId === c.userId ? "text-blue-100" : "text-slate-400"}`}>{c.lastMessage || "No messages yet"}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 m-4 bg-slate-900 rounded-[35px] flex items-center gap-4 shadow-2xl border-b-[6px] border-slate-700">
            <div className="w-12 h-12 rounded-[18px] bg-blue-500 flex items-center justify-center text-white font-black shadow-lg">ME</div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Account</p>
                <p className="text-sm text-white truncate font-black tracking-tight">{userData?.name || "User"}</p>
            </div>
            <ExternalLink size={20} className="text-slate-500 cursor-pointer hover:text-white transition-colors"/>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col bg-white">
        {recipientId ? (
          <>
            {/* Header */}
            <div className="px-10 py-6 flex items-center justify-between border-b-[3px] border-slate-50 bg-white/90 backdrop-blur-xl z-20">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[24px] bg-slate-100 overflow-hidden shadow-xl border-b-[4px] border-slate-200">
                    {recipientAvatar ? <img src={recipientAvatar} className="w-full h-full object-cover" alt="" /> : <User className="w-full h-full p-4 text-slate-300" />}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${connected ? "bg-emerald-500 shadow-[0_0_15px_#10b981]" : "bg-slate-300 animate-pulse"}`} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-2xl tracking-tighter italic leading-none mb-1">{recipientName}</h3>
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{connected ? "Online Now" : "Connecting..."}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-4 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-[22px] transition-all border-b-[4px] border-slate-100 active:translate-y-1 active:border-b-0"><Volume2 size={22}/></button>
                <button className="p-4 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-[22px] transition-all border-b-[4px] border-slate-100 active:translate-y-1 active:border-b-0"><Trash2 size={22}/></button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto px-10 py-10 space-y-12 bg-white scroll-smooth">
              {messages.map((msg, idx) => (
                msg.messageType === "SYSTEM" ? <SystemAlert key={msg.id || idx} msg={msg} /> : (
                  <div key={msg.id || idx} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
                    <div className={`group relative max-w-[70%] px-6 py-5 rounded-[40px] shadow-2xl border-b-[6px] ${
                      msg.senderId === currentUserId 
                      ? "bg-blue-600 text-white rounded-tr-none border-blue-800 shadow-blue-100" 
                      : "bg-white text-slate-700 rounded-tl-none border-slate-200 shadow-slate-100"
                    }`}>
                      {/* Image Message */}
                      {msg.messageType === "IMAGE" && msg.mediaUrl && (
                        <div className="mb-4 rounded-[28px] overflow-hidden border-4 border-white/20 shadow-lg">
                          <img src={msg.mediaUrl} className="max-h-[400px] w-full object-cover" alt="Media" />
                        </div>
                      )}
                      
                      {/* Audio Message - Functional Clickable Player */}
                      {msg.messageType === "AUDIO" && msg.mediaUrl && (
                        <AudioPlayer url={msg.mediaUrl} isMe={msg.senderId === currentUserId} />
                      )}

                      {/* Text Content */}
                      {msg.content && <p className="text-[15px] font-bold leading-tight tracking-tight mt-1">{msg.content}</p>}
                      
                      {/* Status Info */}
                      <div className={`absolute -bottom-8 ${msg.senderId === currentUserId ? "right-2" : "left-2"} flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.senderId === currentUserId && (
                          msg.read ? <CheckCheck size={14} className="text-blue-500" /> : <Check size={14} className="text-slate-300" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              ))}
              {isUploading && <div className="text-right text-[10px] font-black text-blue-500 animate-pulse uppercase tracking-widest px-4 italic">Tossing file into chat...</div>}
              <div ref={scrollRef} className="h-4" />
            </div>

            {/* Input Claymorphism Bar */}
            <div className="p-8 bg-white">
              <form onSubmit={handleSend} className="flex items-center gap-4 max-w-5xl mx-auto">
                {isRecording ? (
                  <div className="flex-1 flex items-center gap-4 bg-rose-50 text-rose-600 p-3 rounded-[35px] border-b-[6px] border-rose-200">
                    <div className="w-5 h-5 rounded-full bg-rose-600 animate-ping ml-5" />
                    <span className="text-sm font-black italic flex-1 uppercase tracking-tight">Capturing Voice: {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}</span>
                    <button type="button" onClick={() => setIsRecording(false)} className="p-3 hover:bg-rose-100 rounded-full text-rose-400 transition-colors"><Trash2 size={22} /></button>
                    <button type="button" onClick={stopRecording} className="bg-rose-600 text-white p-5 rounded-full shadow-xl border-b-[5px] border-rose-900 active:translate-y-1 active:border-b-0 transition-all"><Square size={20} fill="white"/></button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-[35px] border-b-[5px] border-slate-200">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="p-4 text-slate-500 hover:bg-white hover:text-blue-600 rounded-full transition-all shadow-sm">
                        <ImageIcon size={24} />
                      </button>
                      <button type="button" onClick={startRecording} className="p-4 text-slate-500 hover:bg-white hover:text-blue-600 rounded-full transition-all shadow-sm">
                        <Mic size={24} />
                      </button>
                    </div>

                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*,audio/*" onChange={(e) => e.target.files?.[0] && handleSend(undefined, e.target.files[0])} />
                    
                    <div className="flex-1 relative">
                      <input 
                        value={input} onChange={(e) => setInput(e.target.value)} 
                        placeholder="Say something cool..." 
                        className="w-full px-8 py-5 bg-slate-100 rounded-[35px] border-b-[6px] border-slate-200 outline-none text-[16px] font-bold text-slate-700 focus:bg-white focus:border-blue-200 transition-all placeholder:text-slate-300" 
                      />
                      <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-yellow-500 transition-colors"><Smile size={26}/></button>
                    </div>

                    <button type="submit" disabled={!input.trim() && !isUploading} 
                            className="bg-blue-600 text-white p-7 rounded-[35px] shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95 disabled:opacity-20 transition-all border-b-[6px] border-blue-900">
                      <Send size={26} fill="white" />
                    </button>
                  </>
                )}
              </form>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center space-y-10 bg-[#F8FAFC]">
             <div className="relative">
                <div className="w-52 h-52 bg-white rounded-[70px] flex items-center justify-center text-blue-600 border-b-[18px] border-slate-200 shadow-2xl animate-in zoom-in-75 duration-700">
                    <MessageSquare size={90} className="animate-pulse" />
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full border-[10px] border-white animate-bounce shadow-2xl flex items-center justify-center text-4xl">👋</div>
             </div>
             <div className="text-center px-12">
                <h3 className="text-5xl font-black text-slate-800 tracking-tighter italic uppercase mb-4">Inbox Magic</h3>
                <p className="text-slate-400 text-lg font-bold max-w-sm leading-tight uppercase tracking-[0.2em]">Pick a contact from the sidebar to begin your journey!</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;