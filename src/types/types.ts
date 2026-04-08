// src/features/class/types.ts
export interface PriceOption {
  label: string;
  price: number;
}

export interface OpenClass {
  classId: number;
  title: string;
  description: string;
  status: string;
  tutorId: number;
  tutorName: string;
  tutorRating: number;
  location: string;
  specificAddress: string;
  subjects: string[];
  learningModes: string[];
  basePrice: number;
  maxStudents: number;
  currentStudents: number;
  priceOptions: PriceOption[];
  availableSlots: any[];
}