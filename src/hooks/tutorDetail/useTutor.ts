import { useParams } from "react-router-dom";
import { useTutor } from "@/hooks/tutorDetail/useTutor";

export function TutorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tutor, loading, error } = useTutor(id!);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!tutor) return <div>No tutor found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold">{tutor.fullname}</h1>
      <p className="italic text-slate-600">{tutor.bio}</p>

      <img src={tutor.profilePicture} alt={tutor.fullname} className="w-40 h-40 rounded-xl my-4" />

      {tutor.education.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Education</h2>
          <ul className="list-disc list-inside">
            {tutor.education.map((edu, idx) => (
              <li key={idx}>{edu.degree}, {edu.school} ({edu.year})</li>
            ))}
          </ul>
        </div>
      )}

      {tutor.experience.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Experience</h2>
          <ul className="list-disc list-inside">
            {tutor.experience.map((exp, idx) => (
              <li key={idx}>{exp.role} at {exp.company} ({exp.duration})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}