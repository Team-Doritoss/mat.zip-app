import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Restaurant } from "@/types/restaurant";
import { bottomSheetStyles as styles } from "@/styles/BottomSheetStyles";
import { formatDistance, formatTime } from "@/utils/formatters";
import { Feather } from "@expo/vector-icons";

interface DistanceInfoProps {
  restaurant: Restaurant;
}

export default function DistanceInfo({ restaurant }: DistanceInfoProps) {
  if (!restaurant.distance) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#369667" />
        <Text style={styles.loadingText}>거리 정보 로딩 중...</Text>
      </View>
    );
  }

  const { meters, carTime } = restaurant.distance;

  return (
    <View style={styles.distanceCard}>
      <Text style={styles.distanceTitle}>현재 위치에서</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Text style={styles.distanceValue}>{formatDistance(meters)}</Text>
        {carTime && (
          <>
            <Text style={styles.distanceValue}> • </Text>
            <Feather name="navigation" size={20} color="#369667" />
            <Text style={styles.distanceValue}> {formatTime(carTime)}</Text>
          </>
        )}
      </View>
    </View>
  );
}
