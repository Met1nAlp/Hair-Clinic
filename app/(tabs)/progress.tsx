// Dosya: app/(tabs)/progress.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar, Camera, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ANGLES } from '../../constants/progressData';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { usePhotoStore } from '../../store/photoStore';
import { useSurveyStore } from '../../store/surveyStore';

type ViewMode = 'gallery' | 'comparison';
type AngleKey = typeof ANGLES[number]['key'];

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
  const progressRecords = usePhotoStore((state) => state.progressRecords);
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [selectedAngle, setSelectedAngle] = useState<AngleKey>('front');

  const initialPhotos = progressRecords[0];
  const latestPhotos = progressRecords[progressRecords.length - 1];
  const canCompare = progressRecords.length >= 2;
  const hasRecords = progressRecords.length > 0;

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

  const renderGalleryView = () => (
    <View>
      {!hasRecords && (
        <View style={styles.emptyState}>
          <Camera size={48} color={COLORS.iconInactive} />
          <Text style={styles.emptyTitle}>Henüz fotoğraf yok</Text>
          <Text style={styles.emptyText}>"Yeni Fotoğraf Ekle" butonuna tıklayarak ilk fotoğraflarınızı ekleyin</Text>
        </View>
      )}
      {progressRecords.map((record) => (
        <View key={record.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>{record.month}</Text>
              <Text style={styles.cardSubtitle}>{record.date}</Text>
            </View>
            <View style={styles.photoBadge}><Text style={styles.photoBadgeText}>5 Fotoğraf</Text></View>
          </View>
          
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
    </View>
  );

  const renderComparisonView = () => {
    if (!canCompare) {
      return (
        <View style={styles.emptyState}>
          <TrendingUp size={48} color={COLORS.iconInactive} />
          <Text style={styles.emptyTitle}>Karşılaştırma için yeterli fotoğraf yok</Text>
          <Text style={styles.emptyText}>En az 2 farklı tarihte fotoğraf eklemeniz gerekiyor</Text>
        </View>
      );
    }
    return (
    <View>
      {ANGLES.map((angle) => (
        <View key={angle.key} style={styles.card}>
          <Text style={styles.angleTitle}>{angle.label}</Text>
          
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonColumn}>
              <Text style={styles.comparisonLabel}>Başlangıç</Text>
              <Text style={styles.comparisonDate}>{initialPhotos.date}</Text>
              <Image source={{ uri: initialPhotos.photos[angle.key] }} style={styles.comparisonImage} />
            </View>
            
            <View style={styles.comparisonColumn}>
              <View style={styles.comparisonLabelRow}>
                <Text style={styles.comparisonLabel}>Güncel</Text>
                <View style={styles.latestBadge}><Text style={styles.latestBadgeText}>Güncel</Text></View>
              </View>
              <Text style={styles.comparisonDate}>{latestPhotos.date}</Text>
              <Image source={{ uri: latestPhotos.photos[angle.key] }} style={styles.comparisonImage} />
            </View>
          </View>
        </View>
      ))}
      
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
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Gelişimim</Text>
            <Text style={styles.subtitle}>Saç ekimi sürecinizin görsel kaydı</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push('/(photo-capture)/')}
          >
            <Camera size={16} color={COLORS.white} />
            <Text style={styles.addButtonText}>Yeni Fotoğraf Ekle</Text>
          </TouchableOpacity>
        </View>

        {hasRecords && (
          <LinearGradient
            colors={['#0D69FF', '#0052CC']}
            style={styles.primaryCard}
          >
            <View style={styles.primaryCardHeader}>
              <View style={styles.primaryIconContainer}>
                <Calendar size={24} color={COLORS.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.primaryTitle}>Sonraki Kontrol</Text>
                <Text style={styles.primarySubtitle}>
                  Düzenli fotoğraf çekerek ilerlemenizi takip edin
                </Text>
              </View>
            </View>
          </LinearGradient>
        )}

        {renderViewToggle()}

        {viewMode === 'gallery' ? renderGalleryView() : renderComparisonView()}
        
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
  primarySubtitle: { ...FONTS.body2, color: 'rgba(255,255,255,0.8)' },
  
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
    width: 140,
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

  angleTitle: {
    ...FONTS.h2,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.base,
  },
  comparisonColumn: {
    flex: 1,
  },
  comparisonLabel: {
    ...FONTS.h2,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base / 2,
  },
  comparisonLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.base / 2,
  },
  comparisonDate: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  comparisonImage: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.stepCardBackground,
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
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    marginTop: SIZES.base,
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
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 3,
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  emptyTitle: {
    ...FONTS.h2,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
