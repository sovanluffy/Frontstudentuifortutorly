import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/figma/ui/button";

interface PriceOption {
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
  duration?: string;
}

interface ClassCardProps {
  openClass: OpenClass;
}

export const ClassCard: React.FC<ClassCardProps> = ({ openClass }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <h2 className="text-lg font-bold mb-2">{openClass.title}</h2>
      <p className="text-sm text-slate-600 mb-2">{openClass.description}</p>

      <p className="text-xs text-slate-400 mb-2">
        Subjects: {openClass.subjects.join(", ")} | Mode: {openClass.learningModes.join(", ")}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">
          {openClass.currentStudents}/{openClass.maxStudents} students
        </span>
        <Button
          size="default"
          className="h-7 rounded-lg bg-slate-900 text-[11px] font-bold hover:bg-blue-600"
          onClick={() => navigate(`/classes/${openClass.classId}`)}
        >
          Open
        </Button>
      </div>
    </div>
  );
};