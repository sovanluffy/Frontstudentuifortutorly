import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // Main container: vertical flex to stack Navbar on top of the rest
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] overflow-hidden">
      
      {/* 1. TOP NAVBAR: Spans 100% width */}
      <Navbar onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* 2. LOWER SECTION: Horizontal flex for Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR: Slides in/out based on state */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* MAIN CONTENT: Scrollable area */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}