/**
 * 앱 전체에서 사용하는 색상 테마
 */

export const COLORS = {
  white: "#FFFFFF",
  black: "#000000",
  gray100: "#F8F9FA",
  gray200: "#E9ECEF",
  gray300: "#DEE2E6",
  gray400: "#CED4DA",
  gray500: "#ADB5BD",
  gray600: "#6C757D",
  gray700: "#495057",
  gray800: "#343A40",
  gray900: "#212529",

  success: "#51CF66",
  warning: "#FFD43B",
  error: "#FF6B6B",
  info: "#4ECDC4",

  background: "#FFFFFF",
  backgroundSecondary: "#F8F9FA",
  backgroundTertiary: "#E9ECEF",

  text: "#212529",
  textSecondary: "#6C757D",
  textTertiary: "#ADB5BD",
  textInverse: "#FFFFFF",

  border: "#DEE2E6",
  borderLight: "#E9ECEF",
  borderDark: "#CED4DA",
} as const;

export type ColorKey = keyof typeof COLORS;
