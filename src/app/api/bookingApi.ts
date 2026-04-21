import { apiGet } from "./apiClient";

export const getPendingBookingsCount = () => {
  return apiGet("/bookings/tutor/me/pending-count");
};