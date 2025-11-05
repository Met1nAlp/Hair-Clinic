// Dosya: app/(tabs)/support.tsx
import {
    AlertCircle,
    ChevronDown,
    Clock,
    FileText,
    HelpCircle,
    Mail,
    MessageCircle,
    Phone,
    Send,
    Video,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { FAQS } from '../../constants/supportData';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

// Web kodunuzdaki 'Message' arayüzü
interface Message {
    id: string;
    sender: 'patient' | 'coordinator';
    text: string;
    timestamp: Date;
}

// --- Alt Bileşenler ---

// 1. SSS (FAQ) Akordeon Bileşeni
const FaqItem: React.FC<{ item: typeof FAQS[0]; isOpen: boolean; onPress: () => void }> =
    ({ item, isOpen, onPress }) => (
        <View style={styles.faqItem}>
            <TouchableOpacity style={styles.faqTrigger} onPress={onPress}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <ChevronDown size={20} color={COLORS.primary} style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.faqContent}>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
            )}
        </View>
    );

// 2. İletişim Bilgisi Kartı
const ContactCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; details: string; onPress: () => void }> =
    ({ icon, title, subtitle, details, onPress }) => (
        <TouchableOpacity style={styles.contactCard} onPress={onPress}>
            <View style={styles.contactIconContainer}>{icon}</View>
            <View style={{ flex: 1 }}>
                <Text style={styles.contactTitle}>{title}</Text>
                <Text style={styles.contactSubtitle}>{subtitle}</Text>
                <Text style={styles.contactDetails}>{details}</Text>
            </View>
        </TouchableOpacity>
    );

// --- Ana Ekran ---
export default function SupportScreen() {
    const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'contact'>('chat');
    const [activeFaq, setActiveFaq] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef<FlatList>(null);

    // Web kodunuzdaki 'messages' state'i
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'coordinator', text: 'Merhaba! Ben hasta koordinatörünüz Ayşe. Size nasıl yardımcı olabilirim?', timestamp: new Date(Date.now() - 120 * 60000) },
        { id: '2', sender: 'patient', text: 'Merhaba, operasyon sonrası ilk yıkamayı ne zaman yapmalıyım?', timestamp: new Date(Date.now() - 115 * 60000) },
        { id: '3', sender: 'coordinator', text: 'İlk yıkamanız operasyondan 3 gün sonra kliniğimizde yapılacaktır. Size hatırlatma göndereceğiz. Yıkama videolarını "Gelişimim" bölümünden izleyebilirsiniz.', timestamp: new Date(Date.now() - 110 * 60000) }
    ]);

    // Web kodunuzdaki 'handleSendMessage'
    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const message: Message = { id: Date.now().toString(), sender: 'patient', text: newMessage, timestamp: new Date() };
        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Listenin en altına kaydır
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        // Simüle edilmiş cevap
        setTimeout(() => {
            const response: Message = { id: (Date.now() + 1).toString(), sender: 'coordinator', text: 'Mesajınızı aldım. En kısa sürede size dönüş yapacağım.', timestamp: new Date() };
            setMessages(prev => [...prev, response]);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }, 2000);
    };

    // --- RENDER FONKSİYONLARI (Sekmeler için) ---

    const renderChatTab = () => (
        <View style={styles.tabContent}>
            {/* Koordinatör Bilgisi */}
            <View style={styles.coordinatorCard}>
                <View style={styles.coordinatorAvatar}><Text style={styles.coordinatorAvatarText}>AK</Text></View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.coordinatorName}>Ayşe Kaya</Text>
                    <Text style={styles.coordinatorTitle}>Hasta Koordinatörü</Text>
                </View>
                <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>Çevrimiçi</Text></View>
            </View>

            {/* Mesaj Listesi (FlatList, performans için ScrollView'den daha iyidir) */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                style={styles.chatContainer}
                contentContainerStyle={{ padding: SIZES.base }}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageBubble,
                        item.sender === 'patient' ? styles.messagePatient : styles.messageCoordinator
                    ]}>
                        <Text style={item.sender === 'patient' ? styles.messageTextPatient : styles.messageTextCoordinator}>
                            {item.text}
                        </Text>
                        <Text style={item.sender === 'patient' ? styles.messageTimePatient : styles.messageTimeCoordinator}>
                            {item.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                )}
            />

            {/* Mesaj Girişi */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholderTextColor={COLORS.textSecondary}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Send size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>
            <Text style={styles.responseTime}><Clock size={14} color={COLORS.textSecondary} /> Ortalama yanıt süresi: 15 dakika</Text>
        </View>
    );

    const renderFaqTab = () => (
        <ScrollView style={styles.tabContent}>
            <View style={styles.faqHeader}>
                <HelpCircle size={20} color={COLORS.primary} />
                <Text style={styles.faqHeaderText}>En sık sorulan sorulara göz atın. Cevabınızı bulamazsanız, bizimle iletişime geçin.</Text>
            </View>
            {FAQS.map((faq) => (
                <FaqItem
                    key={faq.question}
                    item={faq}
                    isOpen={activeFaq === faq.question}
                    onPress={() => setActiveFaq(activeFaq === faq.question ? null : faq.question)}
                />
            ))}
            {/* Ek Kaynaklar */}
            <View style={styles.resourcesCard}>
                <Text style={styles.resourcesTitle}>Ek Kaynaklar</Text>
                <TouchableOpacity style={styles.resourceButton}>
                    <Video size={16} color={COLORS.textPrimary} />
                    <Text style={styles.resourceButtonText}>Eğitim Videoları</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resourceButton}>
                    <FileText size={16} color={COLORS.textPrimary} />
                    <Text style={styles.resourceButtonText}>Hasta Rehberi (PDF)</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderContactTab = () => (
        <ScrollView style={styles.tabContent}>
            <ContactCard
                icon={<Phone size={24} color={COLORS.primary} />}
                title="Telefon"
                subtitle="+90 212 XXX XX XX"
                details="Pzt - Cuma: 09:00 - 18:00"
                onPress={() => Linking.openURL('tel:+902120000000')}
            />
            <ContactCard
                icon={<MessageCircle size={24} color="#28A745" />}
                title="WhatsApp"
                subtitle="+90 555 XXX XX XX"
                details="7/24 Aktif"
                onPress={() => Linking.openURL('https://wa.me/905550000000')}
            />
            <ContactCard
                icon={<Mail size={24} color="#6F42C1" />}
                title="E-posta"
                subtitle="info@smilehairclinic.com"
                details="24 saat içinde yanıt"
                onPress={() => Linking.openURL('mailto:info@smilehairclinic.com')}
            />
            <ContactCard
                icon={<AlertCircle size={24} color="#DC3545" />}
                title="Acil Hat"
                subtitle="+90 555 123 45 67"
                details="7/24 Acil Destek"
                onPress={() => Linking.openURL('tel:+905551234567')}
            />
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.content}>
                    <Text style={styles.title}>Destek</Text>
                    <Text style={styles.subtitle}>Size yardımcı olmak için buradayız</Text>

                    {/* Acil Durum Kartı */}
                    <View style={styles.emergencyCard}>
                        <View style={styles.emergencyIcon}>
                            <AlertCircle size={24} color={COLORS.white} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.emergencyTitle}>Acil Durum İletişim</Text>
                            <Text style={styles.emergencyText}>Acil bir durumla karşılaşırsanız, 7/24 acil hat numaramızı arayabilirsiniz.</Text>
                            <TouchableOpacity
                                style={styles.emergencyButton}
                                onPress={() => Linking.openURL('tel:+905551234567')}
                            >
                                <Phone size={16} color={COLORS.white} />
                                <Text style={styles.emergencyButtonText}>+90 555 123 45 67</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Özel Sekme (Tab) Navigasyonu */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'chat' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('chat')}
                        >
                            <MessageCircle size={16} color={activeTab === 'chat' ? COLORS.primary : COLORS.textSecondary} />
                            <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>Mesajlaşma</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'faq' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('faq')}
                        >
                            <HelpCircle size={16} color={activeTab === 'faq' ? COLORS.primary : COLORS.textSecondary} />
                            <Text style={[styles.tabText, activeTab === 'faq' && styles.tabTextActive]}>Sık Sorulan Sorular</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'contact' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('contact')}
                        >
                            <Phone size={16} color={activeTab === 'contact' ? COLORS.primary : COLORS.textSecondary} />
                            <Text style={[styles.tabText, activeTab === 'contact' && styles.tabTextActive]}>İletişim</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Aktif Sekme İçeriği */}
                    <View style={styles.tabContentContainer}>
                        {activeTab === 'chat' && renderChatTab()}
                        {activeTab === 'faq' && renderFaqTab()}
                        {activeTab === 'contact' && renderContactTab()}
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

// Stiller (Web kodunuza ve ekran görüntünüze göre)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    content: { padding: SIZES.padding },
    title: { ...FONTS.h1, color: COLORS.textPrimary },
    subtitle: { ...FONTS.body2, color: COLORS.textSecondary, marginBottom: SIZES.padding },

    emergencyCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF8F7',
        borderWidth: 1,
        borderColor: '#FEE2E2',
        borderRadius: SIZES.radius * 2,
        padding: SIZES.padding,
    },
    emergencyIcon: {
        width: 48, height: 48,
        borderRadius: 24,
        backgroundColor: '#DC3545',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.base * 2,
    },
    emergencyTitle: { ...FONTS.h2, fontSize: 18, color: COLORS.textPrimary, marginBottom: SIZES.base / 2 },
    emergencyText: { ...FONTS.body2, color: COLORS.textSecondary, marginBottom: SIZES.base * 2 },
    emergencyButton: {
        flexDirection: 'row',
        backgroundColor: '#DC3545',
        padding: SIZES.base * 1.5,
        borderRadius: SIZES.radius,
        alignSelf: 'flex-start',
    },
    emergencyButtonText: { ...FONTS.h2, fontSize: 16, color: COLORS.white, marginLeft: SIZES.base },

    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: COLORS.iconInactive,
        marginTop: SIZES.padding,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SIZES.base * 2,
        borderBottomWidth: 2,
        borderColor: 'transparent',
    },
    tabButtonActive: {
        borderColor: COLORS.primary,
    },
    tabText: {
        ...FONTS.h2, fontSize: 14,
        color: COLORS.textSecondary,
        marginLeft: SIZES.base,
    },
    tabTextActive: {
        color: COLORS.primary,
    },

    tabContentContainer: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius * 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        minHeight: 500,
    },
    tabContent: {
        padding: SIZES.padding,
    },

    // Sohbet Sekmesi Stilleri
    coordinatorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.infoBackground,
        borderRadius: SIZES.radius,
        padding: SIZES.base * 1.5,
    },
    coordinatorAvatar: {
        width: 48, height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.base,
    },
    coordinatorAvatarText: { ...FONTS.h2, color: COLORS.white },
    coordinatorName: { ...FONTS.h2, fontSize: 16, color: COLORS.textPrimary },
    coordinatorTitle: { ...FONTS.body3, color: COLORS.textSecondary },
    statusBadge: {
        backgroundColor: '#D5F5E3',
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.base / 2,
        borderRadius: SIZES.radius,
    },
    statusBadgeText: { ...FONTS.body3, color: '#28A745', fontWeight: '600' },
    chatContainer: {
        height: 400, // Sabit yükseklik
        backgroundColor: COLORS.stepCardBackground,
        borderRadius: SIZES.radius,
        marginVertical: SIZES.base * 2,
    },
    messageBubble: {
        maxWidth: '70%',
        padding: SIZES.base * 1.5,
        borderRadius: SIZES.radius,
        marginBottom: SIZES.base,
    },
    messagePatient: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-end',
    },
    messageCoordinator: {
        backgroundColor: COLORS.white,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: COLORS.iconInactive,
    },
    messageTextPatient: { ...FONTS.body2, color: COLORS.white },
    messageTextCoordinator: { ...FONTS.body2, color: COLORS.textPrimary },
    messageTimePatient: { ...FONTS.body3, fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4, textAlign: 'right' },
    messageTimeCoordinator: { ...FONTS.body3, fontSize: 10, color: COLORS.textSecondary, marginTop: 4, textAlign: 'left' },
    inputContainer: {
        flexDirection: 'row',
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.iconInactive,
        borderRadius: SIZES.radius,
        padding: SIZES.base * 1.5,
        marginRight: SIZES.base,
        ...FONTS.body2,
        color: COLORS.textPrimary,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        padding: SIZES.base * 1.5,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
    },
    responseTime: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SIZES.base * 1.5,
    },

    // SSS Sekmesi Stilleri
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.infoBackground,
        padding: SIZES.base * 1.5,
        borderRadius: SIZES.radius,
        marginBottom: SIZES.base * 2,
    },
    faqHeaderText: { ...FONTS.body3, color: COLORS.textPrimary, flex: 1, marginLeft: SIZES.base },
    faqItem: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.iconInactive,
        borderRadius: SIZES.radius,
        marginBottom: SIZES.base,
    },
    faqTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SIZES.base * 2,
    },
    faqQuestion: { ...FONTS.h2, fontSize: 16, color: COLORS.textPrimary, flex: 1, marginRight: SIZES.base },
    faqContent: {
        padding: SIZES.base * 2,
        paddingTop: 0,
    },
    faqAnswer: { ...FONTS.body2, color: COLORS.textSecondary, lineHeight: 20 },
    resourcesCard: {
        backgroundColor: COLORS.stepCardBackground,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginTop: SIZES.base,
    },
    resourcesTitle: { ...FONTS.h2, fontSize: 16, color: COLORS.textPrimary, marginBottom: SIZES.base * 1.5 },
    resourceButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.iconInactive,
        padding: SIZES.base * 1.5,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        marginBottom: SIZES.base,
    },
    resourceButtonText: { ...FONTS.h2, fontSize: 14, color: COLORS.textPrimary, marginLeft: SIZES.base },

    // İletişim Sekmesi Stilleri
    contactCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.iconInactive,
        borderRadius: SIZES.radius,
        padding: SIZES.base * 2,
        marginBottom: SIZES.base * 1.5,
    },
    contactIconContainer: {
        width: 48, height: 48,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.infoBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SIZES.base * 1.5,
    },
    contactTitle: { ...FONTS.h2, fontSize: 16, color: COLORS.textPrimary },
    contactSubtitle: { ...FONTS.body2, color: COLORS.textPrimary, marginVertical: 4 },
    contactDetails: { ...FONTS.body3, color: COLORS.textSecondary },
});