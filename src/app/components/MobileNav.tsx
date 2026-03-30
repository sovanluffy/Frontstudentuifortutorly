import { Home, Search, Calendar, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/bookings', label: 'Bookings', icon: Calendar },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
