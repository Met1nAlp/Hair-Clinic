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
  safeArea: { flex: 1, backgroundColor: Colors.screenBackground },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: SIZES.padding,
  },
  mainCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 1.5,
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SIZES.padding,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { 
    ...FONTS.h1, 
    fontSize: 26,
    textAlign: 'center', 
    marginBottom: SIZES.base * 1.5, 
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: { 
    ...FONTS.body2, 
    fontSize: 15,
    textAlign: 'center', 
    marginBottom: SIZES.padding * 1.5,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  
  stepsContainer: { width: '100%', marginBottom: SIZES.padding },
  stepCard: {
    borderRadius: SIZES.radius * 1.2,
    padding: SIZES.padding,
    marginBottom: SIZES.base * 1.5,
  },
  stepCardActive: { 
    backgroundColor: '#EBF2FF', 
    borderWidth: 2, 
    borderColor: '#BEDAFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepCardInactive: { 
    backgroundColor: '#F8F9FA', 
    borderWidth: 1, 
    borderColor: '#E9ECEF',
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.base },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    marginRight: SIZES.base * 1.5,
  },
  stepCircleActive: { 
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  stepCircleInactive: { backgroundColor: Colors.iconInactive },
  stepCircleText: { color: Colors.white, fontWeight: 'bold', fontSize: 13 },
  stepTitle: { ...FONTS.h2, fontSize: 17, fontWeight: '600' },
  stepTitleActive: { color: Colors.primary },
  stepTitleInactive: { color: Colors.textPrimary },
  stepDescription: { 
    ...FONTS.body3, 
    fontSize: 13,
    color: Colors.textSecondary, 
    paddingLeft: 40,
    lineHeight: 19,
  },
  
  infoBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.infoBackground,
    width: '100%', borderRadius: SIZES.radius,
    padding: SIZES.padding,
    justifyContent: 'center', 
    marginBottom: SIZES.padding * 1.5,
    borderWidth: 1,
    borderColor: '#D0E3FF',
  },
  infoText: { 
    ...FONTS.body2, 
    fontSize: 15,
    color: Colors.primary, 
    marginLeft: SIZES.base, 
    fontWeight: '600',
  },
  
  primaryButton: {
    flexDirection: 'row', width: '100%',
    backgroundColor: Colors.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { 
    color: Colors.white, 
    ...FONTS.h2, 
    fontSize: 17, 
    fontWeight: '700',
    marginRight: SIZES.base,
  },
});