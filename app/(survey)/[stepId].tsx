import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SURVEY_DATA, SurveyQuestion } from '../../constants/surveyData';
import { Colors, FONTS, SIZES } from '../../constants/theme';
import { MedicalAnswers, useSurveyStore } from '../../store/surveyStore';


const QuestionInput: React.FC<{ 
  question: SurveyQuestion; 
  onNext: (nextStepId: string, answer: any) => void;
  isNumber?: boolean;
}> = ({ question, onNext, isNumber = false }) => {
  const answers = useSurveyStore((state) => state.answers);
  const initialValue = answers[question.id as keyof MedicalAnswers];
  const [value, setValue] = useState(initialValue === undefined ? '' : String(initialValue));
  const disabled = !value || (isNumber && (parseInt(value) < 18 || parseInt(value) > 80));

  return (
    <>
      <Text style={styles.title}>{question.title}</Text>
      {question.subtitle && <Text style={styles.subtitle}>{question.subtitle}</Text>}
      <TextInput
        style={styles.textInput}
        placeholder={question.placeholder}
        placeholderTextColor={Colors.textSecondary}
        value={value}
        onChangeText={setValue}
        keyboardType={isNumber ? 'numeric' : 'default'}
        autoFocus
      />
      <TouchableOpacity 
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={() => onNext(question.nextStepId!, value)}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>Devam Et</Text>
        <Ionicons name="arrow-forward" size={20} color={Colors.white} />
      </TouchableOpacity>
    </>
  );
};

const QuestionTextArea: React.FC<{ 
  question: SurveyQuestion; 
  onNext: (nextStepId: string, answer: string) => void;
}> = ({ question, onNext }) => {
  const answers = useSurveyStore((state) => state.answers);
  const initialValue = answers[question.id as keyof MedicalAnswers];
  const [value, setValue] = useState(initialValue === undefined ? '' : String(initialValue));
  const disabled = !value || value.length < 5;

  return (
    <>
      <Text style={styles.title}>{question.title}</Text>
      {question.subtitle && <Text style={styles.subtitle}>{question.subtitle}</Text>}
      <TextInput
        style={[styles.textInput, { height: 120, textAlignVertical: 'top' }]}
        placeholder={question.placeholder}
        placeholderTextColor={Colors.textSecondary}
        value={value}
        onChangeText={setValue}
        multiline={true}
        numberOfLines={4}
        autoFocus
      />
      <TouchableOpacity 
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={() => onNext(question.nextStepId!, value)}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>Devam Et</Text>
        <Ionicons name="arrow-forward" size={20} color={Colors.white} />
      </TouchableOpacity>
    </>
  );
};

const QuestionBoolean: React.FC<{ 
  question: SurveyQuestion; 
  onNext: (nextStepId: string, answer: boolean) => void;
}> = ({ question, onNext }) => {
  return (
    <>
      <Text style={[styles.title, { textAlign: 'center' }]}>{question.title}</Text>
      {question.subtitle && <Text style={[styles.subtitle, { textAlign: 'center' }]}>{question.subtitle}</Text>}
      <View style={styles.selectionContainer}>
        {question.options?.map((option) => (
          <TouchableOpacity
            key={option.value.toString()}
            style={styles.selectionCard}
            onPress={() => onNext(option.nextStepId, option.value)}
          >
            <View style={[styles.boolIconCircle, option.value ? styles.iconYes : styles.iconNo]}>
              <Text style={styles.boolIconText}>{option.value ? '✅' : '❌'}</Text>
            </View>
            <Text style={styles.selectionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

const QuestionRadioGroup: React.FC<{ 
  question: SurveyQuestion; 
  onNext: (nextStepId: string, answer: string) => void;
}> = ({ question, onNext }) => {
  return (
    <>
      <Text style={styles.title}>{question.title}</Text>
      {question.subtitle && <Text style={styles.subtitle}>{question.subtitle}</Text>}
      <View style={{ marginTop: SIZES.base }}>
        {question.options?.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.radioCard}
            onPress={() => onNext(question.nextStepId!, option.value)}
          >
            <View>
              <Text style={styles.radioTitle}>{option.label}</Text>
              {option.subtitle && <Text style={styles.radioSubtitle}>{option.subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

const QuestionInstructional: React.FC<{ 
  question: SurveyQuestion; 
  onNext: (nextStepId: string, answer: string) => void;
}> = ({ question, onNext }) => {
  const userName = useSurveyStore((state) => state.answers.name) || '';
  const finalTitle = question.title.replace('{name}', userName);
  const preparations = [
    'İyi ışık alan bir odada çekim yapın',
    'Düz, tek renkli bir arka plan önünde durun',
    'Saçlarınız kuru ve düz olsun',
    'Şapka veya aksesuar kullanmayın',
  ];

  return (
    <>
      <View style={styles.iconHeaderContainer}>
        <Ionicons name="camera-outline" size={32} color={Colors.primary} />
      </View>
      <Text style={[styles.title, { textAlign: 'center' }]}>{finalTitle}</Text>
      <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: SIZES.padding }]}>
        {question.subtitle}
      </Text>
      <View style={styles.checklistContainer}>
        <Text style={styles.checklistTitle}>Hazırlık:</Text>
        {preparations.map((item, index) => (
          <View key={index} style={styles.checklistItem}>
            <FontAwesome name="check" size={16} color={Colors.primary} style={{ marginRight: SIZES.base * 1.5 }} />
            <Text style={styles.checklistText}>{item}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => onNext(question.nextStepId!, 'photo_prep_confirmed')}
      >
        <Text style={styles.buttonText}>Fotoğraf Çekimine Başla</Text>
        <Ionicons name="arrow-forward" size={20} color={Colors.white} />
      </TouchableOpacity>
    </>
  );
};

export default function SurveyStepScreen() {
  const router = useRouter();
  const { stepId } = useLocalSearchParams<{ stepId: string }>(); 
  const updateAnswer = useSurveyStore((state) => state.updateAnswer);
  const currentQuestion = SURVEY_DATA.find(q => q.id === stepId);

  const handleNext = (nextStepId: string, answer: any) => {
    try {
      if (stepId && currentQuestion && currentQuestion.type !== 'instructional') {
        updateAnswer(stepId as keyof MedicalAnswers, answer);
      }
      if (nextStepId.startsWith('/')) {
        router.replace(nextStepId);
      } else {
        router.push(`/(survey)/${nextStepId}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (!currentQuestion) {
    return <Text>Soru bulunamadı.</Text>;
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'text':
        return <QuestionInput question={currentQuestion} onNext={handleNext} />;
      case 'number':
        return <QuestionInput question={currentQuestion} onNext={handleNext} isNumber />;
      case 'textarea':
        return <QuestionTextArea question={currentQuestion} onNext={handleNext} />;
      case 'boolean':
        return <QuestionBoolean question={currentQuestion} onNext={handleNext} />;
      case 'radio-group':
        return <QuestionRadioGroup question={currentQuestion} onNext={handleNext} />;
      case 'instructional':
        return <QuestionInstructional question={currentQuestion} onNext={handleNext} />;
      default:
        return <Text>Bilinmeyen soru tipi.</Text>;
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer} 
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.questionWrapper}>
        {renderQuestion()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { 
    flexGrow: 1, 
    justifyContent: 'center',
    paddingVertical: SIZES.padding,
  },
  questionWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  title: { 
    ...FONTS.h1, 
    fontSize: 24, 
    marginBottom: SIZES.base * 1.5, 
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtitle: { 
    ...FONTS.body2, 
    fontSize: 15,
    marginBottom: SIZES.padding * 1.5, 
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  
  textInput: {
    ...FONTS.h2, fontSize: 17,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding * 1.5,
    backgroundColor: '#FAFBFC',
    color: Colors.textPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  selectionContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: SIZES.padding * 1.5,
    gap: SIZES.base * 2,
  },
  selectionCard: {
    flex: 1, 
    borderWidth: 2, 
    borderColor: '#E9ECEF',
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding * 1.5,
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  boolIconCircle: {
    width: 72, height: 72, borderRadius: 36,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SIZES.base * 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  boolIconText: { fontSize: 36 },
  iconNo: { backgroundColor: '#FFE5E5' },
  iconYes: { backgroundColor: '#D5F5E3' },
  selectionText: { 
    ...FONTS.h2, 
    fontSize: 17, 
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  
  radioCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderRadius: SIZES.radius * 1.2,
    backgroundColor: '#FAFBFC',
    marginBottom: SIZES.base * 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  radioTitle: { 
    ...FONTS.h2, 
    fontSize: 17, 
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  radioSubtitle: { 
    ...FONTS.body3, 
    fontSize: 13,
    color: Colors.textSecondary, 
    marginTop: 4,
    lineHeight: 18,
  },
  
  button: {
    flexDirection: 'row', 
    width: '100%',
    backgroundColor: Colors.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 'auto',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { 
    backgroundColor: Colors.iconInactive,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: { 
    color: Colors.white, 
    ...FONTS.h2, 
    fontSize: 17, 
    fontWeight: '700',
    marginRight: SIZES.base,
  },
  
  iconHeaderContainer: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.infoBackground,
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'center', 
    marginBottom: SIZES.padding * 1.5,
    borderWidth: 2,
    borderColor: '#D0E3FF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  checklistContainer: {
    backgroundColor: '#FAFBFC',
    borderRadius: SIZES.radius * 1.2,
    padding: SIZES.padding * 1.5,
    marginBottom: SIZES.padding * 1.5,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  checklistTitle: { 
    ...FONTS.h2, 
    fontSize: 17, 
    fontWeight: '600',
    color: Colors.textPrimary, 
    marginBottom: SIZES.padding,
  },
  checklistItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: SIZES.base * 2,
  },
  checklistText: { 
    ...FONTS.body2, 
    fontSize: 15,
    color: Colors.textSecondary, 
    flex: 1, 
    lineHeight: 21,
  },
});