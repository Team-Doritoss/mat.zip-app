import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Restaurant } from "@/types/restaurant";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/dimensions";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

export default function RestaurantHeader({
  restaurant,
}: RestaurantHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
        </View>
      </View>
      <Text style={styles.category}>{restaurant.category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  name: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  ratingContainer: {
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  category: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
