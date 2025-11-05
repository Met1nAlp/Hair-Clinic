// Dosya: app/(photo-capture)/index.tsx
import { useRouter } from 'expo-router';
import { Camera, Check, Info, Mic, Upload } from 'lucide-react-native'; // Native ikonlar
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

// Tekrar eden kart yapısı için bir bileşen
const ModeCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  tag: React.ReactNode;
  onPress: () => void;
  borderColor?: string;
}> = ({ title, description, icon, features, tag, onPress, borderColor = '#E9ECEF' }) => (
  <TouchableOpacity 
    style={[styles.card, { borderColor }]} 
    onPress={onPress}
  >
    <View style={styles.cardIconContainer}>{icon}</View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    
    <View style={styles.featuresContainer}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <Check size={16} color="#28A745" />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>

    <View style={styles.tagContainer}>{tag}</View>
  </TouchableOpacity>
);

// Ana Mod Seçim Ekranı
export default function ModeSelectionScreen() {
  const router = useRouter();

  // Web kodunuzdaki 'setCaptureMode' ve 'setStage' mantığını 
  // Expo Router'ın 'router.push' komutuyla birleştiriyoruz.
  
  const handleSelectMode = (mode: 'studio' | 'manual' | 'gallery') => {
    // Dinamik rotamıza ([mode].tsx) 'mode' parametresini gönderiyoruz
    router.push(`/(photo-capture)/${mode}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Fotoğraf Yükleme Yönteminizi Seçin</Text>
      <Text style={styles.subtitle}>Size en uygun yöntemi seçin, istediğiniz zaman değiştirebilirsiniz</Text>

      {/* 1. Stüdyo Modu */}
      <ModeCard
        title="Stüdyo Modu"
        description="Sesli komutlarla eller serbest çekim"
        icon={<Mic size={32} color={COLORS.white} />}
        features={['Telefonunuzu sehpaya koyun', 'Sesli yönlendirme', 'Otomatik çekim']}
        tag={<Text style={[styles.tag, styles.tagRecommended]}>🎙️ Önerilen</Text>}
        onPress={() => handleSelectMode('studio')}
      />

      {/* 2. Manuel Kamera (Tasarımınızdaki vurgu) */}
      <ModeCard
        title="Manuel Kamera"
        description="Kendi hızınızda fotoğraf çekin"
        icon={<Camera size={32} color={COLORS.white} />}
        features={['Tam kontrol', 'Ekran üzerinde rehber', 'Manuel çekim butonu']}
        tag={<Text style={[styles.tag, styles.tagClassic]}>📸 Klasik</Text>}
        onPress={() => handleSelectMode('manual')}
        borderColor={COLORS.primary} // Vurgu
      />

      {/* 3. Galeri Yükleme */}
      <ModeCard
        title="Galeri Yükleme"
        description="Hazır fotoğraflarınızı yükleyin"
        icon={<Upload size={32} color={COLORS.white} />}
        features={['Önceden çekilmiş fotoğraflar', 'Hızlı yükleme', 'Birden fazla kaynak']}
        tag={<Text style={[styles.tag, styles.tagFast]}>🖼️ Hızlı</Text>}
        onPress={() => handleSelectMode('gallery')}
      />

      {/* İpucu Kutusu */}
      <View style={styles.tipBox}>
        <Info size={20} color="#FFA000" style={{ marginRight: SIZES.base }} />
        <Text style={styles.tipText}>
          <Text style={{ fontWeight: 'bold' }}>İpucu:</Text> Stüdyo Modu için telefonunuzu sabit bir yere koyun ve sesli komutları takip edin. En rahat yöntem budur.
        </Text>
      </View>
    </ScrollView>
  );
}

// Tasarımınıza uygun stiller
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Açık gri arka plan
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    fontSize: 22,
    textAlign: 'center',
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body2,
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    padding: SIZES.padding * 0.75,
    marginBottom: SIZES.base * 2,
    alignItems: 'flex-start',
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    borderRadius: SIZES.radius * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
    backgroundColor: COLORS.primary, // Varsayılan renk (diğerlerini ekleyebiliriz)
  },
  cardTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base / 2,
  },
  cardDescription: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base * 2,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: SIZES.base * 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  featureText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base,
  },
  tagContainer: {
    alignSelf: 'flex-start',
  },
  tag: {
    ...FONTS.body3,
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: SIZES.base / 2,
    paddingHorizontal: SIZES.base,
    borderRadius: SIZES.radius,
  },
  tagRecommended: {
    backgroundColor: '#EAE0FF', // Mor
    color: '#6F42C1',
  },
  tagClassic: {
    backgroundColor: COLORS.infoBackground, // Mavi
    color: COLORS.primary,
  },
  tagFast: {
    backgroundColor: '#D5F5E3', // Yeşil
    color: '#28A745',
  },
  tipBox: {
    backgroundColor: '#FFFBEA', // Sarı
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFEEBA',
  },
  tipText: {
    ...FONTS.body2,
    color: '#856404',
    flex: 1,
    lineHeight: 20,
  },
});