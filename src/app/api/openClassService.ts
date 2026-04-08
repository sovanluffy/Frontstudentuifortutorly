// src/features/class/api/openClassService.ts
import { apiClient } from "@/app/services/apiClient";

export const getClassesByTutor = (tutorId: number) => {
  return apiClient(`/api/v1/open-classes/tutor/${tutorId}`);
};