export interface Booking {
  bookingId: number;
  userId: number;

  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar?: string;

  classId: number;
  classTitle: string;

  scheduleId: number;
  day: string;

  startTime: string;
  endTime: string;

  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

  note?: string;
  telegram?: string;

  createdAt: string;
}