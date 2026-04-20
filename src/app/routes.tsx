import { createBrowserRouter } from "react-router-dom";

// ================= LAYOUT =================
import { Layout } from "./components/Layout";

// ================= PAGES =================
import { Home } from "./pages/Home";
import { TutorListing } from "./pages/TutorListing";
import { MyBookings } from "./pages/MyBookings";
import Profile from "./pages/Profile";
import TutorDetailPage from "./pages/TutorDetailPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import NotFound from "./pages/NotFound";
import { Messages } from "@/app/components/shared/Messages";

// ================= TUTOR PAGES =================
import CreateOpenClassPage from "@/app/components/tutor/create-class/create-class";
import TutorBookingPage from "./pages/TutorBookingPage";

// ================= AUTH =================
import Login from "@/app/components/auth/Login";
import Signup from "@/app/components/auth/Signup";

// ================= GUARDS =================
import { TutorRoute, StudentRoute } from "@/utils/authGuard";

// ================= NOTIFICATIONS PAGE =================
import NotificationsPage from "@/app/pages/notifications/NotificationsPage";

export const router = createBrowserRouter([
  // ================= AUTH ROUTES =================
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  // ================= MAIN LAYOUT =================
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,

    children: [
      // HOME
      { index: true, element: <Home /> },

      // SEARCH
      { path: "search", element: <TutorListing /> },

      // ================= TUTOR DETAIL =================
      {
        path: "tutor/:tutorId",
        loader: async ({ params }) => {
          const res = await fetch(
            `https://toturhub-dev.onrender.com/api/v1/tutors/${params.tutorId}`
          );

          if (!res.ok) throw new Error("Tutor not found");

          return res.json();
        },
        element: <TutorDetailPage />,
      },

      // CLASS DETAIL
      { path: "classes/:id", element: <ClassDetailPage /> },

      // ================= STUDENT ROUTES =================
      {
        path: "student/bookings",
        element: (
          <StudentRoute>
            <MyBookings />
          </StudentRoute>
        ),
      },

      // ================= TUTOR ROUTES =================
      {
        path: "tutor/manage",
        element: (
          <TutorRoute>
            <CreateOpenClassPage />
          </TutorRoute>
        ),
      },
      {
        path: "tutor/bookings",
        element: (
          <TutorRoute>
            <TutorBookingPage />
          </TutorRoute>
        ),
      },

      // ================= SHARED =================
      { path: "messages", element: <Messages /> },
      { path: "profile", element: <Profile /> },

      // ================= NOTIFICATIONS PAGE (NEW) =================
      {
        path: "notifications",
        element: <NotificationsPage />,
      },

      // ================= CATCH ALL =================
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);