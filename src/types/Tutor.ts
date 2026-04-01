export interface Tutor {
  tutorId: number;
  fullname: string;
  profilePicture: string;
  rating: number;
  studentsTaught: number;
  bio: string;
  subjects: string[];
  location: string;
  totalOpenClasses: number;
}