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
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  
  const cameraRef = useRef<CameraView>(null);
  const currentStepData = CAPTURE_STEPS[currentStep];
  
  // --- YÖNETİM & İZİNLER ---

  useEffect(() => {
    if (retakeIndex) {
      setCurrentStep(Number(retakeIndex));
    }
    
    if (mode === 'studio' || mode === 'manual') {
      requestCamPermission();
    }
  }, []);

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
    setPhoto(currentStep, photoUri);
    setIsCapturing(false);

    // Eğer retake modundaysak direkt review'e dön
    if (retakeIndex !== undefined) {
      router.replace('/(photo-capture)/review');
      return;
    }

    // Normal akış: sonraki adıma geç veya bitir
    if (currentStep < CAPTURE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
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

  const handleGalleryCapture = async () => {
    if (!galleryPermission?.granted) {
      const result = await requestGalleryPermission();
      if (!result.granted) {
        alert("Galeri izni vermeniz gerekiyor.");
        router.back();
        return;
      }
    }
    
    setIsCapturing(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      onPhotoCaptured(`data:image/jpeg;base64,${result.assets[0].base64}`);
    } else {
      setIsCapturing(false);
      if (currentStep === 0) {
        router.back();
      }
    }
  };

  // --- RENDER (GÖRÜNÜM) ---

  // 1. Galeri Modu
  if (mode === 'gallery') {
    return (
      <View style={[styles.container, styles.galleryContainer]}>
        <View style={styles.galleryCard}>
          <Text style={styles.galleryTitle}>{currentStepData.title}</Text>
          <Text style={styles.galleryDescription}>{currentStepData.description}</Text>
          <Text style={styles.galleryStep}>Adım {currentStep + 1} / {CAPTURE_STEPS.length}</Text>
          
          {isCapturing ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SIZES.padding }} />
          ) : (
            <TouchableOpacity style={styles.galleryButton} onPress={handleGalleryCapture}>
              <Text style={styles.buttonText}>Galeriden Seç</Text>
            </TouchableOpacity>
          )}
          
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backToReviewButton} onPress={() => router.replace('/(photo-capture)/review')}>
              <Text style={styles.backToReviewText}>İncelemeye Dön</Text>
            </TouchableOpacity>
          )}
        </View>
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
        facing={facing}
      >
        {/* Başlık (Header) */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>Adım {currentStep + 1} / {CAPTURE_STEPS.length}</Text>
            <Text style={styles.headerTitle}>{currentStepData.title}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setFacing(facing === 'front' ? 'back' : 'front')} 
            style={styles.changeButton}
          >
            <Text style={styles.changeButtonText}>{facing === 'front' ? 'Ön' : 'Arka'}</Text>
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
  
  galleryCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 2,
    margin: SIZES.padding,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  galleryTitle: {
    ...FONTS.h1,
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  galleryDescription: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  galleryStep: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginBottom: SIZES.padding * 1.5,
    fontWeight: '600',
  },
  galleryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    marginTop: SIZES.base,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  backToReviewButton: {
    marginTop: SIZES.padding,
    padding: SIZES.base * 1.5,
  },
  backToReviewText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});