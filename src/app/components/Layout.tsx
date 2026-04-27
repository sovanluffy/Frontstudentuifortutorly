"use client";

import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // Open by default on desktop, closed on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-close on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-slate-900">

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar
          Mobile  → fixed overlay, slides in/out
          Desktop → inline static panel
      */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          lg:relative lg:z-auto lg:shrink-0
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${!isSidebarOpen ? "lg:hidden" : "lg:translate-x-0"}
        `}
      >
        <Sidebar isOpen={isSidebarOpen} />
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar
          onToggle={() => setIsSidebarOpen(prev => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}