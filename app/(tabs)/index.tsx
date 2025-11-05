// Dosya: app/(tabs)/index.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Phone,
  Video,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useSurveyStore } from '../../store/surveyStore';

// Web kodunuzdaki 'Quick Action' kartları için
const QuickActionCard: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress: () => void;
}> = ({ title, subtitle, icon, onPress }) => (
  <TouchableOpacity style={styles.quickCard} onPress={onPress}>
    <View style={styles.quickIconContainer}>{icon}</View>
    <View style={styles.quickTextContainer}>
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

// Web kodunuzdaki 'Checklist Item' için
type ChecklistItemProps = {
  status: 'completed' | 'pending' | 'todo';
  title: string;
  subtitle: string;
};
const ChecklistItem: React.FC<ChecklistItemProps> = ({ status, title, subtitle }) => {
  const getIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} color="#28A745" />;
      case 'pending':
        return <Clock size={20} color={COLORS.primary} />;
      default:
        return <View style={styles.todoIcon} />;
    }
  };
  const getContainerStyle = () => {
    switch (status) {
      case 'completed':
        return { backgroundColor: '#E7F7E9' };
      case 'pending':
        return { backgroundColor: COLORS.infoBackground, borderColor: '#BEDAFF', borderWidth: 1 };
      default:
        return { backgroundColor: COLORS.stepCardBackground };
    }
  };

  return (
    <View style={[styles.checklistItem, getContainerStyle()]}>
      <View style={{ marginRight: SIZES.base }}>{getIcon()}</View>
      <View>
        <Text style={styles.checklistTitle}>{title}</Text>
        <Text style={styles.checklistSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const router = useRouter();
  // Hastanın adını anket store'undan al
  const patientName = useSurveyStore((state) => state.answers.name) || 'Misafir';

  // Ekran görüntüsü ve web kodunuzdaki simüle edilmiş veriler
  const daysUntilOperation = 3;
  // Simüle edilmiş tarih (Ekran görüntüsündeki gibi)
  // Bu kodu dinamik tarihle güncelleyebiliriz
  const operationDateStr = '8 Kasım 2025 Cumartesi'; 

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Başlık */}
        <View style={styles.header}>
          <Text style={styles.title}>Merhaba, {patientName}</Text>
          <Text style={styles.subtitle}>Smile Hair Clinic dijital yolculuğunuza hoş geldiniz</Text>
        </View>

        {/* Ana Eylem Kartı (Mavi Gradient) */}
        <LinearGradient
          colors={['#0D69FF', '#0052CC']}
          style={styles.primaryCard}
        >
          <View style={styles.primaryCardHeader}>
            <View style={styles.primaryIconContainer}>
              <Calendar size={24} color={COLORS.white} />
            </View>
            <View>
              <View style={styles.badge}><Text style={styles.badgeText}>Yaklaşan</Text></View>
              <Text style={styles.primaryTitle}>Operasyonunuza {daysUntilOperation} Gün Kaldı</Text>
              <Text style={styles.primarySubtitle}>{operationDateStr}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <FileText size={16} color={COLORS.primary} />
            <Text style={styles.primaryButtonText}>Operasyon Öncesi Kontrol Listesini Gözden Geçirin</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Hızlı Eylemler (3'lü Grid) */}
        <View style={styles.quickActionsContainer}>
          <QuickActionCard
            icon={<CheckCircle2 size={20} color="#28A745" />}
            title="Analiz Tamamlandı"
            subtitle="Raporunuzu görüntüleyin"
            onPress={() => router.push('/modal')}
          />
          <QuickActionCard
            icon={<Video size={20} color={COLORS.primary} />}
            title="Hazırlık Videoları"
            subtitle="Bilgilendirme"
            onPress={() => alert('Videolar yakında eklenecek')}
          />
          <QuickActionCard
            icon={<Phone size={20} color="#6F42C1" />}
            title="Koordinatör İletişim"
            subtitle="Bize ulaşın"
            onPress={() => router.push('/(tabs)/support')}
          />
        </View>

        {/* Kontrol Listesi */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Operasyon Öncesi Kontrol Listesi</Text>
            <View style={styles.checklistBadge}>
              <Text style={styles.checklistBadgeText}>5/8 Tamamlandı</Text>
            </View>
          </View>
          <ChecklistItem
            status="completed"
            title="Online konsültasyon tamamlandı"
            subtitle="2 gün önce"
          />
          <ChecklistItem
            status="completed"
            title="Kan tahlilleri yüklendi"
            subtitle="1 gün önce"
          />
          <ChecklistItem
            status="completed"
            title="Ulaşım detayları onaylandı"
            subtitle="1 gün önce"
          />
          <ChecklistItem
            status="pending"
            title="Operasyon öncesi 24 saat video izle"
            subtitle="Yakında"
          />
          <ChecklistItem
            status="todo"
            title="Operasyon günü alkol/kafein almayın"
            subtitle="Operasyon günü"
          />
          <ChecklistItem
            status="todo"
            title="Rahat kıyafetler giyin"
            subtitle="Operasyon günü"
          />
        </View>

        {/* Önemli Hatırlatmalar */}
        <View style={styles.reminderCard}>
          <AlertCircle size={24} color="#FFA000" style={{ marginRight: SIZES.base }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.reminderTitle}>Önemli Hatırlatmalar</Text>
            <Text style={styles.reminderText}>• Operasyondan 1 hafta önce aspirin ve kan sulandırıcı ilaçları bırakın</Text>
            <Text style={styles.reminderText}>• Operasyondan 3 gün önce alkol tüketimini durdurun</Text>
            <Text style={styles.reminderText}>• Operasyon günü rahat, önden düğmeli kıyafetler tercih edin</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

// Stiller (Web kodunuza ve ekran görüntünüze göre)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Arka plan
  },
  content: {
    padding: SIZES.padding,
  },
  header: {
    marginBottom: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginTop: SIZES.base / 2,
  },
  primaryCard: {
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 1.5,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  primaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base * 2,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
    marginBottom: SIZES.base,
  },
  badgeText: {
    ...FONTS.body3,
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  primaryTitle: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  primarySubtitle: {
    ...FONTS.body2,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SIZES.base / 2,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    ...FONTS.h2,
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: SIZES.base,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  quickCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding,
    width: '32%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quickIconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.infoBackground,
    marginBottom: SIZES.padding,
  },
  quickTitle: {
    ...FONTS.h2,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  quickSubtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: SIZES.base / 2,
  },
  quickTextContainer: {
    minHeight: 50, // Kart yüksekliklerini eşitler
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 1.5,
    marginBottom: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  cardTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  checklistBadge: {
    backgroundColor: COLORS.infoBackground,
    borderColor: '#BEDAFF',
    borderWidth: 1,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  checklistBadgeText: {
    ...FONTS.body3,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SIZES.padding,
    borderRadius: SIZES.radius * 1.2,
    marginBottom: SIZES.base * 1.5,
  },
  checklistTitle: {
    ...FONTS.body2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  checklistSubtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  todoIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.iconInactive,
  },
  reminderCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEA',
    borderRadius: SIZES.radius * 2,
    padding: SIZES.padding * 1.5,
    borderWidth: 1,
    borderColor: '#FFEEBA',
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  reminderTitle: {
    ...FONTS.h2,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
  },
  reminderText: {
    ...FONTS.body3,
    color: '#856404',
    lineHeight: 18,
    marginBottom: SIZES.base / 2,
  },
});