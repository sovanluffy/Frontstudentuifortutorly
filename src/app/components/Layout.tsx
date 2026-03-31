import { Outlet } from "react-router";
import  Header  from "./Header";
import { MobileNav } from "./MobileNav";

export function Layout() {
  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />

    </div>
  );
}