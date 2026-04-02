// Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />  {/* ✅ inside router context */}
      <main className="flex-1">
        <Outlet /> {/* children routes render here */}
      </main>
    </div>
  );
}