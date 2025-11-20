import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { Restaurant } from '@/types/restaurant';
import { generateMapHTML } from '@/utils/mapHTML';

interface KakaoMapProps {
  restaurants?: Restaurant[];
  focusedRestaurant?: Restaurant | null;
  onMarkerClick?: (index: number) => void;
}

export default function KakaoMap({ restaurants = [], focusedRestaurant = null, onMarkerClick }: KakaoMapProps) {
  const webViewRef = useRef<WebView>(null);
  const [currentHeading, setCurrentHeading] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    Magnetometer.setUpdateInterval(100);

    const subscription = Magnetometer.addListener((data) => {
      // 자기장 데이터를 각도로 변환
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      // 0-360 범위로 정규화
      angle = angle < 0 ? angle + 360 : angle;

      setCurrentHeading(angle);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (currentLocation && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (typeof moveToUserLocation === 'function') {
          moveToUserLocation(${currentLocation.lat}, ${currentLocation.lng});
        }
        true;
      `);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (currentHeading !== null && webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (typeof updateUserHeading === 'function') {
          updateUserHeading(${currentHeading});
        }
        true;
      `);
    }
  }, [currentHeading]);

  const handleWebViewLoad = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            setCurrentLocation({
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            });
          }
        );
      }
    } catch (error) {
      console.log('Using HTML Geolocation API for web');
    }
  };

  const restaurantsLengthRef = useRef(0);

  useEffect(() => {
    console.log('🗺️ KakaoMap - restaurants 변경됨:', restaurants.length);
    if (webViewRef.current) {
      const isNewRestaurantList = restaurants.length !== restaurantsLengthRef.current;

      if (restaurants.length > 0 && isNewRestaurantList) {
        console.log('📍 마커 표시 시작:', restaurants.map(r => r.name));
        restaurantsLengthRef.current = restaurants.length;
        const markersData = JSON.stringify(restaurants);
        webViewRef.current.injectJavaScript(`
          console.log('WebView - showRestaurants 호출됨');
          showRestaurants(${markersData});
          true;
        `);
      } else if (restaurants.length === 0) {
        console.log('🧹 마커 제거');
        restaurantsLengthRef.current = 0;
        webViewRef.current.injectJavaScript(`
          clearRestaurants();
          true;
        `);
      } else {
        console.log('⏭️ 거리 정보만 업데이트 - 마커 유지');
      }
    }
  }, [restaurants]);

  useEffect(() => {
    if (webViewRef.current && focusedRestaurant) {
      const restaurantData = JSON.stringify(focusedRestaurant);
      webViewRef.current.injectJavaScript(`
        focusRestaurant(${restaurantData});
        true;
      `);
    }
  }, [focusedRestaurant, focusedRestaurant?.distance]);

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerClick' && onMarkerClick) {
        onMarkerClick(data.index);
      }
    } catch (error) {
      console.log('WebView message error:', error);
    }
  };


  const htmlContent = generateMapHTML();

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        onLoad={handleWebViewLoad}
        onMessage={handleWebViewMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
