import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import { Home, Search } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center pb-20 md:pb-8">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-9xl mb-4">404</div>
        <h1 className="mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been
          moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate('/search')}>
            <Search className="w-4 h-4 mr-2" />
            Find Tutors
          </Button>
        </div>
      </div>
    </div>
  );
}
