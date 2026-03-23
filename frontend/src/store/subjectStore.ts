import { create } from 'zustand';

interface SubjectState {
  currentSubject: any | null;
  userProgress: any[] | null;
  isEnrolled: boolean;
  setSubject: (subject: any) => void;
  setUserProgress: (progress: any[]) => void;
  setIsEnrolled: (enrolled: boolean) => void;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  currentSubject: null,
  userProgress: null,
  isEnrolled: false,
  setSubject: (subject) => set({ currentSubject: subject }),
  setUserProgress: (progress) => set({ userProgress: progress }),
  setIsEnrolled: (enrolled) => set({ isEnrolled: enrolled }),
}));
