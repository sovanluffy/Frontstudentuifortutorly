import { Badge } from '../components/figma/ui/badge';
import { Button } from '../components/figma/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/figma/ui/tabs';
import { Calendar, Clock, Video, MapPin, MessageCircle } from 'lucide-react';

interface Booking {
  id: string;
  tutorName: string;
  tutorPhoto: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  mode: 'online' | 'tutor-home' | 'student-home';
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    tutorName: 'Sarah Johnson',
    tutorPhoto: 'https://images.unsplash.com/photo-1551989745-347c28b620e5?w=400',
    subject: 'Advanced Calculus',
    date: '2026-04-05',
    time: '4:00 PM',
    duration: 60,
    mode: 'online',
    status: 'upcoming',
    price: 45,
  },
  {
    id: '2',
    tutorName: 'David Chen',
    tutorPhoto: 'https://images.unsplash.com/photo-1621388840627-a6909154b1f8?w=400',
    subject: 'React Development',
    date: '2026-04-08',
    time: '6:00 PM',
    duration: 90,
    mode: 'online',
    status: 'upcoming',
    price: 50,
  },
  {
    id: '3',
    tutorName: 'Emily Rodriguez',
    tutorPhoto: 'https://images.unsplash.com/photo-1758685847747-597ce085906e?w=400',
    subject: 'IELTS Speaking',
    date: '2026-03-28',
    time: '2:00 PM',
    duration: 60,
    mode: 'online',
    status: 'completed',
    price: 55,
  },
];

function BookingCard({ booking }: { booking: Booking }) {
  const getModeIcon = () => {
    switch (booking.mode) {
      case 'online':
        return <Video className="w-4 h-4" />;
      case 'tutor-home':
      case 'student-home':
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={booking.tutorPhoto}
          alt={booking.tutorName}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="mb-1">{booking.subject}</h3>
              <p className="text-sm text-muted-foreground">
                with {booking.tutorName}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`${getStatusColor()} capitalize`}
            >
              {booking.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(booking.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {booking.time} ({booking.duration} min)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getModeIcon()}
              <span className="capitalize">
                {booking.mode.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xl text-primary">${booking.price}</div>
            {booking.status === 'upcoming' && (
              <>
                <Button size="sm">
                  {booking.mode === 'online' ? 'Join Session' : 'View Details'}
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Tutor
                </Button>
                <Button variant="ghost" size="sm">
                  Reschedule
                </Button>
              </>
            )}
            {booking.status === 'completed' && (
              <Button variant="outline" size="sm">
                Leave Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MyBookings() {
  const upcomingBookings = mockBookings.filter((b) => b.status === 'upcoming');
  const completedBookings = mockBookings.filter((b) => b.status === 'completed');
  const cancelledBookings = mockBookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage your tutoring sessions
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-4">
              {completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cancelled">
            <div className="space-y-4">
              {cancelledBookings.length > 0 ? (
                cancelledBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No cancelled bookings
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}