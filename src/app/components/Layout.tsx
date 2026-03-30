import { Outlet } from 'react-router';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
