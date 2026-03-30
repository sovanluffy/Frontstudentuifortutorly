import { GraduationCap, Heart, Calendar, User, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: GraduationCap },
    { path: '/search', label: 'Find Tutors', icon: null },
    { path: '/favorites', label: 'Favorites', icon: Heart },
    { path: '/bookings', label: 'My Bookings', icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl text-primary">Tutorly</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-accent text-primary'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
