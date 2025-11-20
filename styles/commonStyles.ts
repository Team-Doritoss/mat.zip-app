import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { COLORS } from "@/constants/colors";
import { SPACING, CARD_BORDER_RADIUS } from "@/constants/dimensions";

/**
 * 앱 전체에서 재사용 가능한 공통 스타일
 */

// 카드 스타일
export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: CARD_BORDER_RADIUS,
    padding: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  } as ViewStyle,
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  } as TextStyle,
  cardContent: {
    gap: SPACING.sm,
  } as ViewStyle,
});

// 버튼 스타일
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: "#369667",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  primaryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  } as TextStyle,
  secondary: {
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  secondaryText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  } as TextStyle,
  outline: {
    backgroundColor: "transparent",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#369667",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  outlineText: {
    color: "#369667",
    fontSize: 16,
    fontWeight: "600",
  } as TextStyle,
  disabled: {
    opacity: 0.5,
  } as ViewStyle,
  small: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  } as ViewStyle,
  large: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  } as ViewStyle,
});

// 텍스트 스타일
export const textStyles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    lineHeight: 40,
  } as TextStyle,
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    lineHeight: 32,
  } as TextStyle,
  h3: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 28,
  } as TextStyle,
  h4: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    lineHeight: 24,
  } as TextStyle,
  body: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  } as TextStyle,
  bodySmall: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  } as TextStyle,
  caption: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  } as TextStyle,
  link: {
    fontSize: 16,
    color: "#369667",
    textDecorationLine: "underline",
  } as TextStyle,
  error: {
    fontSize: 14,
    color: COLORS.error,
  } as TextStyle,
});

// 레이아웃 스타일
export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  } as ViewStyle,
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  row: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  padding: {
    padding: SPACING.lg,
  } as ViewStyle,
  paddingHorizontal: {
    paddingHorizontal: SPACING.lg,
  } as ViewStyle,
  paddingVertical: {
    paddingVertical: SPACING.lg,
  } as ViewStyle,
  marginBottom: {
    marginBottom: SPACING.lg,
  } as ViewStyle,
});

// 입력 필드 스타일
export const inputStyles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  } as TextStyle,
  input: {
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: "transparent",
  } as TextStyle,
  inputFocused: {
    borderColor: "#369667",
    backgroundColor: COLORS.white,
  } as ViewStyle,
  inputError: {
    borderColor: COLORS.error,
  } as ViewStyle,
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.xs,
  } as TextStyle,
});

// Divider 스타일
export const dividerStyles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  } as ViewStyle,
  dividerThick: {
    height: 8,
    backgroundColor: COLORS.backgroundSecondary,
    marginVertical: SPACING.lg,
  } as ViewStyle,
});

// 배지/태그 스타일
export const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
  } as ViewStyle,
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  } as TextStyle,
  badgePrimary: {
    backgroundColor: "#369667",
  } as ViewStyle,
  badgePrimaryText: {
    color: COLORS.white,
  } as TextStyle,
  badgeSuccess: {
    backgroundColor: COLORS.success,
  } as ViewStyle,
  badgeWarning: {
    backgroundColor: COLORS.warning,
  } as ViewStyle,
  badgeError: {
    backgroundColor: COLORS.error,
  } as ViewStyle,
});
