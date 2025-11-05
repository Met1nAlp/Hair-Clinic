// Dosya: store/photoStore.ts
import { create } from 'zustand';
import { CAPTURE_STEPS } from '../constants/photoData';
import { ProgressPhoto } from '../constants/progressData';

type PhotoState = {
  photos: (string | null)[];
  progressRecords: ProgressPhoto[];
  setPhoto: (index: number, uri: string) => void;
  clearPhotos: () => void;
  saveToProgress: (date: string, month: string, notes?: string) => void;
};

const initialPhotos = Array(CAPTURE_STEPS.length).fill(null);

export const usePhotoStore = create<PhotoState>((set) => ({
  photos: initialPhotos,
  progressRecords: [],
  
  setPhoto: (index, uri) =>
    set((state) => {
      const newPhotos = [...state.photos];
      newPhotos[index] = uri;
      return { photos: newPhotos };
    }),
  
  clearPhotos: () => set({ photos: initialPhotos }),
  
  saveToProgress: (date, month, notes) =>
    set((state) => {
      if (state.photos.every(p => p !== null)) {
        const newRecord: ProgressPhoto = {
          id: `record-${Date.now()}`,
          date,
          month,
          photos: {
            front: state.photos[0]!,
            top: state.photos[1]!,
            left: state.photos[2]!,
            right: state.photos[3]!,
            back: state.photos[4]!,
          },
          notes,
        };
        return { 
          progressRecords: [...state.progressRecords, newRecord],
          photos: initialPhotos,
        };
      }
      return state;
    }),
}));