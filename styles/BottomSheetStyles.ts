import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/dimensions";

export const bottomSheetStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragHandle: {
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  dragBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray300,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  paginationText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  restaurantCategory: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  infoIcon: {
    width: 24,
    marginRight: SPACING.sm,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  infoTextClickable: {
    color: "#369667",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  featureTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.text,
  },
  distanceCard: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: 12,
  },
  distanceTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  distanceValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#369667",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#369667",
    paddingVertical: SPACING.xl,
    borderRadius: 2000,
    gap: SPACING.sm,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  loadingContainer: {
    padding: SPACING.lg,
    alignItems: "center",
  },
  loadingText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  divider: {
    marginVertical: SPACING.lg,
  }
});
