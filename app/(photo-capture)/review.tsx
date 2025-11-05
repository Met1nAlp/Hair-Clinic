// Dosya: app/(photo-capture)/review.tsx
import { useRouter } from 'expo-router';
import { Camera, Check, RefreshCw } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CAPTURE_STEPS } from '../../constants/photoData';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { usePhotoStore } from '../../store/photoStore';
import { useSurveyStore } from '../../store/surveyStore';

export default function ReviewScreen() {
  const router = useRouter();
  const { photos, clearPhotos } = usePhotoStore();
  const { answers } = useSurveyStore(); // İleride API'ye göndermek için
  
  // Tüm fotoğraflar çekildi mi?
  const isComplete = photos.every(p => p !== null);

  // Web kodunuzdaki 'handleSubmit'
  const handleSubmit = () => {
    // TODO: 'photos' dizisini ve 'answers' (anket cevapları) objesini
    // buradan API'nize gönderin.
    
    console.log("Anket Cevapları:", answers);
    console.log("Çekilen Fotoğraflar:", photos.length);
    
    // Her şeyi temizle ve ana uygulamaya (tabs) dön
    clearPhotos();
    router.replace('/(tabs)/'); // veya bir "Tamamlandı" ekranına
  };

  // Web kodunuzdaki 'handleRetake' (Tek bir fotoğrafı yeniden çek)
  const handleRetake = (index: number) => {
    // Kullanıcıyı Manuel Kamera moduna, 'retakeIndex' parametresiyle gönder
    router.push(`/(photo-capture)/manual?retakeIndex=${index}`);
  };

  // Web kodunuzdaki 'Baştan Başla'
  const handleRedoAll = () => {
    clearPhotos();
    router.replace('/(photo-capture)/'); // Mod seçimine geri dön
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fotoğraflarınızı İnceleyin</Text>
        <Text style={styles.subtitle}>Tüm fotoğraflar net ve eksiksiz mi?</Text>
      </View>

      {/* Fotoğraf Izgarası (Grid) */}
      <View style={styles.grid}>
        {CAPTURE_STEPS.map((step, index) => (
          <View key={step.id} style={styles.photoCard}>
            <View style={styles.imageContainer}>
              {photos[index] ? (
                <Image source={{ uri: photos[index]! }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Camera size={40} color={COLORS.iconInactive} />
                </View>
              )}
            </View>
            <Text style={styles.photoTitle}>{step.title}</Text>
            <TouchableOpacity 
              style={styles.retakeButton} 
              onPress={() => handleRetake(index)}
            >
              <Text style={styles.retakeButtonText}>Yeniden Çek</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Onay Butonları */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, styles.submitButton]} 
          onPress={handleSubmit}
          disabled={!isComplete}
        >
          <Check size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>Onayla ve Devam Et</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.redoButton]} 
          onPress={handleRedoAll}
        >
          <RefreshCw size={20} color={COLORS.textPrimary} />
          <Text style={[styles.buttonText, { color: COLORS.textPrimary }]}>Baştan Başla</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: SIZES.padding, alignItems: 'center' },
  title: { ...FONTS.h1, fontSize: 22, color: COLORS.textPrimary, marginBottom: SIZES.base },
  subtitle: { ...FONTS.body2, color: COLORS.textSecondary },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.base,
  },
  photoCard: {
    width: '45%', // Ekranda 2'li sığdırma
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    marginBottom: SIZES.base * 2,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3/4, // 3:4 en boy oranı
    backgroundColor: COLORS.stepCardBackground,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    overflow: 'hidden', // Image'ın borderRadius'u takip etmesi için
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photoTitle: { ...FONTS.h2, fontSize: 14, color: COLORS.textPrimary, marginBottom: SIZES.base },
  retakeButton: {
    borderWidth: 1,
    borderColor: COLORS.iconInactive,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.base,
    width: '100%',
    alignItems: 'center',
  },
  retakeButtonText: { ...FONTS.body3, color: COLORS.textPrimary, fontWeight: '600' },
  
  footer: { padding: SIZES.padding },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.base * 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  submitButton: { backgroundColor: '#28A745' }, // Yeşil
  redoButton: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.iconInactive },
  buttonText: { ...FONTS.h2, fontSize: 16, color: COLORS.white, marginLeft: SIZES.base },
});