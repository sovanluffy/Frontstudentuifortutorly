import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { TutorListing } from "./pages/TutorListing";
import { Favorites } from "./pages/Favorites";
import { Booking } from "./pages/Booking";
import { MyBookings } from "./pages/MyBookings";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";
import TutorDetailPage from "./pages/TutorDetailPage";
import Login from "@/app/components/auth/Login"; 
import Signup from "@/app/components/auth/Signup";

export const router = createBrowserRouter([
  // --- AUTH ROUTES (No Navbar) ---
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },

  // --- MAIN APP ROUTES (With Navbar) ---
  {
    path: "/",
    Component: Layout, // Navbar is inside here
    children: [
      { index: true, Component: Home },
      { path: "search", Component: TutorListing },
      { path: "favorites", Component: Favorites },
      { path: "booking", Component: Booking },
      { path: "bookings", Component: MyBookings },
      { path: "profile", Component: Profile },
      {
        path: "tutor/:tutorId",
        loader: async ({ params }) => {
          const res = await fetch(`https://toturhub-dev.onrender.com/api/v1/tutors/${params.tutorId}`);
          if (!res.ok) throw new Error("Tutor profile not found");
          return res.json();
        },
        Component: TutorDetailPage,
      },
      { path: "*", Component: NotFound },
    ],
  },
]);