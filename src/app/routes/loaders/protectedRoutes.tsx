import React from "react";
import { Navigate } from "react-router-dom";
import { hasRole, getUser } from "@/utils/auth";

/* ================= TUTOR ROUTE GUARD ================= */
export const TutorRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole("TUTOR")) {
    return <Navigate to="/student/bookings" replace />;
  }

  return <>{children}</>;
};

/* ================= STUDENT ROUTE GUARD ================= */
export const StudentRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole("STUDENT")) {
    return <Navigate to="/tutor/manage" replace />;
  }

  return <>{children}</>;
};