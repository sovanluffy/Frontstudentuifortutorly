import { createBrowserRouter } from "react-router-dom";

// ================= LAYOUT =================
import { Layout } from "./components/Layout";

// ================= PAGES =================
import { Home } from "./pages/Home";
import { TutorListing } from "./pages/TutorListing";
import { Favorites } from "./pages/Favorites";
import { Booking } from "./pages/Booking";
import { MyBookings } from "./pages/MyBookings";
import Profile from "./pages/Profile";
import TutorDetailPage from "./pages/TutorDetailPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import { NotFound } from "./pages/NotFound";

// ================= AUTH =================
import Login from "@/app/components/auth/Login";
import Signup from "@/app/components/auth/Signup";

// ================= TUTOR CREATE CLASS =================
import CreateOpenClassPage from "@/app/components/tutor/create-class/create-class";

export const router = createBrowserRouter([
  // ================= AUTH ROUTES =================
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },

  // ================= MAIN APP =================
  {
    path: "/",
    Component: Layout,
    children: [
      // HOME
      {
        index: true,
        Component: Home,
      },

      // SEARCH
      {
        path: "search",
        Component: TutorListing,
      },

      // FAVORITES
      {
        path: "favorites",
        Component: Favorites,
      },

      // BOOKING
      {
        path: "booking",
        Component: Booking,
      },

      // MY BOOKINGS
      {
        path: "bookings",
        Component: MyBookings,
      },

      // PROFILE
      {
        path: "profile",
        Component: Profile,
      },

      // ================= CREATE CLASS (NEW) =================
      {
        path: "create-class",
        Component: CreateOpenClassPage,
      },

      // ================= CLASS DETAIL =================
      {
        path: "classes/:id",
        Component: ClassDetailPage,
      },

      // ================= TUTOR DETAIL =================
      {
        path: "tutor/:tutorId",
        loader: async ({ params }) => {
          const res = await fetch(
            `https://toturhub-dev.onrender.com/api/v1/tutors/${params.tutorId}`
          );

          if (!res.ok) {
            throw new Error("Tutor profile not found");
          }

          return res.json();
        },
        Component: TutorDetailPage,
      },

      // ================= 404 =================
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
]);