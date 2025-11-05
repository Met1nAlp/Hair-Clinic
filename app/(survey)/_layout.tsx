import { Ionicons } from '@expo/vector-icons';
import { Slot, Stack, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Appearance, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SURVEY_DATA } from '../../constants/surveyData';
import { Colors, FONTS, SIZES } from '../../constants/theme';
import { useSurveyStore } from '../../store/surveyStore';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercent = Math.max(0, (currentStep / totalSteps) * 100);
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>Adım {currentStep} / {totalSteps}</Text>
        <Text style={styles.progressText}>{Math.round(progressPercent)}%</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

export default function SurveyLayout() {
  const router = useRouter();
  const pathname = usePathname();
  
  const { getTotalSteps, answers } = useSurveyStore();
  const totalSteps = getTotalSteps();

  const surveySteps = SURVEY_DATA.filter(q => q.type !== 'instructional');
  const currentStepId = pathname.split('/').pop() || '';
  
  let currentIndex = surveySteps.findIndex(step => step.id === currentStepId);


  let effectiveCurrentStep = 0;
  if (answers.name) effectiveCurrentStep++;
  if (answers.age) effectiveCurrentStep++;
  if (answers.previousTransplant !== undefined) effectiveCurrentStep++;
  if (answers.chronicIllness !== undefined) effectiveCurrentStep++;
  if (answers.chronicIllness && answers.chronicIllnessDetails) effectiveCurrentStep++;
  if (answers.regularMedication !== undefined) effectiveCurrentStep++;
  if (answers.regularMedication && answers.medicationDetails) effectiveCurrentStep++;
  if (answers.allergies !== undefined) effectiveCurrentStep++;
  if (answers.allergies && answers.allergyDetails) effectiveCurrentStep++;
  if (answers.smoking) effectiveCurrentStep++;
  if (answers.hairLossPattern) effectiveCurrentStep++;
  if (answers.previousTreatments !== undefined) effectiveCurrentStep++;
  if (answers.previousTreatments && answers.treatmentDetails) effectiveCurrentStep++;
  if (answers.familyHistory !== undefined) effectiveCurrentStep++;

  const isInstructional = SURVEY_DATA.find(q => q.id === currentStepId)?.type === 'instructional';
  const colorScheme = Appearance.getColorScheme() ?? 'light';
  
  return (
    <SafeAreaView style={styles.layoutSafeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.layoutSlotContainer, { backgroundColor: colorScheme === 'dark' ? Colors.cardBackground : '#F8F9FA' }]}>
        <View style={styles.layoutCard}>
          {!isInstructional && (
            <View style={styles.headerInCard}>
              {currentIndex > 0 ? (
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              ) : <View style={styles.backButton} />}
              
              <View style={styles.progressWrapper}>
                <ProgressBar currentStep={effectiveCurrentStep} totalSteps={totalSteps} />
              </View>
            </View>
          )}
          
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layoutSafeArea: { flex: 1 },
  layoutSlotContainer: { 
    flex: 1, 
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  layoutCard: {
    flex: 1, 
    backgroundColor: Colors.cardBackground,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerInCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  backButton: { padding: SIZES.base, width: 40, marginRight: SIZES.base },
  progressWrapper: { flex: 1 },
  progressContainer: { width: '100%' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.base },
  progressText: { ...FONTS.body3, color: Colors.textSecondary, fontSize: 12 },
  progressBarBackground: { 
    height: 6, 
    backgroundColor: '#E9ECEF', 
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: { 
    height: 6, 
    backgroundColor: Colors.primary, 
    borderRadius: 3,
  },
});