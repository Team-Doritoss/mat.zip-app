import React, { useState, useEffect } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Restaurant } from "@/types/restaurant";
import { useHeaderStore } from "@/stores/useHeaderStore";
import { useBottomSheetDrag } from "@/hooks/useBottomSheetDrag";
import { navigateToRestaurant } from "@/services/navigationService";
import RestaurantInfo from "@/components/bottomsheet/RestaurantInfo";
import RestaurantFeatures from "@/components/bottomsheet/RestaurantFeatures";
import DistanceInfo from "@/components/bottomsheet/DistanceInfo";
import { bottomSheetStyles as styles } from "@/styles/BottomSheetStyles";
import {
  BOTTOM_SHEET_MIN_HEIGHT,
  BOTTOM_SHEET_MAX_HEIGHT,
  BOTTOM_SHEET_DEFAULT_HEIGHT,
  SCREEN_HEIGHT,
} from "@/constants/dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetProps {
  restaurants: Restaurant[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onNavigate: (restaurant: Restaurant) => void;
  onClose: () => void;
  onHeightChange?: (height: number) => void;
}

export default function BottomSheet({
  restaurants,
  currentIndex,
  onPrevious,
  onNext,
  onClose,
  onHeightChange,
}: BottomSheetProps) {
  const updateHeaderSheetHeight = useHeaderStore(
    (state) => state.setSheetHeight
  );

  const { panResponder, animatedHeight } = useBottomSheetDrag(
    {
      minHeight: BOTTOM_SHEET_MIN_HEIGHT,
      maxHeight: BOTTOM_SHEET_MAX_HEIGHT,
      defaultHeight: BOTTOM_SHEET_DEFAULT_HEIGHT,
      snapPoints: [
        BOTTOM_SHEET_MIN_HEIGHT,
        BOTTOM_SHEET_DEFAULT_HEIGHT,
        BOTTOM_SHEET_MAX_HEIGHT,
      ],
    },
    (height) => {
      updateHeaderSheetHeight(height);
      onHeightChange?.(height);
    }
  );

  const restaurant = restaurants[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === restaurants.length - 1;

  useEffect(() => {
    updateHeaderSheetHeight(BOTTOM_SHEET_DEFAULT_HEIGHT);
    return () => {
      updateHeaderSheetHeight(0);
    };
  }, [updateHeaderSheetHeight]);

  const handleNavigate = async () => {
    await navigateToRestaurant(restaurant);
  };

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      <View style={styles.dragHandle} {...panResponder.panHandlers}>
        <View style={styles.dragBar} />
      </View>

      <View style={styles.header}>
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.navButton, isFirst && styles.navButtonDisabled]}
            onPress={onPrevious}
            disabled={isFirst}
          >
            <Feather
              name="chevron-left"
              size={18}
              color={isFirst ? "#999" : "#369667"}
            />
          </TouchableOpacity>

          <Text style={styles.paginationText}>
            {currentIndex + 1} / {restaurants.length}
          </Text>

          <TouchableOpacity
            style={[styles.navButton, isLast && styles.navButtonDisabled]}
            onPress={onNext}
            disabled={isLast}
          >
            <Feather
              name="chevron-right"
              size={18}
              color={isLast ? "#999" : "#369667"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <RestaurantInfo restaurant={restaurant} />

        <View style={styles.divider} />

        <DistanceInfo restaurant={restaurant} />

        {restaurant.features && restaurant.features.length > 0 && (
          <>
            <View style={styles.divider} />
            <RestaurantFeatures features={restaurant.features} />
          </>
        )}

        {restaurant.summary && (
          <>
            <View style={styles.divider} />
            <View>
              <Text style={styles.sectionTitle}>AI 요약</Text>
              <Text style={styles.summaryText}>{restaurant.summary}</Text>
            </View>
          </>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.actionButton} onPress={handleNavigate}>
        <Feather name="navigation" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>길찾기</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
