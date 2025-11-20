import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { bottomSheetStyles as styles } from "@/styles/BottomSheetStyles";

interface RestaurantFeaturesProps {
  features: string[];
}

const getFeatureIcon = (feature: string): string => {
  if (feature.includes("주차")) return "navigation";
  if (feature.includes("예약")) return "calendar";
  if (feature.includes("애견")) return "heart";
  if (feature.includes("24시간")) return "clock";
  if (feature.includes("배달")) return "truck";
  if (feature.includes("포장")) return "shopping-bag";
  if (feature.includes("단체")) return "users";
  if (feature.includes("야외")) return "sun";
  return "check-circle";
};

export default function RestaurantFeatures({
  features,
}: RestaurantFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <View>
      <Text style={styles.sectionTitle}>편의시설</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureTag}>
            <Feather
              name={getFeatureIcon(feature) as any}
              size={16}
              color="#369667"
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
