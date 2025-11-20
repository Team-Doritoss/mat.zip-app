import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Restaurant } from "@/types/restaurant";
import { bottomSheetStyles as styles } from "@/styles/BottomSheetStyles";
import { formatPhoneNumber } from "@/utils/formatters";

interface RestaurantInfoProps {
  restaurant: Restaurant;
}

export default function RestaurantInfo({ restaurant }: RestaurantInfoProps) {
  const handlePhonePress = () => {
    Linking.openURL(`tel:${restaurant.phone}`);
  };

  return (
    <View>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Text style={styles.restaurantCategory}>{restaurant.category}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons name="star" size={20} color="#FFD700" />
        </View>
        <Text style={styles.infoText}>
          {restaurant.rating} ({restaurant.reviewCount}개 리뷰)
        </Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Feather name="map-pin" size={20} color="#369667" />
        </View>
        <Text style={styles.infoText}>{restaurant.address}</Text>
      </View>

      <TouchableOpacity style={styles.infoRow} onPress={handlePhonePress}>
        <View style={styles.infoIcon}>
          <Feather name="phone" size={20} color="#369667" />
        </View>
        <Text style={[styles.infoText, styles.infoTextClickable]}>
          {formatPhoneNumber(restaurant.phone)}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Feather name="clock" size={20} color="#369667" />
        </View>
        <Text style={styles.infoText}>{restaurant.hours}</Text>
      </View>
    </View>
  );
}
