"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { 
  Send, 
  User, 
  Paperclip, 
  Smile, 
  MessageCircle, 
  MoreHorizontal,
  Search
} from "lucide-react";

/* ================= HELPERS ================= */
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

export const Messages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const token = getCookie("token");
  const chatId = "booking_default"; // In a real app, get this from URL params: const { id } = useParams()

  // Mock User - Replace with your Auth logic
  const currentUser = { id: 1, name: "Tutor" };

  /* ================= WEBSOCKET SETUP ================= */
  useEffect(() => {
    if (!token) return;

    const socket = new SockJS("https://toturhub-dev.onrender.com/ws");
    const client = Stomp.over(socket);
    client.debug = () => {}; // Cleaner console

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      setStompClient(client);

      // Subscribe to the chat room
      client.subscribe(`/topic/messages/${chatId}`, (payload) => {
        const newMessage = JSON.parse(payload.body);
        setMessages((prev) => [...prev, newMessage]);
      });
    });

    return () => {
      if (client && client.connected) {
        client.disconnect(() => console.log("Chat disconnected"));
      }
    };
  }, [token, chatId]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= ACTIONS ================= */
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !stompClient) return;

    const messageData = {
      senderId: currentUser.id,
      content: input,
      chatId: chatId,
      timestamp: new Date().toISOString(),
    };

    stompClient.send(`/app/chat/${chatId}`, {}, JSON.stringify(messageData));
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F8FAFC]">
      {/* Sidebar - Chat List (Optional UI) */}
      <div className="w-80 bg-white border-r border-slate-100 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              placeholder="Search chats..." 
              className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 text-xs font-medium focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="p-4 bg-blue-50 rounded-2xl flex items-center gap-3 border border-blue-100 cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">S</div>
            <div>
              <p className="text-sm font-bold text-slate-900">Student Name</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Active Booking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">Student Discussion</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connected</span>
              </div>
            </div>
          </div>
          <button className="text-slate-300 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <MessageCircle size={60} className="text-slate-200 mb-4" />
              <p className="text-slate-500 font-bold">No messages here yet.</p>
              <p className="text-xs">Send a greeting to start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`group max-w-[75%] md:max-w-[60%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className={`px-5 py-3 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm ${
                      isMe 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-50">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-50 p-1.5 rounded-[1.8rem] border border-slate-100 focus-within:border-blue-200 focus-within:bg-white transition-all">
            <button type="button" className="p-3 text-slate-400 hover:text-blue-600 transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 placeholder:text-slate-300 px-2"
            />
            <button type="button" className="p-3 text-slate-400 hover:text-blue-600 transition-colors">
              <Smile size={20} />
            </button>
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="bg-blue-600 text-white p-3.5 rounded-full hover:bg-blue-700 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-blue-100"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};