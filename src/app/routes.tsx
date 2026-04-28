"use client";

import { createBrowserRouter } from "react-router-dom";
import Cookies from "js-cookie";

// ================= LAYOUT =================
import { Layout } from "./components/Layout";

// ================= PAGES =================
import Home from "./pages/Home";
import MyBookings from "./pages/student/bookings/MyBookingsPage";
import Profile from "./pages/Profile";
import TutorDetailPage from "./pages/TutorDetailPage";
import ClassDetailPage from "./pages/ClassDetailPage";
import NotFound from "./pages/NotFound";

// ================= STUDENT PAGES =================
import StudentMyClassesPage from "@/app/pages/student/my-classes/StudentMyClassesPage"; // ← NEW (separate file)

// ================= CHAT =================
import Messages from "@/app/components/shared/Messages";

// ================= TUTOR =================
import CreateOpenClassPage from "@/app/pages/tutor/create-class/create-class";
import TutorBookingPage from "@/app/pages/tutor/booking/TutorBookingList";
import TutorDashboard from "@/app/pages/tutor/Dashboard";
import TutorMyClassesPage from "@/app/pages/tutor/classes/MyClassesPage";
import TutorEditPage from "@/app/pages/tutor/edit/TutorEditPage";

// ================= AUTH =================
import Login from "@/app/components/auth/Login";
import Signup from "@/app/components/auth/Signup";

// ================= GUARDS =================
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

      /* ================= STUDENT PROTECTED ROUTES ================= */
      {
        path: "student/bookings",
        element: (
          <StudentRoute>
            <MyBookings />
          </StudentRoute>
        ),
      },

      {
        path: "student/my-classes",
        element: (
          <StudentRoute>
            <StudentMyClassesPage />
          </StudentRoute>
        ),
      },

      /* ================= TUTOR PROTECTED ROUTES ================= */
      {
        path: "tutor/Dashboard",
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
            <TutorMyClassesPage />
          </TutorRoute>
        ),
      },
      {
        path: "tutor/edit/:id",
        element: (
          <TutorRoute>
            <TutorEditPage />
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

      /* ================= SHARED PROTECTED ROUTES ================= */
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