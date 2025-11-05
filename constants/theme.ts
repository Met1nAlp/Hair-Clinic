import { Dimensions, TextStyle } from 'react-native';
const { width, height } = Dimensions.get('window');

// Renk paletimiz için bir tip tanımlayalım
export const COLORS = {
  // Ana Renkler
  primary: '#0D69FF', 
  white: '#FFFFFF',

  // Arka Planlar
  screenBackground: '#0D69FF',
  cardBackground: '#FFFFFF',
  stepCardBackground: '#F8F9FA',
  infoBackground: '#EBF2FF',

  // Metin Renkleri
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  textLight: '#495057',

  // Durum & Diğer
  iconActive: '#0D69FF',
  iconInactive: '#CED4DA',
};

// Boyutlandırma için bir tip tanımlayalım
export const SIZES = {
  // Global Boyutlar
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Ekran Boyutları
  width,
  height,

  // Font Boyutları
  h1: 24,
  h2: 18,
  body1: 16,
  body2: 14,
  body3: 12,
};

// Font stillerimiz için bir tip (TextStyle kullanıyoruz)
type FontStyles = {
  h1: TextStyle;
  h2: TextStyle;
  body2: TextStyle;
  body3: TextStyle;
};

// Yazı Tipleri
export const FONTS: FontStyles = {
  h1: { fontSize: SIZES.h1, fontWeight: '700', color: COLORS.textPrimary },
  h2: { fontSize: SIZES.h2, fontWeight: '600', color: COLORS.textPrimary },
  body2: { fontSize: SIZES.body2, fontWeight: '400', color: COLORS.textSecondary, lineHeight: 20 },
  body3: { fontSize: SIZES.body3, fontWeight: '400', color: COLORS.textSecondary, lineHeight: 18 },
};


// Backward compatibility
export const Colors = {
  light: {
    tint: COLORS.primary,
    text: COLORS.textPrimary,
    background: COLORS.cardBackground,
  },
  dark: {
    tint: COLORS.primary,
    text: COLORS.textPrimary,
    background: COLORS.cardBackground,
  },
  ...COLORS,
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;