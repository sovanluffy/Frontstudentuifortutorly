"use client";

import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-900">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:relative
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:hidden"}
      `}>
        <Sidebar isOpen={isSidebarOpen} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        {/* CHANGED: Removed p-4 md:p-6 lg:p-8 to delete outer spacing */}
        <main className="flex-1 overflow-y-auto">
          {/* CHANGED: Removed max-w-7xl and mx-auto to use full width */}
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}