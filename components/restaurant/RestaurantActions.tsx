import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Restaurant } from "@/types/restaurant";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/dimensions";
import {
  navigateToRestaurant,
  makePhoneCall,
  shareRestaurant,
} from "@/services/navigationService";

interface RestaurantActionsProps {
  restaurant: Restaurant;
}

export default function RestaurantActions({
  restaurant,
}: RestaurantActionsProps) {
  const handleNavigation = async () => {
    await navigateToRestaurant(restaurant);
  };

  const handleCall = async () => {
    await makePhoneCall(restaurant.phone);
  };

  const handleShare = async () => {
    await shareRestaurant(restaurant);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
        <Text style={styles.secondaryButtonText}>공유하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleCall}>
        <Text style={styles.secondaryButtonText}>전화하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={handleNavigation}>
        <Text style={styles.primaryButtonText}>길찾기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: SPACING.lg,
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: "#369667",
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },
});
