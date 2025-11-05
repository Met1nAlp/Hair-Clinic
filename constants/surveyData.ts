import { MedicalAnswers } from "@/store/surveyStore";

export type QuestionType = 
  | 'text' 
  | 'number' 
  | 'boolean' 
  | 'textarea' 
  | 'radio-group' 
  | 'instructional';

export interface SurveyQuestion {
  id: keyof MedicalAnswers | 'welcome' | 'photo-intro';
  type: QuestionType;
  title: string;
  subtitle?: string;
  placeholder?: string;
  
  options?: Array<{
    label: string;
    value: any; 
    subtitle?: string;
    nextStepId: string; 
  }>;

  nextStepId?: string;
}

export const SURVEY_DATA: SurveyQuestion[] = [
  {
    id: 'name',
    type: 'text',
    title: 'Adınız ve soyadınız nedir?',
    subtitle: 'Size daha kişisel bir deneyim sunabilmemiz için',
    placeholder: 'Adınız Soyadınız',
    nextStepId: 'age',
  },
  {
    id: 'age',
    type: 'number',
    title: 'Yaşınız kaç?',
    subtitle: 'Bu bilgi tedavi planınızı oluşturmamıza yardımcı olur',
    placeholder: 'Örn: 35',
    nextStepId: 'previousTransplant',
  },
  {
    id: 'previousTransplant',
    type: 'boolean',
    title: 'Daha önce saç ekimi operasyonu geçirdiniz mi?',
    options: [
      { label: 'Hayır', value: false, nextStepId: 'chronicIllness' },
      { label: 'Evet', value: true, nextStepId: 'chronicIllness' },
    ],
  },
  {
    id: 'chronicIllness',
    type: 'boolean',
    title: 'Teşhisi konmuş kronik bir rahatsızlığınız var mı?',
    subtitle: 'Diyabet, hipertansiyon, kalp hastalığı vb.',
    options: [
      { label: 'Hayır', value: false, nextStepId: 'regularMedication' },
      { label: 'Evet', value: true, nextStepId: 'chronicIllnessDetails' }, // DALLANMA
    ],
  },
  {
    id: 'chronicIllnessDetails',
    type: 'textarea',
    title: 'Rahatsızlığınızı ve kullandığınız ilaçları belirtir misiniz?',
    placeholder: 'Örn: Tip 2 Diyabet - Metformin kullanıyorum',
    nextStepId: 'regularMedication', // Geri birleşme
  },
  {
    id: 'regularMedication',
    type: 'boolean',
    title: 'Düzenli kullandığınız bir ilaç var mı?',
    subtitle: 'Vitamin, takviye dahil',
    options: [
      { label: 'Hayır', value: false, nextStepId: 'allergies' },
      { label: 'Evet', value: true, nextStepId: 'medicationDetails' }, // DALLANMA
    ],
  },
  {
    id: 'medicationDetails',
    type: 'textarea',
    title: 'Hangi ilaçları kullanıyorsunuz?',
    placeholder: 'Örn: D vitamini, Omega 3, Aspirin',
    nextStepId: 'allergies', // Geri birleşme
  },
  {
    id: 'allergies',
    type: 'boolean',
    title: 'Herhangi bir şeye alerjiniz var mı?',
    subtitle: 'İlaç, besin, lateks vb.',
    options: [
      { label: 'Hayır', value: false, nextStepId: 'smoking' },
      { label: 'Evet', value: true, nextStepId: 'allergyDetails' }, // DALLANMA
    ],
  },
  {
    id: 'allergyDetails',
    type: 'textarea',
    title: 'Alerjilerinizi belirtir misiniz?',
    placeholder: 'Örn: Penisilin, Polen, Fındık',
    nextStepId: 'smoking', // Geri birleşme
  },
  {
    id: 'smoking',
    type: 'radio-group',
    title: 'Sigara kullanıyor musunuz?',
    nextStepId: 'hairLossPattern', // Bu tipte 'nextStepId' ortak
    options: [
      { label: 'Hiç kullanmadım', value: 'never', nextStepId: '' },
      { label: 'Günde 1-10 adet', value: '1-10', nextStepId: '' },
      { label: 'Günde 10+ adet', value: '10+', nextStepId: '' },
    ],
  },
  {
    id: 'hairLossPattern',
    type: 'radio-group',
    title: 'Saç dökülmenizi nasıl tanımlarsınız?',
    nextStepId: 'previousTreatments',
    options: [
      { label: 'Ön çizgim geriledi', subtitle: 'Alın bölgesinde saç kaybı', value: 'receding', nextStepId: '' },
      { label: 'Tepemde açılma var', subtitle: 'Tepe bölgesinde saç kaybı', value: 'crown', nextStepId: '' },
      { label: 'Genel seyreklik', subtitle: 'Saçlarımın tamamı incelmiş/seyrekleşmiş', value: 'overall', nextStepId: '' },
    ],
  },
  {
    id: 'previousTreatments',
    type: 'boolean',
    title: 'Daha önce saç dökülmesi için tedavi aldınız mı?',
    subtitle: 'İlaç, serum, PRP, mezoterapi vb.',
    options: [
      { label: 'Hayır', value: false, nextStepId: 'familyHistory' },
      { label: 'Evet', value: true, nextStepId: 'treatmentDetails' }, // DALLANMA
    ],
  },
  {
    id: 'treatmentDetails',
    type: 'textarea',
    title: 'Hangi tedavileri denediniz?',
    placeholder: 'Örn: 6 ay Minoxidil kullandım, PRP tedavisi gördüm',
    nextStepId: 'familyHistory', // Geri birleşme
  },
  {
    id: 'familyHistory',
    type: 'boolean',
    title: 'Ailenizde saç dökülmesi öyküsü var mı?',
    subtitle: 'Anne, baba veya kardeşlerinizde',
    options: [
      { label: 'Hayır', value: false, nextStepId: 'expectations' },
      { label: 'Evet', value: true, nextStepId: 'expectations' },
    ],
  },
  {
    id: 'expectations',
    type: 'textarea',
    title: 'Saç ekiminden temel beklentiniz nedir?',
    subtitle: 'Size en uygun planı hazırlamamız için bu çok önemli',
    placeholder: 'Örn: Daha dolgun görünmek istiyorum...',
    nextStepId: 'photo-intro', // Anketten çıkıp 'Fotoğraf' adımına yönlendir
  },
  {
    id: 'photo-intro',
    type: 'instructional',
    title: 'Teşekkürler, {name}!', // {name} dinamik olarak eklenecek
    subtitle: 'Şimdi durumunuzu net görebilmemiz için fotoğraflara ihtiyacımız var.',
    nextStepId: '/(photo-capture)/start', // UYGULAMANIN FARKLI BİR BÖLÜMÜ
  }
];