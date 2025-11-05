import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Droplets,
  FileText,
  MapPin,
  TrendingUp,
  Video,
} from 'lucide-react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { JOURNEY_STEPS, JourneyIconName, JourneyStep } from '../../constants/journeyData';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

// İkon adını (string) alıp, ilgili ikonu (React Component) döndüren yardımcı fonksiyon
const renderIcon = (iconName: JourneyIconName, color: string, size: number) => {
  switch (iconName) {
    case 'CheckCircle2': return <CheckCircle2 size={size} color={color} />;
    case 'Clock': return <Clock size={size} color={color} />;
    case 'MapPin': return <MapPin size={size} color={color} />;
    case 'Droplets': return <Droplets size={size} color={color} />;
    case 'Calendar': return <Calendar size={size} color={color} />;
    case 'TrendingUp': return <TrendingUp size={size} color={color} />;
    case 'FileText': return <FileText size={size} color={color} />;
    case 'Video': return <Video size={size} color={color} />;
    default: return <CheckCircle2 size={size} color={color} />;
  }
};

const JourneyStepCard: React.FC<{ step: JourneyStep }> = ({ step }) => {
  const isCompleted = step.status === 'completed';
  const isCurrent = step.status === 'current';

  // Duruma göre stil belirle
  const cardStyle = [
    styles.card,
    isCompleted && styles.cardCompleted,
    isCurrent && styles.cardCurrent,
  ];
  const iconDotStyle = [
    styles.iconDot,
    isCompleted && styles.iconDotCompleted,
    isCurrent && styles.iconDotCurrent,
    !isCompleted && !isCurrent && styles.iconDotUpcoming,
  ];
  const iconColor = (isCompleted || isCurrent) ? COLORS.white : COLORS.iconInactive;
  const bulletColor = isCompleted ? '#28A745' : (isCurrent ? COLORS.primary : COLORS.iconInactive);

  return (
    <View style={styles.stepContainer}>
      {/* 1. İkon Çemberi (Sol taraf) */}
      <View style={iconDotStyle}>
        {renderIcon(step.icon, iconColor, 32)}
      </View>

      {/* 2. İçerik Kartı (Sağ taraf) */}
      <View style={cardStyle}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{step.title}</Text>
          {isCompleted && <View style={styles.badgeCompleted}><Text style={styles.badgeText}>Tamamlandı</Text></View>}
          {isCurrent && <View style={styles.badgeCurrent}><Text style={styles.badgeText}>Aktif</Text></View>}
        </View>
        <Text style={styles.cardDescription}>{step.description}</Text>
        {step.date && <Text style={styles.cardDate}>{step.date}</Text>}

        <View style={styles.detailsContainer}>
          {step.details.map((detail, idx) => (
            <View key={idx} style={styles.detailItem}>
              <View style={[styles.bullet, { backgroundColor: bulletColor }]} />
              <Text style={styles.detailText}>{detail}</Text>
            </View>
          ))}
        </View>

        {isCurrent && (
          <TouchableOpacity 
            style={[styles.button, styles.buttonCurrent]}
            onPress={() => alert('Detaylı talimatlar yakında eklenecek')}
          >
            <FileText size={16} color={COLORS.white} />
            <Text style={styles.buttonText}>Detaylı Talimatları Görüntüle</Text>
          </TouchableOpacity>
        )}
        {step.id === 'first-wash' && step.status !== 'completed' && (
          <TouchableOpacity 
            style={[styles.button, styles.buttonOutline]}
            onPress={() => alert('Yıkama videosu yakında eklenecek')}
          >
            <Video size={16} color={COLORS.primary} />
            <Text style={[styles.buttonText, { color: COLORS.primary }]}>Yıkama Videosunu İzle</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function JourneyScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Yolculuğum</Text>
        <Text style={styles.subtitle}>Saç ekimi sürecinizin tüm aşamaları</Text>

        {/* Zaman Tüneli Konteyneri */}
        <View style={styles.timelineContainer}>
          {/* Dikey Çizgi */}
          <LinearGradient
            colors={['#28A745', '#0D69FF', '#E9ECEF']}
            style={styles.timelineLine}
          />
          {/* Adımlar */}
          {JOURNEY_STEPS.map((step) => (
            <JourneyStepCard key={step.id} step={step} />
          ))}
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Sorularınız mı var?</Text>
          <Text style={styles.supportText}>Süreç boyunca hasta koordinatörünüz size rehberlik edecektir</Text>
          <TouchableOpacity 
            style={[styles.button, styles.buttonCurrent, { width: '100%' }]}
            onPress={() => router.push('/(tabs)/support')}
          >
            <Text style={styles.buttonText}>Koordinatörle İletişime Geç</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

// Stiller (Web kodunuza ve ekran görüntünüze göre)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding,
  },
  timelineContainer: {
    position: 'relative', // Bu, çizginin 'absolute' pozisyon alması için gereklidir
  },
  timelineLine: {
    position: 'absolute',
    left: 32 - 2, // 64 (çember genişliği) / 2 - 2 (çizgi genişliği) / 2
    top: 64,  // İlk çemberin altında başla
    bottom: 64, // Son çemberin üstünde bitir
    width: 4,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.base * 2,
    alignItems: 'flex-start',
  },
  iconDot: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    // 'absolute' yerine akış içinde tutuyoruz, 'marginLeft' ile dengeliyoruz
    marginRight: SIZES.base * 2, // = ml-16
    zIndex: 1, // Çizginin üstünde
  },
  iconDotCompleted: { backgroundColor: '#28A745' },
  iconDotCurrent: { backgroundColor: COLORS.primary, borderWidth: 4, borderColor: COLORS.infoBackground },
  iconDotUpcoming: { backgroundColor: COLORS.stepCardBackground, borderWidth: 2, borderColor: COLORS.iconInactive },

  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding * 1.5,
    borderWidth: 1,
    borderColor: COLORS.iconInactive,
    marginTop: SIZES.padding / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: '#E7F7E9', // Açık yeşil
    borderColor: '#AEE9B7',
  },
  cardCurrent: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },
  cardTitle: {
    ...FONTS.h2,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginRight: SIZES.base,
  },
  badgeCompleted: {
    backgroundColor: '#D5F5E3',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  badgeCurrent: {
    backgroundColor: COLORS.infoBackground,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  badgeText: {
    ...FONTS.body3,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary, // 'Tamamlandı' için de yeşil yapabiliriz
  },
  cardDescription: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 2,
  },
  cardDate: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base * 2,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderColor: COLORS.iconInactive,
    paddingTop: SIZES.base * 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SIZES.base,
    marginTop: 6, // Metin satır yüksekliğine göre ortala
  },
  detailText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
  },
  buttonCurrent: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    ...FONTS.h2,
    fontSize: 16,
    color: COLORS.white,
    marginLeft: SIZES.base,
  },
  supportCard: {
    backgroundColor: COLORS.infoBackground,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 1.5,
    alignItems: 'center',
    marginTop: SIZES.padding,
    borderWidth: 1,
    borderColor: '#BEDAFF',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  supportTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
  },
  supportText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.base * 2,
  },
});