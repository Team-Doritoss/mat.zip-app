import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Linking, PanResponder, Animated, Dimensions, Keyboard, Platform } from 'react-native';
import * as Location from 'expo-location';
import KakaoMap from '@/components/KakaoMap';
import ChatInterface from '@/components/ChatInterface';
import BottomSheet from '@/components/BottomSheet';
import { Restaurant } from '@/types/restaurant';
import { KAKAO_REST_API_KEY } from '@/constants/key';

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

  const getRouteInfo = async (
    userLat: number,
    userLng: number,
    destLat: number,
    destLng: number
  ) => {
    try {
      const carResponse = await fetch(
        `https://apis-navi.kakaomobility.com/v1/waypoints/directions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `KakaoAK ${KAKAO_REST_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin: { x: userLng, y: userLat },
            destination: { x: destLng, y: destLat },
            priority: 'RECOMMEND',
            car_fuel: 'GASOLINE',
            car_hipass: false,
            alternatives: false,
            road_details: false
          })
        }
      );

      let meters = 0;

      if (carResponse.ok) {
        const carData = await carResponse.json();
        if (carData.routes && carData.routes.length > 0) {
          const route = carData.routes[0];
          meters = route.summary.distance;
          console.log('📍 거리:', meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`);
        }
      } else {
        const errorText = await carResponse.text();
        console.log('카카오 자동차 API 에러:', carResponse.status, errorText);
      }

      return {
        meters,
      };
    } catch (error) {
      console.log('카카오 길찾기 API 호출 실패:', error);
      return {
        meters: 0,
      };
    }
  };

  const handleRestaurantsFound = async (foundRestaurants: Restaurant[]) => {
    console.log('🎯 handleRestaurantsFound 호출됨, 식당 수:', foundRestaurants.length);

    setRestaurants(foundRestaurants);
    setCurrentIndex(0);
    setShowChat(false);
    console.log('✅ 바텀시트 및 마커 표시');

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

    // 거리/시간 정보는 백그라운드에서 지연 로딩
    let userLat = 37.5172;
    let userLng = 127.0473;

    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        userLat = location.coords.latitude;
        userLng = location.coords.longitude;
        console.log('📍 사용자 위치:', userLat, userLng);
      }
    } catch (error) {
      console.log('위치 정보 가져오기 실패:', error);
    }

    console.log('🔄 거리/시간 정보 로딩 시작...');
    const restaurantsWithDistance = await Promise.all(
      foundRestaurants.map(async (restaurant) => {
        const routeInfo = await getRouteInfo(
          userLat,
          userLng,
          restaurant.latitude,
          restaurant.longitude
        );

        return {
          ...restaurant,
          distance: routeInfo,
        };
      })
    );

    console.log('🍽️ 거리 정보 추가 완료:', restaurantsWithDistance.length);
    setRestaurants(restaurantsWithDistance);
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

      // 카카오맵 앱 스킴
      const kakaoMapUrl = `kakaomap://route?sp=${userLat},${userLng}&ep=${restaurant.latitude},${restaurant.longitude}&by=CAR`;
      // 카카오맵 웹 URL - 출발지와 목적지 모두 지정
      const kakaoWebUrl = `https://map.kakao.com/link/from/내위치,${userLat},${userLng}/to/${encodeURIComponent(restaurant.name)},${restaurant.latitude},${restaurant.longitude}`;

      try {
        // 앱 스킴 우선 시도
        await Linking.openURL(kakaoMapUrl);
        console.log('카카오맵 앱으로 열기 성공');
      } catch (appError) {
        // 앱이 없거나 실패하면 웹 URL로 fallback
        console.log('카카오맵 앱 열기 실패, 웹으로 fallback:', appError);
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
