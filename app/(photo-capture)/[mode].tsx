// Dosya: app/(photo-capture)/[mode].tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { Mic, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CAPTURE_STEPS } from '../../constants/photoData';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { usePhotoStore } from '../../store/photoStore';

export default function CaptureScreen() {
  const router = useRouter();
  // Dinamik parametreleri al: 'mode' = studio/manual/gallery
  // 'retakeIndex' = inceleme ekranından geliyorsa
  const { mode, retakeIndex } = useLocalSearchParams<{ mode: string; retakeIndex?: string }>();

  // Store'dan fotoğraf hafızasını al
  const { photos, setPhoto } = usePhotoStore();
  
  // Kamera ve Galeri izinleri
  const [camPermission, requestCamPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = ImagePicker.useMediaLibraryPermissions();

  // Web kodunuzdaki state'lerin React Native karşılıkları
  const [currentStep, setCurrentStep] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const currentStepData = CAPTURE_STEPS[currentStep];
  
  // --- YÖNETİM & İZİNLER ---

  // Ekran yüklendiğinde
  useEffect(() => {
    // İnceleme ekranından "Yeniden Çek" ile gelindiyse
    if (retakeIndex) {
      setCurrentStep(Number(retakeIndex));
    }
    
    // Mod'a göre izinleri iste veya işlemi başlat
    if (mode === 'gallery') {
      handleGalleryCapture(); // Galeriyi hemen başlat
    } else {
      requestCamPermission(); // Kamera modları için izin iste
    }
  }, []);

  // Adım değiştiğinde, Stüdyo Moduysa otomatik başlat
  useEffect(() => {
    if (mode === 'studio' && !isCapturing && currentStep < CAPTURE_STEPS.length) {
      handleStudioCapture();
    }
  }, [currentStep, mode]);

  // --- FOTOĞRAF ÇEKME MANTIKLARI ---
  
  // Web kodunuzdaki 'speak' fonksiyonu
  const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsSpeaking(true);
      Speech.speak(text, {
        language: 'tr-TR',
        rate: 0.9,
        pitch: 1,
        onDone: () => { setIsSpeaking(false); resolve(); },
        onError: () => { setIsSpeaking(false); resolve(); },
      });
    });
  };

  // Web kodunuzdaki 'capturePhoto' fonksiyonu
  const onPhotoCaptured = (photoUri: string) => {
    setPhoto(currentStep, photoUri); // Fotoğrafı hafızaya kaydet
    setIsCapturing(false);

    // Son adım mı kontrol et
    if (currentStep < CAPTURE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1); // Sonraki adıma geç
    } else {
      // Bitti! İnceleme ekranına git
      router.replace('/(photo-capture)/review');
    }
  };

  // --- MOD'A ÖZEL İŞLEMLER ---

  // Web kodunuzdaki 'handleStudioCapture'
  const handleStudioCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    
    await speak(currentStepData.voiceInstruction);

    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setCountdown(null);

    const photo = await cameraRef.current.takePictureAsync({ base64: true });
    onPhotoCaptured(`data:image/jpeg;base64,${photo.base64}`);
  };

  // Web kodunuzdaki 'handleManualCapture'
  const handleManualCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    
    const photo = await cameraRef.current.takePictureAsync({ base64: true });
    onPhotoCaptured(`data:image/jpeg;base64,${photo.base64}`);
  };

  // Web kodunuzdaki 'handleGalleryUpload'
  const handleGalleryCapture = async () => {
    if (!galleryPermission) {
      const result = await requestGalleryPermission();
      if (!result.granted) {
        alert("Galeri izni vermeniz gerekiyor.");
        router.back(); // İzin yoksa Mod Seçimine geri dön
        return;
      }
    }
    
    // Galeriyi aç
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
      base64: true, // Web kodunuz gibi Base64 kullanıyoruz
    });

    if (!result.canceled && result.assets[0].base64) {
      onPhotoCaptured(`data:image/jpeg;base64,${result.assets[0].base64}`);
      
      // Eğer galeri modundaysak ve son fotoğraf değilse, bir sonrakini seçmek için tekrar aç
      if (mode === 'gallery' && currentStep < CAPTURE_STEPS.length - 1) {
        setTimeout(handleGalleryCapture, 500); // Kullanıcıya nefes aldır
      }
    } else if (result.canceled) {
      // Kullanıcı galeriyi kapattı, mod seçimine geri dön
      router.back();
    }
  };

  // --- RENDER (GÖRÜNÜM) ---

  // 1. Galeri Modu (Yükleme ekranı)
  if (mode === 'gallery') {
    return (
      <View style={[styles.container, styles.galleryContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.headerTitle}>{currentStepData.title}</Text>
        <Text style={styles.headerSubtitle}>Lütfen galeriden seçin...</Text>
        <Text style={styles.headerSubtitle}>Adım {currentStep + 1} / {CAPTURE_STEPS.length}</Text>
      </View>
    );
  }

  // 2. Kamera Modları (Stüdyo veya Manuel)
  if (!camPermission) {
    return <View style={styles.container}><ActivityIndicator color={COLORS.primary} /></View>;
  }
  if (!camPermission.granted) {
    return (
      <View style={[styles.container, styles.galleryContainer]}>
        <Text style={styles.subtitle}>Kamera izni gerekiyor</Text>
        <TouchableOpacity onPress={requestCamPermission} style={styles.manualButton}>
          <Text style={styles.buttonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Ana Kamera Görünümü (Web kodunuzdaki 'stage === "capture"')
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={'front'} // 'user' = ön kamera
      >
        {/* Başlık (Header) */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>Adım {currentStep + 1} / {CAPTURE_STEPS.length}</Text>
            <Text style={styles.headerTitle}>{currentStepData.title}</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Değiştir</Text>
          </TouchableOpacity>
        </View>

        {/* Overlay (Web kodunuzdaki) */}
        <View style={styles.overlayContainer}>
          <View style={styles.overlay} />
        </View>
        
        {/* Geri Sayım */}
        {countdown !== null && (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}

        {/* Ses Göstergesi */}
        {isSpeaking && (
          <View style={styles.speakingIndicator}>
            <Volume2 size={24} color={COLORS.white} />
            <Text style={styles.speakingText}>Dinleyin...</Text>
          </View>
        )}

        {/* Alt Kontroller (Footer) */}
        <View style={styles.footer}>
          <Text style={styles.instructionText}>{currentStepData.instruction}</Text>
          
          {mode === 'manual' && (
            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={handleManualCapture}
              disabled={isCapturing}
            >
              {isCapturing ? <ActivityIndicator color={COLORS.primary} /> : <View style={styles.captureButtonInner} />}
            </TouchableOpacity>
          )}

          {mode === 'studio' && (
            <View style={styles.studioIndicator}>
              <Mic size={24} color={COLORS.white} />
              <Text style={styles.studioText}>Sesli yönlendirme aktif</Text>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}

// Stiller (Web kodunuzdaki tasarıma göre)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  galleryContainer: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row', justifyContent: 'space-between',
    padding: SIZES.padding, paddingTop: SIZES.padding * 2,
  },
  headerTitle: { ...FONTS.h2, color: COLORS.white },
  headerSubtitle: { ...FONTS.body3, color: COLORS.white, opacity: 0.8 },
  changeButton: {
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  changeButtonText: { ...FONTS.body3, color: COLORS.white },
  
  overlayContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    width: 250, height: 350,
    borderRadius: 175, // Oval
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },

  countdownContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  countdownText: { fontSize: 120, color: COLORS.white, fontWeight: 'bold' },
  
  speakingIndicator: {
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    padding: SIZES.base * 1.5,
    borderRadius: SIZES.radius * 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  speakingText: { ...FONTS.body2, color: COLORS.white, marginLeft: SIZES.base },
  
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
    alignItems: 'center',
  },
  instructionText: {
    ...FONTS.body2,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  captureButton: {
    width: 70, height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60, height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: 'black',
  },
  studioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.8,
  },
  studioText: { ...FONTS.body2, color: COLORS.white, marginLeft: SIZES.base },
  
  // Galeri modu için
  subtitle: { ...FONTS.h2, color: COLORS.textPrimary, marginBottom: SIZES.padding },
  manualButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.base * 2,
    borderRadius: SIZES.radius,
  },
  buttonText: { ...FONTS.h2, fontSize: 16, color: COLORS.white },
});