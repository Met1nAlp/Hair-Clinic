// Dosya: app/(tabs)/progress.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar, Camera, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ANGLES, PROGRESS_DATA } from '../../constants/progressData';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useSurveyStore } from '../../store/surveyStore';

// Tip Tanımlamaları
type ViewMode = 'gallery' | 'comparison';
type AngleKey = typeof ANGLES[number]['key'];

// Açı Seçici (Web'deki Tabs'in Native karşılığı)
const AngleSelector: React.FC<{
  selectedAngle: AngleKey;
  onSelect: (angle: AngleKey) => void;
}> = ({ selectedAngle, onSelect }) => (
  <View style={styles.angleSelectorContainer}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {ANGLES.map((angle) => (
        <TouchableOpacity
          key={angle.key}
          style={[
            styles.angleTab,
            selectedAngle === angle.key && styles.angleTabActive,
          ]}
          onPress={() => onSelect(angle.key)}
        >
          <Text
            style={[
              styles.angleTabText,
              selectedAngle === angle.key && styles.angleTabTextActive,
            ]}
          >
            {angle.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

export default function MyProgressScreen() {
  const router = useRouter();
  const patientName = useSurveyStore((state) => state.answers.name) || 'Misafir';
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [selectedAngle, setSelectedAngle] = useState<AngleKey>('front');

  // Karşılaştırma için ilk ve son fotoğraflar
  const initialPhotos = PROGRESS_DATA[0];
  const latestPhotos = PROGRESS_DATA[PROGRESS_DATA.length - 1];
  const canCompare = PROGRESS_DATA.length >= 2;

  // Görünüm Değiştirme Butonları
  const renderViewToggle = () => (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, viewMode === 'gallery' && styles.toggleButtonActive]}
        onPress={() => setViewMode('gallery')}
      >
        <Text style={[styles.toggleButtonText, viewMode === 'gallery' && styles.toggleButtonTextActive]}>
          Galeri Görünümü
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, viewMode === 'comparison' && styles.toggleButtonActive, !canCompare && styles.toggleButtonDisabled]}
        onPress={() => setViewMode('comparison')}
        disabled={!canCompare}
      >
        <Text style={[styles.toggleButtonText, viewMode === 'comparison' && styles.toggleButtonTextActive, !canCompare && styles.toggleButtonTextDisabled]}>
          Karşılaştırma
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Galeri Görünümü
  const renderGalleryView = () => (
    <View>
      {PROGRESS_DATA.map((record) => (
        <View key={record.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>{record.month}</Text>
              <Text style={styles.cardSubtitle}>{record.date}</Text>
            </View>
            <View style={styles.photoBadge}><Text style={styles.photoBadgeText}>5 Fotoğraf</Text></View>
          </View>
          
          {/* Fotoğraf Galerisi (Yatay Kaydırılabilir) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -SIZES.padding }}>
            <View style={{ width: SIZES.padding / 2 }} />
            {ANGLES.map((angle) => (
              <View key={angle.key} style={styles.photoItem}>
                <Image source={{ uri: record.photos[angle.key] }} style={styles.image} />
                <Text style={styles.imageLabel}>{angle.label}</Text>
              </View>
            ))}
            <View style={{ width: SIZES.padding / 2 }} />
          </ScrollView>

          {record.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{record.notes}</Text>
            </View>
          )}
        </View>
      ))}
      {/* Planlanan Kontroller (Web kodunuzdaki) */}
    </View>
  );

  // Karşılaştırma Görünümü
  const renderComparisonView = () => (
    <View style={styles.card}>
      <AngleSelector selectedAngle={selectedAngle} onSelect={setSelectedAngle} />
      
      <View style={styles.comparisonGrid}>
        {/* Başlangıç */}
        <View style={styles.comparisonItem}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.cardTitle}>Başlangıç</Text>
            <Text style={styles.cardSubtitle}>{initialPhotos.date}</Text>
          </View>
          <Image source={{ uri: initialPhotos.photos[selectedAngle] }} style={styles.image} />
        </View>
        
        {/* Güncel */}
        <View style={styles.comparisonItem}>
          <View style={styles.comparisonHeader}>
            <Text style={styles.cardTitle}>Güncel</Text>
            <View style={styles.latestBadge}><Text style={styles.latestBadgeText}>Güncel</Text></View>
          </View>
          <Image source={{ uri: latestPhotos.photos[selectedAngle] }} style={styles.image} />
        </View>
      </View>

      {/* İlerleme Notu */}
      <View style={styles.progressNote}>
        <View style={styles.progressIcon}>
          <TrendingUp size={24} color={COLORS.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Harika İlerleme!</Text>
          <Text style={styles.cardSubtitle}>Süreciniz planlandığı gibi ilerliyor. Bakım rutininize devam edin.</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Başlık ve Buton */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Gelişimim</Text>
            <Text style={styles.subtitle}>Saç ekimi sürecinizin görsel kaydı</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push('/(photo-capture)/')} // Fotoğraf ekleme modülünü aç
          >
            <Camera size={16} color={COLORS.white} />
            <Text style={styles.addButtonText}>Yeni Fotoğraf Ekle</Text>
          </TouchableOpacity>
        </View>

        {/* Sonraki Fotoğraf Hatırlatması */}
        <LinearGradient
          colors={['#0D69FF', '#0052CC']}
          style={styles.primaryCard}
        >
          <View style={styles.primaryCardHeader}>
            <View style={styles.primaryIconContainer}>
              <Calendar size={24} color={COLORS.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.primaryTitle}>1. Ay Fotoğrafları</Text>
              <Text style={styles.primarySubtitle}>
                30 Kasım 2025 Pazar tarihinde 1. ay kontrolü fotoğraflarınızı çekme zamanı!
              </Text>
              <View style={styles.badge}><Text style={styles.badgeText}>25 gün sonra</Text></View>
            </View>
          </View>
        </LinearGradient>

        {/* Görünüm Değiştirici */}
        {renderViewToggle()}

        {/* İçerik (Galeri veya Karşılaştırma) */}
        {viewMode === 'gallery' ? renderGalleryView() : renderComparisonView()}
        
        {/* İpuçları Kartı */}
        <View style={styles.tipBox}>
          <Text style={styles.cardTitle}>Fotoğraf Çekim İpuçları</Text>
          <Text style={styles.tipText}>• Her kontrolde aynı ışık koşullarında çekim yapın (gündüz, doğal ışık)</Text>
          <Text style={styles.tipText}>• Aynı arka plan önünde durun</Text>
          <Text style={styles.tipText}>• Saçlarınız kuru ve taranmış olsun</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Stiller
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: SIZES.padding },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  title: { ...FONTS.h1, color: COLORS.textPrimary },
  subtitle: { ...FONTS.body2, color: COLORS.textSecondary, marginTop: SIZES.base / 2 },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  addButtonText: { ...FONTS.h2, fontSize: 14, color: COLORS.white, marginLeft: SIZES.base / 2 },
  
  primaryCard: { borderRadius: SIZES.radius * 2, padding: SIZES.padding, marginBottom: SIZES.padding },
  primaryCardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  primaryIconContainer: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginRight: SIZES.base * 2,
  },
  primaryTitle: { ...FONTS.h2, color: COLORS.white, marginBottom: SIZES.base / 2 },
  primarySubtitle: { ...FONTS.body2, color: 'rgba(255,255,255,0.8)', marginBottom: SIZES.base * 1.5 },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
  },
  badgeText: { ...FONTS.body3, fontSize: 12, color: COLORS.white, fontWeight: '600' },
  
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  toggleButton: {
    flex: 1,
    padding: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.iconInactive,
    alignItems: 'center',
    marginHorizontal: SIZES.base / 2,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleButtonDisabled: { backgroundColor: COLORS.stepCardBackground },
  toggleButtonText: { ...FONTS.h2, fontSize: 16, color: COLORS.textSecondary },
  toggleButtonTextActive: { color: COLORS.white },
  toggleButtonTextDisabled: { color: COLORS.iconInactive },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  cardTitle: { ...FONTS.h2, fontSize: 18, color: COLORS.textPrimary, marginBottom: SIZES.base / 2 },
  cardSubtitle: { ...FONTS.body3, color: COLORS.textSecondary },
  photoBadge: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.iconInactive,
    borderWidth: 1,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  photoBadgeText: { ...FONTS.body3, fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  photoItem: {
    width: 140, // 5'li grid için sabit genişlik
    marginHorizontal: SIZES.base / 2,
  },
  image: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.stepCardBackground,
  },
  imageLabel: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.base,
  },
  notesContainer: {
    backgroundColor: COLORS.infoBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    marginTop: SIZES.padding,
  },
  notesText: { ...FONTS.body3, color: COLORS.textPrimary },

  angleSelectorContainer: {
    marginBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderColor: COLORS.iconInactive,
  },
  angleTab: {
    padding: SIZES.base * 1.5,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    marginRight: SIZES.base * 2,
  },
  angleTabActive: {
    borderColor: COLORS.primary,
  },
  angleTabText: { ...FONTS.h2, fontSize: 16, color: COLORS.textSecondary },
  angleTabTextActive: { color: COLORS.primary },

  comparisonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  comparisonItem: {
    width: '48%',
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  latestBadge: {
    backgroundColor: '#D5F5E3',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  latestBadgeText: { ...FONTS.body3, fontSize: 12, color: '#28A745', fontWeight: '600' },
  progressNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(40, 167, 69, 0.1)', // Yeşil/Mavi gradient zor, o yüzden tek renk
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
  },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base * 1.5,
  },
  tipBox: {
    backgroundColor: COLORS.infoBackground,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
  },
  tipText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: SIZES.base / 2,
  },
});