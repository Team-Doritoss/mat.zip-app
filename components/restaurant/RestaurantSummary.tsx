import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { textStyles } from "@/styles/commonStyles";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/dimensions";

interface RestaurantSummaryProps {
  summary: string;
}

export default function RestaurantSummary({
  summary,
}: RestaurantSummaryProps) {
  if (!summary) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🤖 AI 요약</Text>
      <Text style={styles.summaryText}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: "#F5F9FF",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    ...textStyles.h4,
    marginBottom: SPACING.sm,
  },
  summaryText: {
    ...textStyles.body,
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
});
