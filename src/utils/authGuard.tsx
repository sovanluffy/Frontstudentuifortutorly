import React from "react";
import { Navigate } from "react-router-dom";
import { getUser, hasRole } from "./auth";

/* ================= TUTOR ROUTE ================= */
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

/* ================= STUDENT ROUTE ================= */
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