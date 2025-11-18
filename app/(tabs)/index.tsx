import React, { useState } from 'react';
import { StyleSheet, View, Linking, PanResponder, Animated, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import KakaoMap from '@/components/KakaoMap';
import ChatInterface from '@/components/ChatInterface';
import BottomSheet from '@/components/BottomSheet';
import { Restaurant } from '@/types/restaurant';

const { height } = Dimensions.get('window');
const MIN_CHAT_HEIGHT = height * 0.3; // 최소 30%
const MAX_CHAT_HEIGHT = height * 0.85; // 최대 85%
const DEFAULT_CHAT_HEIGHT = height * 0.6; // 기본 60%

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showChat, setShowChat] = useState(true);
  const [chatHeight] = useState(new Animated.Value(DEFAULT_CHAT_HEIGHT));
  const [currentChatHeight, setCurrentChatHeight] = useState(DEFAULT_CHAT_HEIGHT);

  // AI가 맛집을 찾았을 때
  const handleRestaurantsFound = (foundRestaurants: Restaurant[]) => {
    setRestaurants(foundRestaurants);
    setCurrentIndex(0);
    setShowChat(false); // 채팅 닫고 바텀시트 표시
  };

  // 이전/다음 버튼으로 인덱스 변경
  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  // 채팅 드래그 핸들러
  const chatPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newHeight = currentChatHeight - gestureState.dy;
      if (newHeight >= MIN_CHAT_HEIGHT && newHeight <= MAX_CHAT_HEIGHT) {
        chatHeight.setValue(newHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
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

  // 길찾기 버튼 - 카카오맵 앱 실행
  const handleNavigate = async (restaurant: Restaurant) => {
    try {
      // 현재 위치 가져오기
      const { status } = await Location.getForegroundPermissionsAsync();
      let userLat = 37.5172; // 기본값: 강남역
      let userLng = 127.0473;

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        userLat = location.coords.latitude;
        userLng = location.coords.longitude;
      }

      // 카카오맵 URL 스킴
      const kakaoMapUrl = `kakaomap://route?sp=${userLat},${userLng}&ep=${restaurant.latitude},${restaurant.longitude}&by=CAR`;
      const kakaoWebUrl = `https://map.kakao.com/link/to/${encodeURIComponent(restaurant.name)},${restaurant.latitude},${restaurant.longitude}`;

      const supported = await Linking.canOpenURL(kakaoMapUrl);
      if (supported) {
        await Linking.openURL(kakaoMapUrl); // 카카오맵 앱으로 길찾기
      } else {
        await Linking.openURL(kakaoWebUrl); // 웹 버전으로 대체
      }
    } catch (error) {
      console.error('길찾기 실행 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 지도 - 전체 화면 */}
      <KakaoMap
        restaurants={restaurants}
        focusedRestaurant={restaurants[currentIndex]}
      />

      {/* AI 채팅 인터페이스 (맛집 추천 전) */}
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

      {/* 바텀시트 (맛집 추천 후) */}
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
