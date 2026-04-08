import { createBrowserRouter } from "react-router-dom";

// Layout & Pages
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { TutorListing } from "./pages/TutorListing";
import { Favorites } from "./pages/Favorites";
import { Booking } from "./pages/Booking";
import { MyBookings } from "./pages/MyBookings";
import Profile from "./pages/Profile";
import TutorDetailPage from "./pages/TutorDetailPage"; 
import ClassDetailPage from "./pages/ClassDetailPage"; // Import the new detail page
import { NotFound } from "./pages/NotFound";

// Auth
import Login from "@/app/components/auth/Login";
import Signup from "@/app/components/auth/Signup";

export const router = createBrowserRouter([
  // --- AUTH ROUTES (No Navbar) ---
  // These sit outside the Layout because they usually don't need the main Nav
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },

  // --- MAIN APP ROUTES (With Navbar) ---
  {
    path: "/",
    Component: Layout, // This provides the context for useNavigate() in child components
    children: [
      { 
        index: true, 
        Component: Home 
      },
      { 
        path: "search", 
        Component: TutorListing 
      },
      { 
        path: "favorites", 
        Component: Favorites 
      },
      { 
        path: "booking", 
        Component: Booking 
      },
      { 
        path: "bookings", 
        Component: MyBookings 
      },
      { 
        path: "profile", 
        Component: Profile 
      },
      
      // --- NEW: CLASS DETAIL ROUTE ---
      { 
        path: "classes/:id", 
        Component: ClassDetailPage 
      },

      // --- TUTOR DETAIL ROUTE WITH LOADER ---
      {
        path: "tutor/:tutorId",
        loader: async ({ params }) => {
          const res = await fetch(
            `https://toturhub-dev.onrender.com/api/v1/tutors/${params.tutorId}`
          );
          if (!res.ok) throw new Error("Tutor profile not found");
          return res.json();
        },
        Component: TutorDetailPage,
      },

      // --- 404 FALLBACK ---
      // This is now inside the Layout, so useNavigate() works inside NotFound
      { 
        path: "*", 
        Component: NotFound 
      }, 
    ],
  },
]);