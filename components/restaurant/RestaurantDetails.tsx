import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Restaurant } from "@/types/restaurant";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/dimensions";
import { formatPhoneNumber } from "@/utils/formatters";
import { makePhoneCall } from "@/services/navigationService";

interface RestaurantDetailsProps {
  restaurant: Restaurant;
}

export default function RestaurantDetails({
  restaurant,
}: RestaurantDetailsProps) {
  const handlePhonePress = () => {
    makePhoneCall(restaurant.phone);
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailRow}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.detailText}>{restaurant.address}</Text>
      </View>

      <TouchableOpacity style={styles.detailRow} onPress={handlePhonePress}>
        <Text style={styles.icon}>📞</Text>
        <Text style={[styles.detailText, styles.clickable]}>
          {formatPhoneNumber(restaurant.phone)}
        </Text>
      </TouchableOpacity>

      <View style={styles.detailRow}>
        <Text style={styles.icon}>🕐</Text>
        <Text style={styles.detailText}>{restaurant.hours}</Text>
      </View>

      {restaurant.priceRange && (
        <View style={styles.detailRow}>
          <Text style={styles.icon}>💰</Text>
          <Text style={styles.detailText}>{restaurant.priceRange}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 20,
    marginRight: SPACING.md,
    width: 24,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  clickable: {
    color: "#369667",
    textDecorationLine: "underline",
  },
});
