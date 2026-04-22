import { createBrowserRouter } from "react-router-dom";

// ================= LAYOUT =================
import { Layout } from "./components/Layout";

// ================= PAGES =================
import { Home } from "./pages/Home";
import MyBookings from "./pages/student/bookings/MyBookingsPage";
import Profile from "./pages/Profile";
import TutorDetailPage from "./pages/TutorDetailPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import NotFound from "./pages/NotFound";

// ================= CHAT =================
import Messages from "@/app/components/shared/Messages";

// ================= TUTOR =================
import CreateOpenClassPage from "@/app/pages/tutor/create-class/create-class";
import TutorBookingPage from "@/app/pages/tutor/booking/TutorBookingList";
import TutorDashboard from "@/app/pages/TutorDashboard";

// ================= AUTH =================
import Login from "@/app/components/auth/Login";
import Signup from "@/app/components/auth/Signup";

// ================= GUARDS =================
import { TutorRoute, StudentRoute } from "@/utils/authGuard";

// ================= NOTIFICATIONS =================
import NotificationsPage from "@/app/pages/notifications/NotificationsPage";

export const router = createBrowserRouter([
  // ================= AUTH =================
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  // ================= MAIN =================
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,

    children: [
      // ================= HOME =================
      { index: true, element: <Home /> },

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

      // ================= CLASS DETAIL =================
      {
        path: "classes/:id",
        element: <ClassDetailPage />,
      },

      // ================= STUDENT =================
      {
        path: "student/bookings",
        element: (
          <StudentRoute>
            <MyBookings />
          </StudentRoute>
        ),
      },

      // ================= TUTOR =================
      {
        path: "tutor/dashboard",
        element: (
          <TutorRoute>
            <TutorDashboard />
          </TutorRoute>
        ),
      },
      {
        path: "tutor/booking", // ✅ CHANGED HERE
        element: (
          <TutorRoute>
            <TutorBookingPage />
          </TutorRoute>
        ),
      },
      {
        path: "tutor/manage",
        element: (
          <TutorRoute>
            <CreateOpenClassPage />
          </TutorRoute>
        ),
      },

      // ================= CHAT =================
      {
        path: "messages",
        element: <Messages />,
      },

      // ================= PROFILE =================
      {
        path: "profile",
        element: <Profile />,
      },

      // ================= NOTIFICATIONS =================
      {
        path: "notifications",
        element: <NotificationsPage />,
      },

      // ================= 404 =================
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);