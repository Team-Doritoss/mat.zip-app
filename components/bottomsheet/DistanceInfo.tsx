import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Restaurant } from "@/types/restaurant";
import { bottomSheetStyles as styles } from "@/styles/BottomSheetStyles";
import { formatDistance, formatTime } from "@/utils/formatters";

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
      <Text style={styles.distanceValue}>
        {formatDistance(meters)}
        {carTime && ` • 차량 ${formatTime(carTime)}`}
      </Text>
    </View>
  );
}
