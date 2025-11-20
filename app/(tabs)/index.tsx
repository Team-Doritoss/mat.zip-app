import React, { useState, useEffect } from "react";
import { StyleSheet, View, Keyboard, Animated, PanResponder } from "react-native";
import KakaoMap from "@/components/KakaoMap";
import ChatInterface from "@/components/ChatInterface";
import BottomSheet from "@/components/BottomSheet";
import { Restaurant } from "@/types/restaurant";
import { useHeaderStore } from "@/stores/useHeaderStore";
import { useRestaurantSearch } from "@/hooks/useRestaurantSearch";
import { navigateToRestaurant } from "@/services/navigationService";
import { SCREEN_HEIGHT } from "@/constants/dimensions";
import { COLORS } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MIN_CHAT_HEIGHT = SCREEN_HEIGHT * 0.3;
const MAX_CHAT_HEIGHT = SCREEN_HEIGHT * 0.9;
const DEFAULT_CHAT_HEIGHT = SCREEN_HEIGHT * 0.6;

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [chatHeight] = useState(new Animated.Value(DEFAULT_CHAT_HEIGHT));
  const [currentChatHeight, setCurrentChatHeight] = useState(DEFAULT_CHAT_HEIGHT);
  const [heightBeforeKeyboard, setHeightBeforeKeyboard] = useState(DEFAULT_CHAT_HEIGHT);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const paddingBottom = useSafeAreaInsets().bottom;

  const setSheetHeight = useHeaderStore((state) => state.setSheetHeight);
  const { restaurants, setRestaurants, loadRouteInfo } = useRestaurantSearch();

  useEffect(() => {
    setSheetHeight(DEFAULT_CHAT_HEIGHT);
  }, [setSheetHeight]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", () => {
      setIsKeyboardVisible(true);
      setHeightBeforeKeyboard(currentChatHeight);
      setCurrentChatHeight(MAX_CHAT_HEIGHT);
      setSheetHeight(MAX_CHAT_HEIGHT);
      Animated.spring(chatHeight, {
        toValue: MAX_CHAT_HEIGHT,
        useNativeDriver: false,
        damping: 20,
        stiffness: 150,
      }).start();
    });

    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [currentChatHeight, chatHeight, setSheetHeight]);

  const chatPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isKeyboardVisible,
    onMoveShouldSetPanResponder: () => !isKeyboardVisible,
    onPanResponderMove: (_, gestureState) => {
      if (isKeyboardVisible) return;

      const newHeight = currentChatHeight - gestureState.dy;
      if (newHeight >= MIN_CHAT_HEIGHT && newHeight <= MAX_CHAT_HEIGHT) {
        chatHeight.setValue(newHeight);
        setSheetHeight(newHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (isKeyboardVisible) return;

      let newHeight = currentChatHeight - gestureState.dy;

      // 스냅 포인트
      if (newHeight < MIN_CHAT_HEIGHT + 50) {
        newHeight = MIN_CHAT_HEIGHT;
      } else if (newHeight < DEFAULT_CHAT_HEIGHT - 50) {
        newHeight = MIN_CHAT_HEIGHT;
      } else if (newHeight < DEFAULT_CHAT_HEIGHT + 50) {
        newHeight = DEFAULT_CHAT_HEIGHT;
      } else {
        newHeight = MAX_CHAT_HEIGHT;
      }

      setCurrentChatHeight(newHeight);
      setSheetHeight(newHeight);
      Animated.spring(chatHeight, {
        toValue: newHeight,
        useNativeDriver: false,
        damping: 20,
        stiffness: 150,
      }).start();
    },
  });

  const handleRestaurantsFound = async (foundRestaurants: Restaurant[]) => {
    console.log("🎯 식당 검색 완료:", foundRestaurants.length);

    setRestaurants(foundRestaurants);
    setCurrentIndex(0);
    setShowChat(false);

    Keyboard.dismiss();
    setTimeout(() => {
      setCurrentChatHeight(heightBeforeKeyboard);
      Animated.spring(chatHeight, {
        toValue: heightBeforeKeyboard,
        useNativeDriver: false,
        damping: 20,
        stiffness: 150,
      }).start();
    }, 300);

    await loadRouteInfo(foundRestaurants);
  };

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  const handleNavigate = async (restaurant: Restaurant) => {
    await navigateToRestaurant(restaurant);
  };

  const handleClose = () => {
    setRestaurants([]);
    setShowChat(true);
    setSheetHeight(DEFAULT_CHAT_HEIGHT);
  };

  return (
    <View style={[styles.container, { paddingBottom }]}>
      <KakaoMap
        restaurants={restaurants}
        focusedRestaurant={restaurants[currentIndex]}
        onMarkerClick={handleIndexChange}
      />

      {showChat && restaurants.length === 0 && (
        <Animated.View style={[styles.chatOverlay, { height: chatHeight }]}>
          <View style={styles.chatHandle} {...chatPanResponder.panHandlers}>
            <View style={styles.handle} />
          </View>
          <View style={styles.chatContent}>
            <ChatInterface
              onRestaurantsFound={handleRestaurantsFound}
            />
          </View>
        </Animated.View>
      )}

      {restaurants.length > 0 && (
        <BottomSheet
          restaurants={restaurants}
          currentIndex={currentIndex}
          onPrevious={() => handleIndexChange(currentIndex - 1)}
          onNext={() => handleIndexChange(currentIndex + 1)}
          onNavigate={handleNavigate}
          onClose={handleClose}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  chatOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  chatHandle: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 48,
    height: 5,
    backgroundColor: COLORS.gray300,
    borderRadius: 3,
  },
  chatContent: {
    flex: 1,
  },
});
