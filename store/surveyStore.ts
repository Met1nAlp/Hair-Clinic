import { create } from 'zustand';

// Sizin web kodunuzdaki 'MedicalAnswers' arayüzü
export interface MedicalAnswers {
  name?: string;
  age?: string;
  previousTransplant?: boolean;
  chronicIllness?: boolean;
  chronicIllnessDetails?: string;
  regularMedication?: boolean;
  medicationDetails?: string;
  allergies?: boolean;
  allergyDetails?: string;
  smoking?: 'never' | '1-10' | '10+';
  hairLossPattern?: 'receding' | 'crown' | 'overall';
  expectations?: string;
  previousTreatments?: boolean;
  treatmentDetails?: string;
  familyHistory?: boolean;
}

interface SurveyState {
  answers: MedicalAnswers;
  // Sizin web kodunuzdaki 'getTotalSteps' fonksiyonu
  getTotalSteps: () => number;
  // Sizin web kodunuzdaki 'updateAnswer' fonksiyonu
  updateAnswer: (key: keyof MedicalAnswers, value: any) => void;
  resetSurvey: () => void;
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  answers: {},
  updateAnswer: (key, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [key]: value,
      },
    })),
  getTotalSteps: () => {
    const answers = get().answers;
    let total = 10; // Sizin kodunuzdaki temel 10 soru
    if (answers.chronicIllness) total++;
    if (answers.regularMedication) total++;
    if (answers.allergies) total++;
    if (answers.previousTreatments) total++;
    return total;
  },
  resetSurvey: () => set({ answers: {} }),
}));