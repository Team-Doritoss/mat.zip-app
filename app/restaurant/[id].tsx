import { mockRestaurants } from "@/data/mockRestaurants";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import RestaurantImageSlider from "@/components/restaurant/RestaurantImageSlider";
import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import RestaurantDetails from "@/components/restaurant/RestaurantDetails";
import RestaurantFeaturesList from "@/components/restaurant/RestaurantFeaturesList";
import RestaurantSummary from "@/components/restaurant/RestaurantSummary";
import AIQuestionSection from "@/components/restaurant/AIQuestionSection";
import RestaurantActions from "@/components/restaurant/RestaurantActions";
import { layoutStyles } from "@/styles/commonStyles";

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const restaurant = mockRestaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <View style={layoutStyles.centered}>
        <Text>맛집을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <RestaurantImageSlider images={restaurant.images} />
        <RestaurantHeader restaurant={restaurant} />
        <RestaurantDetails restaurant={restaurant} />
        <RestaurantFeaturesList features={restaurant.features} />
        <RestaurantSummary summary={restaurant.summary} />
        <AIQuestionSection restaurant={restaurant} />
      </ScrollView>

      <RestaurantActions restaurant={restaurant} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
});
