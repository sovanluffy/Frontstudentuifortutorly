export interface Notification {
  id: number;
  recipientEmail: string;
  type: string;
  content: string;
  bookingId: number;
  classId: number;
  createdAt: string;
  read: boolean;
}