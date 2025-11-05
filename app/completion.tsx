// Dosya: app/completion.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, CheckCircle2, MessageCircle, Video } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useSurveyStore } from '../store/surveyStore';

// Web kodunuzdaki küçük kartlar
const TimelineCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({ icon, title, subtitle }) => (
  <View style={styles.timelineCard}>
    <View style={styles.timelineIcon}>{icon}</View>
    <View>
      <Text style={styles.timelineTitle}>{title}</Text>
      <Text style={styles.timelineSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

// Web kodunuzdaki "Aldığımız Bilgiler" listesi
const InfoListItem: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.infoListItem}>
    <CheckCircle2 size={18} color="#28A745" style={{ marginRight: SIZES.base }} />
    <Text style={styles.infoListText}>{text}</Text>
  </View>
);

export default function CompletionScreen() {
  const router = useRouter();
  // Adım 1'de gönderdiğimiz 'patientName' parametresini alıyoruz
  const { patientName } = useLocalSearchParams<{ patientName: string }>();
  
  // Anketi sıfırlama fonksiyonunu al (veriler zaten gönderildi)
  const resetSurvey = useSurveyStore((state) => state.resetSurvey);

  // Web kodunuzdaki 'onContinue'
  const handleContinue = () => {
    //resetSurvey();  Hafızayı temizle
    router.replace('/(tabs)/'); // Ana panele git
  };

  return (
    <LinearGradient
      // Web kodunuzdaki 'from-green-600 via-green-700 to-green-900'
      colors={['#059669', '#047857', '#065F46']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainCard}>
          <View style={styles.iconContainer}>
            <CheckCircle2 size={48} color={COLORS.white} />
          </View>
          
          <Text style={styles.title}>Değerlendirmeniz Başarıyla Oluşturuldu!</Text>
          <Text style={styles.subtitle}>
            Tebrikler {patientName || 'Smile Ailesi'}, Smile Ailesi'ne hoş geldiniz! 🎉
          </Text>

          {/* Sonraki Adımlar Kartı */}
          <View style={[styles.infoCard, { backgroundColor: COLORS.infoBackground }]}>
            <Text style={styles.cardTitle}>Sonraki Adımlar</Text>
            {/* Adım 1 */}
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}><Text style={styles.stepText}>1</Text></View>
              <Text style={styles.stepDescription}>Medikal ekibimiz bilgilerinizi ve fotoğraflarınızı detaylı olarak inceleyecektir</Text>
            </View>
            {/* Adım 2 */}
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}><Text style={styles.stepText}>2</Text></View>
              <Text style={styles.stepDescription}>Kıdemli uzmanlarımız size özel saç ekimi planını hazırlayacaktır</Text>
            </View>
            {/* Adım 3 */}
            <View style={styles.stepItem}>
              <View style={styles.stepCircle}><Text style={styles.stepText}>3</Text></View>
              <Text style={styles.stepDescription}>Hasta koordinatörünüz en kısa sürede sizinle iletişime geçecektir</Text>
            </View>
          </View>

          {/* Zaman Çizelgesi Kartları */}
          <View style={styles.timelineContainer}>
            <TimelineCard 
              icon={<Calendar size={20} color={COLORS.primary} />}
              title="Bekleme Süresi"
              subtitle="24-48 saat içinde"
            />
            <TimelineCard 
              icon={<MessageCircle size={20} color="#28A745" />}
              title="İletişim"
              subtitle="WhatsApp / Telefon"
            />
            <TimelineCard 
              icon={<Video size={20} color="#6F42C1" />}
              title="Online Konsültasyon"
              subtitle="Uzman görüşmesi"
            />
          </View>

          {/* Aldığımız Bilgiler Kartı */}
          <View style={[styles.infoCard, { backgroundColor: COLORS.stepCardBackground }]}>
            <Text style={styles.cardTitle}>Aldığımız Bilgiler</Text>
            <View style={styles.infoListContainer}>
              <View style={styles.infoListColumn}>
                <InfoListItem text="Medikal anket cevapları" />
                <InfoListItem text="Sağlık geçmişi bilgileri" />
                <InfoListItem text="Beklentileriniz" />
                <InfoListItem text="Yaşam tarzı bilgileri" />
              </View>
              <View style={styles.infoListColumn}>
                <InfoListItem text="Ön profil fotoğrafı" />
                <InfoListItem text="Tepe bölgesi fotoğrafı" />
                <InfoListItem text="Yan profil fotoğrafları" />
                <InfoListItem text="Donör bölge fotoğrafı" />
              </View>
            </View>
          </View>

          {/* E-posta Uyarısı */}
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              <Text style={{ fontWeight: 'bold' }}>📧 E-posta kontrol edin:</Text> Size özel değerlendirme raporu e-posta adresinize gönderilecektir.
            </Text>
          </View>
          
          {/* Ana Buton */}
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Hasta Paneline Git</Text>
          </TouchableOpacity>

          {/* Destek Metni */}
          <Text style={styles.supportText}>
            Acil bir sorunuz mu var?{' '}
            <Text style={styles.supportLink} onPress={() => { /* TODO: Destek hattını ara/link aç */ }}>
              Destek ekibimizle iletişime geçin
            </Text>
          </Text>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    padding: SIZES.padding / 2,
    justifyContent: 'center',
  },
  mainCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    alignItems: 'center',
    margin: SIZES.base,
  },
  iconContainer: {
    width: 96, height: 96,
    borderRadius: 48,
    backgroundColor: '#28A745', // Koyu yeşil
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: '#065F46', // Koyu yeşil metin
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  infoCard: {
    width: '100%',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  cardTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base * 2,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.base * 1.5,
  },
  stepCircle: {
    width: 24, height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
    flexShrink: 0,
  },
  stepText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  stepDescription: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    flex: 1,
  },
  timelineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SIZES.padding,
  },
  timelineCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    width: '32%', // 3'lü grid
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineIcon: { marginBottom: SIZES.base },
  timelineTitle: { ...FONTS.h2, fontSize: 12, color: COLORS.textPrimary, textAlign: 'center' },
  timelineSubtitle: { ...FONTS.body3, color: COLORS.textSecondary, textAlign: 'center' },
  
  infoListContainer: {
    flexDirection: 'row',
  },
  infoListColumn: {
    flex: 1,
  },
  infoListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  infoListText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  noticeBox: {
    backgroundColor: '#FFFBEA', // Sarı
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
    borderWidth: 1,
    borderColor: '#FFEEBA',
    width: '100%',
    marginBottom: SIZES.padding,
  },
  noticeText: {
    ...FONTS.body3,
    color: '#856404',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.base * 2,
    borderRadius: SIZES.radius,
    width: '100%',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  buttonText: {
    ...FONTS.h2,
    fontSize: 16,
    color: COLORS.white,
  },
  supportText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  supportLink: {
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});