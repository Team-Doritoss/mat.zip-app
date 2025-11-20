import React from "react";
import { ScrollView, Image, StyleSheet, Dimensions } from "react-native";

interface RestaurantImageSliderProps {
  images: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function RestaurantImageSlider({
  images,
}: RestaurantImageSliderProps) {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.slider}
    >
      {images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  slider: {
    height: 300,
  },
  image: {
    width: SCREEN_WIDTH,
    height: 300,
  },
});
