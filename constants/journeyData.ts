// Dosya: constants/journeyData.ts

// Hangi ikon adlarını kullanacağımızı belirtiyoruz
export type JourneyIconName =
    | 'CheckCircle2'
    | 'Clock'
    | 'MapPin'
    | 'Droplets'
    | 'Calendar'
    | 'TrendingUp'
    | 'FileText'
    | 'Video';

export interface JourneyStep {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    date?: string;
    icon: JourneyIconName; // İkonun kendisi yerine adını (string) tutuyoruz
    details: string[];
}

// Web kodunuzdaki verinin React Native için uyarlanmış hali
export const JOURNEY_STEPS: JourneyStep[] = [
    {
        id: 'consultation',
        title: 'Online Konsültasyon',
        description: 'Fotoğraf analizi ve değerlendirme',
        status: 'completed',
        date: '28 Ekim 2024',
        icon: 'CheckCircle2',
        details: [
            'Fotoğraflarınız başarıyla alındı',
            'Uzman ekibimiz tarafından analiz edildi',
            'Önerilen greft sayısı: 4.500-5.000'
        ]
    },
    {
        id: 'pre-op',
        title: 'Operasyon Öncesi Hazırlık',
        description: 'Kontrol listesi ve talimatlar',
        status: 'current',
        date: '1-3 Kasım 2024',
        icon: 'Clock',
        details: [
            'Kan sulandırıcı ilaçları bırakın',
            'Alkol ve sigara kullanımını durdurun',
            'Rahat kıyafetler hazırlayın',
            'Ulaşım planınızı yapın'
        ]
    },
    {
        id: 'operation-day',
        title: 'Operasyon Günü',
        description: 'Saç ekimi prosedürü',
        status: 'upcoming',
        date: '4 Kasım 2024',
        icon: 'MapPin',
        details: [
            'Kliniğe geliş: 09:00',
            'İşlem süresi: 6-8 saat',
            'Yerel anestezi uygulanacak',
            'Öğle yemeği molası verilecek'
        ]
    },
    {
        id: 'first-wash',
        title: 'İlk Yıkama',
        description: 'Klinik kontrolü ve yıkama eğitimi',
        status: 'upcoming',
        date: '7 Kasım 2024',
        icon: 'Droplets',
        details: [
            'Klinikte ilk yıkama yapılacak',
            'Ev yıkama teknikleri öğretilecek',
            'Yıkama ürünleri verilecek',
            'Video talimatları izleyin'
        ]
    },
    {
        id: 'shock-loss',
        title: 'Şok Dökülme',
        description: 'Ekilen saçlar geçici olarak dökülür',
        status: 'upcoming',
        date: '15 Kasım - 15 Aralık 2024',
        icon: 'TrendingUp',
        details: [
            'Bu tamamen normal bir süreçtir',
            'Kök hücreler zarar görmez',
            'Yeni saçlar 3. aydan itibaren çıkar',
            'Endişelenmeyin, koordinatörünüzle iletişimde kalın'
        ]
    },
    {
        id: 'month-12',
        title: '12. Ay (Final)',
        description: 'Son sonuç',
        status: 'upcoming',
        date: '4 Kasım 2025',
        icon: 'CheckCircle2',
        details: [
            'Nihai sonuç değerlendirmesi',
            '%90-95 saç çıkışı',
            'Öncesi/sonrası karşılaştırma',
            'İşlem tamamlanmış olur'
        ]
    }
];