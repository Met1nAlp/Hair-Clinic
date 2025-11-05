// Dosya: constants/photoData.ts

// Web kodunuzdaki arayüz
export interface CaptureStep {
    id: string;
    title: string;
    description: string;
    instruction: string;
    voiceInstruction: string;
    overlayType: 'front' | 'top' | 'side-left' | 'side-right' | 'back';
}

// Web kodunuzdaki veri
export const CAPTURE_STEPS: CaptureStep[] = [
    {
        id: 'front',
        title: 'Ön Profil',
        description: 'Yüzünüzü ve saç çizginizi çerçeveye yerleştirin',
        instruction: 'Doğrudan kameraya bakın. Yüzünüz tamamen görünür olmalı.',
        voiceInstruction: 'Lütfen kameraya doğrudan bakın. Yüzünüz tamamen görünür olmalı. 3, 2, 1, çekiyorum.',
        overlayType: 'front'
    },
    {
        id: 'crown',
        title: 'Tepe Bölgesi',
        description: 'Başınızın üst kısmını gösterin',
        instruction: 'Başınızı hafifçe öne eğin veya kamerayı yukarı tutun.',
        voiceInstruction: 'Şimdi başınızı hafifçe öne eğin. Tepe bölgenizi gösterin. 3, 2, 1, çekiyorum.',
        overlayType: 'top'
    },
    {
        id: 'left',
        title: 'Sol Profil',
        description: 'Sol tarafınızı gösterin',
        instruction: 'Başınızı sağa çevirin, sol profiliniz görünsün.',
        voiceInstruction: 'Şimdi başınızı sağa çevirin. Sol profiliniz görünmeli. 3, 2, 1, çekiyorum.',
        overlayType: 'side-left'
    },
    {
        id: 'right',
        title: 'Sağ Profil',
        description: 'Sağ tarafınızı gösterin',
        instruction: 'Başınızı sola çevirin, sağ profiliniz görünsün.',
        voiceInstruction: 'Şimdi başınızı sola çevirin. Sağ profiliniz görünmeli. 3, 2, 1, çekiyorum.',
        overlayType: 'side-right'
    },
    {
        id: 'donor',
        title: 'Ense (Donör Bölge)',
        description: 'Arka saç çizgisi bölgesi',
        instruction: 'Birinden yardım alabilir veya ayna kullanabilirsiniz.',
        voiceInstruction: 'Son fotoğraf. Lütfen ense bölgenizi gösterin. Ayna kullanabilir veya yardım alabilirsiniz. 3, 2, 1, çekiyorum.',
        overlayType: 'back'
    }
];