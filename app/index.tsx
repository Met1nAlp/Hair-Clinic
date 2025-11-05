import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SURVEY_DATA } from '../constants/surveyData';
import { Colors, FONTS, SIZES } from '../constants/theme';
import { useSurveyStore } from '../store/surveyStore';

const StepInfoCard: React.FC<{ number: string, title: string, description: string, active: boolean }> = 
  ({ number, title, description, active }) => (
  <View style={[styles.stepCard, active ? styles.stepCardActive : styles.stepCardInactive]}>
    <View style={styles.stepHeader}>
      <View style={[styles.stepCircle, active ? styles.stepCircleActive : styles.stepCircleInactive]}>
        <Text style={styles.stepCircleText}>{number}</Text>
      </View>
      <Text style={[styles.stepTitle, active ? styles.stepTitleActive : styles.stepTitleInactive]}>{title}</Text>
    </View>
    <Text style={styles.stepDescription}>{description}</Text>
  </View>
);

export default function WelcomeScreen() {
  const router = useRouter(); 
  const resetSurvey = useSurveyStore((state) => state.resetSurvey);

  const handleStartPress = () => {
    try {
      resetSurvey(); 
      const firstQuestionId = SURVEY_DATA[0]?.id;
      if (firstQuestionId) {
        router.replace(`/(survey)/${firstQuestionId}`);
      }
    } catch (error) {
      console.error('Start survey error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainCard}>
          
          <View style={styles.iconCircle}>
            <Feather name="heart" size={32} color={Colors.white} />
          </View>

          <Text style={styles.title}>Smile Hair Clinic'e Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>
            Size en iyi çözümü sunabilmemiz için 2 adımda bilgilerinize ihtiyacımız var:
          </Text>

          {/* Sizin web kodunuzdaki 2 kart */}
          <View style={styles.stepsContainer}>
            <StepInfoCard
              number="1"
              title="Medikal Anket"
              description="Sağlık geçmişiniz ve beklentileriniz"
              active={true}
            />
            <StepInfoCard
              number="2"
              title="Saç Analiz Fotoğrafları"
              description="Yönlendirmeli çekim ile 5 standart açı"
              active={false}
            />
          </View>

          <View style={styles.infoBox}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Tahmini Süre: 5-7 dakika</Text>
          </View>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleStartPress}
          >
            <Text style={styles.buttonText}>Başlayalım</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.screenBackground }, // Mavi arka plan
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: SIZES.padding / 2 },
  mainCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },
  title: { ...FONTS.h1, textAlign: 'center', marginBottom: SIZES.base, color: Colors.textPrimary },
  subtitle: { ...FONTS.body2, textAlign: 'center', marginBottom: SIZES.padding },
  
  stepsContainer: { width: '100%', marginBottom: SIZES.padding },
  stepCard: {
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
    marginBottom: SIZES.base,
  },
  stepCardActive: { backgroundColor: '#EBF2FF', borderWidth: 1, borderColor: '#BEDAFF' },
  stepCardInactive: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E9ECEF' },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.base },
  stepCircle: {
    width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    marginRight: SIZES.base,
  },
  stepCircleActive: { backgroundColor: Colors.primary },
  stepCircleInactive: { backgroundColor: Colors.iconInactive },
  stepCircleText: { color: Colors.white, fontWeight: 'bold' },
  stepTitle: { ...FONTS.h2, fontSize: 16 },
  stepTitleActive: { color: Colors.primary },
  stepTitleInactive: { color: Colors.textPrimary },
  stepDescription: { ...FONTS.body3, color: Colors.textSecondary, paddingLeft: 32 },
  
  infoBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.infoBackground,
    width: '100%', borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    justifyContent: 'center', marginBottom: SIZES.padding,
  },
  infoText: { ...FONTS.body2, color: Colors.primary, marginLeft: SIZES.base, fontWeight: '500' },
  
  primaryButton: {
    flexDirection: 'row', width: '100%',
    backgroundColor: Colors.primary,
    padding: SIZES.base * 2, borderRadius: SIZES.radius,
    justifyContent: 'center', alignItems: 'center',
  },
  buttonText: { color: Colors.white, ...FONTS.h2, fontSize: 16, marginRight: SIZES.base },
});