// Dosya: constants/supportData.ts

export interface FaqItem {
    question: string;
    answer: string;
}

export const FAQS: FaqItem[] = [
    {
        question: 'Operasyondan önce hangi ilaçları bırakmalıyım?',
        answer: 'Operasyondan 1 hafta önce aspirin, ibuprofen ve diğer kan sulandırıcı ilaçları bırakmalısınız. Düzenli kullandığınız ilaçlar varsa, mutlaka koordinatörünüze bildirin.'
    },
    {
        question: 'Operasyon ne kadar sürer?',
        answer: 'Saç ekimi operasyonu genellikle 6-8 saat sürer. Bu süre, eklenecek greft sayısına göre değişebilir. İşlem sırasında öğle yemeği molası verilir.'
    },
    {
        question: 'Operasyon ağrılı mı?',
        answer: 'Hayır. Operasyon yerel anestezi altında yapılır, bu nedenle ağrı hissetmezsiniz. Enjeksiyon sırasında hafif bir rahatsızlık yaşayabilirsiniz, ancak bu çok kısa sürer.'
    },
    {
        question: 'Ne zaman işe dönebilirim?',
        answer: 'Operasyondan 3-5 gün sonra işe dönebilirsiniz. Ancak ilk 10 gün boyunca ağır egzersiz ve ter gerektiren aktivitelerden kaçınmalısınız.'
    },
    {
        question: 'Şok dökülme nedir?',
        answer: 'Operasyondan 2-4 hafta sonra ekilen saçların geçici olarak dökülmesi normal bir süreçtir. Bu "şok dökülme" olarak adlandırılır. Endişelenmeyin, saç kökleri zarar görmez ve 3. aydan itibaren yeni saçlar çıkmaya başlar.'
    },
];