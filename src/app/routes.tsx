import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { TutorListing } from './pages/TutorListing';
import { TutorDetail } from './pages/TutorDetail';
import { Favorites } from './pages/Favorites';
import { Booking } from './pages/Booking';
import { MyBookings } from './pages/MyBookings';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'search', Component: TutorListing },
      { path: 'tutor/:id', Component: TutorDetail },
      { path: 'favorites', Component: Favorites },
      { path: 'booking', Component: Booking },
      { path: 'bookings', Component: MyBookings },
      { path: 'profile', Component: Profile },
      { path: '*', Component: NotFound },
    ],
  },
]);
