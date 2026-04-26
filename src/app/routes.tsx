"use client";

import { createBrowserRouter } from "react-router-dom";
import Cookies from "js-cookie";

// ================= LAYOUT =================
import { Layout } from "./components/Layout";

// ================= PAGES =================
import  Home  from "./pages/Home";
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
import MyClassesPage from "@/app/pages/tutor/classes/MyClassesPage";

// ================= AUTH =================
import Login from "@/app/components/auth/Login";
import Signup from "@/app/components/auth/Signup";

// ================= GUARDS =================
// Note: If you have a general "AuthRoute" for both Student and Tutor, use that.
// Otherwise, using StudentRoute usually checks for a valid token.
import { TutorRoute, StudentRoute } from "@/utils/authGuard";

// ================= NOTIFICATIONS =================
import NotificationsPage from "@/app/pages/notifications/NotificationsPage";

const getAuthToken = () => Cookies.get("token");

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },

      {
        path: "tutor/:tutorId",
        loader: async ({ params }) => {
          const token = getAuthToken();
          const tutorId = params.tutorId;
          if (!tutorId || isNaN(Number(tutorId))) {
            throw new Response("Invalid Tutor ID", { status: 400 });
          }
          const res = await fetch(
            `https://toturhub-dev.onrender.com/api/v1/tutors/${tutorId}`,
            {
              headers: {
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            }
          );
          if (!res.ok) throw new Response("Tutor Not Found", { status: 404 });
          return res.json();
        },
        element: <TutorDetailPage />,
      },

      {
        path: "classes/:id",
        element: <ClassDetailPage />,
      },

      /* ================= STUDENT PROTECTED ================= */
      {
        path: "student/bookings",
        element: (
          <StudentRoute>
            <MyBookings />
          </StudentRoute>
        ),
      },

      /* ================= TUTOR PROTECTED ================= */
      {
        path: "tutor/dashboard",
        element: (
          <TutorRoute>
            <TutorDashboard />
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
      {
        path: "tutor/classes",
        element: (
          <TutorRoute>
            <MyClassesPage />
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

      /* ================= SHARED PROTECTED ROUTES ================= 
         We wrap these in StudentRoute (or your generic Auth guard) 
         to ensure only logged-in users can access them.
      */
      {
        path: "messages",
        element: (
          <StudentRoute> 
            <Messages />
          </StudentRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <StudentRoute>
            <Profile />
          </StudentRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <StudentRoute>
            <NotificationsPage />
          </StudentRoute>
        ),
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);