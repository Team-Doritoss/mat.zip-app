import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { textStyles } from "@/styles/commonStyles";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/dimensions";

interface RestaurantFeaturesListProps {
  features: string[];
}

export default function RestaurantFeaturesList({
  features,
}: RestaurantFeaturesListProps) {
  if (!features || features.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>매장 특징</Text>
      <View style={styles.tagsContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{feature}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    ...textStyles.h4,
    marginBottom: SPACING.md,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tagText: {
    fontSize: 14,
    color: "#2E7D32",
  },
});
