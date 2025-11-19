import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Linking, PanResponder, Animated, Dimensions, Keyboard, Platform } from 'react-native';
import * as Location from 'expo-location';
import KakaoMap from '@/components/KakaoMap';
import ChatInterface from '@/components/ChatInterface';
import BottomSheet from '@/components/BottomSheet';
import { Restaurant } from '@/types/restaurant';

const { height } = Dimensions.get('window');
const MIN_CHAT_HEIGHT = height * 0.3;
const MAX_CHAT_HEIGHT = height * 0.9;
const DEFAULT_CHAT_HEIGHT = height * 0.6;

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [chatHeight] = useState(new Animated.Value(DEFAULT_CHAT_HEIGHT));
  const [currentChatHeight, setCurrentChatHeight] = useState(DEFAULT_CHAT_HEIGHT);
  const [heightBeforeKeyboard, setHeightBeforeKeyboard] = useState(DEFAULT_CHAT_HEIGHT);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setIsKeyboardVisible(true);
        setHeightBeforeKeyboard(currentChatHeight);
        setCurrentChatHeight(MAX_CHAT_HEIGHT);
        Animated.spring(chatHeight, {
          toValue: MAX_CHAT_HEIGHT,
          useNativeDriver: false,
          damping: 20,
          stiffness: 150,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [currentChatHeight, chatHeight]);

  const handleRestaurantsFound = (foundRestaurants: Restaurant[]) => {
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
  };

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  const chatPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isKeyboardVisible,
    onMoveShouldSetPanResponder: () => !isKeyboardVisible,
    onPanResponderMove: (_, gestureState) => {
      if (isKeyboardVisible) return;

      const newHeight = currentChatHeight - gestureState.dy;
      if (newHeight >= MIN_CHAT_HEIGHT && newHeight <= MAX_CHAT_HEIGHT) {
        chatHeight.setValue(newHeight);
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
      Animated.spring(chatHeight, {
        toValue: newHeight,
        useNativeDriver: false,
        damping: 20,
        stiffness: 150,
      }).start();
    },
  });

  const handleNavigate = async (restaurant: Restaurant) => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      let userLat = 37.5172;
      let userLng = 127.0473;

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        userLat = location.coords.latitude;
        userLng = location.coords.longitude;
      }

      const kakaoMapUrl = `kakaomap://route?sp=${userLat},${userLng}&ep=${restaurant.latitude},${restaurant.longitude}&by=CAR`;
      const kakaoWebUrl = `https://map.kakao.com/link/to/${encodeURIComponent(restaurant.name)},${restaurant.latitude},${restaurant.longitude}`;

      const supported = await Linking.canOpenURL(kakaoMapUrl);
      if (supported) {
        await Linking.openURL(kakaoMapUrl);
      } else {
        await Linking.openURL(kakaoWebUrl);
      }
    } catch (error) {
      console.error('길찾기 실행 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <KakaoMap
        restaurants={restaurants}
        focusedRestaurant={restaurants[currentIndex]}
      />

      {showChat && restaurants.length === 0 && (
        <Animated.View style={[styles.chatOverlay, { height: chatHeight }]}>
          <View style={styles.chatHandle} {...chatPanResponder.panHandlers}>
            <View style={styles.handle} />
          </View>
          <View style={styles.chatContent}>
            <ChatInterface onRestaurantsFound={handleRestaurantsFound} />
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
          onClose={() => {
            setRestaurants([]);
            setShowChat(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  chatHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 48,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
  },
  chatContent: {
    flex: 1,
  },
});
