// Dosya: constants/progressData.ts

export interface ProgressPhoto {
    id: string;
    date: string;
    month: string;
    photos: {
        front: string;
        top: string;
        left: string;
        right: string;
        back: string;
    };
    notes?: string;
}

// Hangi açıların olduğunu tanımla
export const ANGLES = [
    { key: 'front' as const, label: 'Ön' },
    { key: 'top' as const, label: 'Tepe' },
    { key: 'left' as const, label: 'Sol' },
    { key: 'right' as const, label: 'Sağ' },
    { key: 'back' as const, label: 'Ense' }
];

// Simüle edilmiş veri (Karşılaştırma modu için 2 kayıt eklendi)
export const PROGRESS_DATA: ProgressPhoto[] = [
    {
        id: 'initial',
        date: '28 Ekim 2024',
        month: 'Başlangıç',
        photos: {
            front: 'https://placehold.co/300x400/E2E8F0/475569?text=Ön+Başlangıç',
            top: 'https://placehold.co/300x400/E2E8F0/475569?text=Tepe+Başlangıç',
            left: 'https://placehold.co/300x400/E2E8F0/475569?text=Sol+Başlangıç',
            right: 'https://placehold.co/300x400/E2E8F0/475569?text=Sağ+Başlangıç',
            back: 'https://placehold.co/300x400/E2E8F0/475569?text=Ense+Başlangıç'
        },
        notes: 'İlk değerlendirme fotoğrafları'
    },
    {
        id: 'month-1',
        date: '4 Aralık 2024',
        month: '1. Ay Kontrolü',
        photos: {
            front: 'https://placehold.co/300x400/E2E8F0/475569?text=Ön+1.+Ay',
            top: 'https://placehold.co/300x400/E2E8F0/475569?text=Tepe+1.+Ay',
            left: 'https://placehold.co/300x400/E2E8F0/475569?text=Sol+1.+Ay',
            right: 'https://placehold.co/300x400/E2E8F0/475569?text=Sağ+1.+Ay',
            back: 'https://placehold.co/300x400/E2E8F0/475569?text=Ense+1.+Ay'
        },
        notes: 'Şok dökülme sonrası ilk durum.'
    }
];