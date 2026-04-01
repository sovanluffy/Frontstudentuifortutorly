import { useTutors } from "@/hooks/useTutors";
import { TutorListingCard } from "./TutorListingCard";
import { Users } from "lucide-react";

export function TutorCards() {
  const { tutors, loading, error } = useTutors();

  if (loading) {
    return <div className="col-span-full text-center py-20">Loading tutors...</div>;
  }

  if (error) {
    return <div className="col-span-full text-center py-20 text-red-500">{error}</div>;
  }

  if (tutors.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <Users className="mx-auto mb-4 text-slate-300" size={40} />
        No tutors found
      </div>
    );
  }

  return (
    <>
      {tutors.map((tutor) => (
        <TutorListingCard key={tutor.tutorId} tutor={tutor} />
      ))}
    </>
  );
}