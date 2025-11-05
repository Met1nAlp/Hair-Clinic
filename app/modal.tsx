import { useRouter } from 'expo-router';
import { CheckCircle2, X } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useSurveyStore } from '../store/surveyStore';

export default function SurveyResultModal() {
  const router = useRouter();
  const answers = useSurveyStore((state) => state.answers);

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '-'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <CheckCircle2 size={32} color={COLORS.white} />
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Medikal Analiz Raporu</Text>
        <Text style={styles.subtitle}>Anket bilgileriniz başarıyla kaydedildi</Text>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            <InfoRow label="Ad Soyad" value={answers.name} />
            <InfoRow label="Yaş" value={answers.age?.toString()} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medikal Geçmiş</Text>
            <InfoRow label="Önceki Saç Ekimi" value={answers.previousTransplant ? 'Evet' : 'Hayır'} />
            <InfoRow label="Kronik Hastalık" value={answers.chronicIllness ? 'Evet' : 'Hayır'} />
            {answers.chronicIllness && answers.chronicIllnessDetails && (
              <InfoRow label="Hastalık Detayı" value={answers.chronicIllnessDetails} />
            )}
            <InfoRow label="Düzenli İlaç Kullanımı" value={answers.regularMedication ? 'Evet' : 'Hayır'} />
            {answers.regularMedication && answers.medicationDetails && (
              <InfoRow label="İlaç Detayı" value={answers.medicationDetails} />
            )}
            <InfoRow label="Alerji" value={answers.allergies ? 'Evet' : 'Hayır'} />
            {answers.allergies && answers.allergyDetails && (
              <InfoRow label="Alerji Detayı" value={answers.allergyDetails} />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yaşam Tarzı</Text>
            <InfoRow label="Sigara Kullanımı" value={answers.smoking || '-'} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saç Dökülmesi</Text>
            <InfoRow label="Dökülme Tipi" value={answers.hairLossPattern || '-'} />
            <InfoRow label="Önceki Tedaviler" value={answers.previousTreatments ? 'Evet' : 'Hayır'} />
            {answers.previousTreatments && answers.treatmentDetails && (
              <InfoRow label="Tedavi Detayı" value={answers.treatmentDetails} />
            )}
            <InfoRow label="Aile Geçmişi" value={answers.familyHistory ? 'Evet' : 'Hayır'} />
          </View>

          {answers.expectations && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Beklentiler</Text>
              <Text style={styles.expectationsText}>{answers.expectations}</Text>
            </View>
          )}

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Bu bilgiler uzman ekibimiz tarafından değerlendirilmiştir. Size özel tedavi planınız hazırlanmıştır.
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingBottom: 0,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: SIZES.base,
  },
  title: {
    ...FONTS.h1,
    fontSize: 24,
    color: COLORS.textPrimary,
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.base,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  content: {
    paddingHorizontal: SIZES.padding,
    maxHeight: 400,
  },
  section: {
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.stepCardBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h2,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base * 1.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.iconInactive,
  },
  infoLabel: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    flex: 1,
  },
  infoValue: {
    ...FONTS.body2,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  expectationsText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  noteBox: {
    backgroundColor: COLORS.infoBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: '#BEDAFF',
  },
  noteText: {
    ...FONTS.body3,
    color: COLORS.primary,
    lineHeight: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    ...FONTS.h2,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
});
