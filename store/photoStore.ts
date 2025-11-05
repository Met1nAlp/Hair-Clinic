// Dosya: store/photoStore.ts
import { create } from 'zustand';
import { CAPTURE_STEPS } from '../constants/photoData';

// Fotoğraflarımızı (null veya base64 string) olarak tutacağız
type PhotoState = {
  photos: (string | null)[];
  setPhoto: (index: number, uri: string) => void;
  clearPhotos: () => void;
};

// Başlangıçta 5 adım için 5 tane 'null' fotoğraf oluştur
const initialPhotos = Array(CAPTURE_STEPS.length).fill(null);

export const usePhotoStore = create<PhotoState>((set) => ({
  photos: initialPhotos,
  
  // Belirli bir adımdaki fotoğrafı ayarlar
  setPhoto: (index, uri) =>
    set((state) => {
      const newPhotos = [...state.photos];
      newPhotos[index] = uri;
      return { photos: newPhotos };
    }),
  
  // Tüm fotoğrafları temizler (baştan başlamak için)
  clearPhotos: () => set({ photos: initialPhotos }),
}));