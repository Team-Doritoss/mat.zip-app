import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Restaurant } from '@/types/restaurant';
import { KAKAO_KEY } from '@/constants/key';

interface KakaoMapProps {
  restaurants?: Restaurant[];
  focusedRestaurant?: Restaurant | null;
}

export default function KakaoMap({ restaurants = [], focusedRestaurant = null }: KakaoMapProps) {
  const webViewRef = useRef<WebView>(null);

  const handleWebViewLoad = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript(`
            if (typeof moveToUserLocation === 'function') {
              moveToUserLocation(${location.coords.latitude}, ${location.coords.longitude});
            }
            true;
          `);
        }
      }
    } catch (error) {
      console.log('Using HTML Geolocation API for web');
    }
  };

  useEffect(() => {
    console.log('🗺️ KakaoMap - restaurants 변경됨:', restaurants.length);
    if (webViewRef.current) {
      if (restaurants.length > 0) {
        console.log('📍 마커 표시 시작:', restaurants.map(r => r.name));
        const markersData = JSON.stringify(restaurants);
        webViewRef.current.injectJavaScript(`
          console.log('WebView - showRestaurants 호출됨');
          showRestaurants(${markersData});
          true;
        `);
      } else {
        console.log('🧹 마커 제거');
        webViewRef.current.injectJavaScript(`
          clearRestaurants();
          true;
        `);
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
  }, [focusedRestaurant]);


  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <title>맛.zip 지도</title>
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}"></script>
      <style>
        * { margin: 0; padding: 0; }
        html, body { width: 100%; height: 100%; }
        #map { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>

      <script>
        let map;
        let markers = [];
        let overlays = [];
        let userMarker = null;
        let userPosition = null; // 사용자 위치 저장

        // 지도 초기화 및 사용자 위치 가져오기
        window.addEventListener('load', () => {
          const container = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(37.5172, 127.0473),
            level: 4
          };
          map = new kakao.maps.Map(container, options);

          // 웹에서 자동으로 사용자 위치 가져오기
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                moveToUserLocation(lat, lng);
              },
              (error) => {
                console.log('위치 정보를 가져올 수 없습니다:', error.message);
              }
            );
          }
        });

        // 사용자 위치로 이동
        function moveToUserLocation(lat, lng) {
          if (!map) return;
          const position = new kakao.maps.LatLng(lat, lng);
          userPosition = position; // 사용자 위치 저장

          // 줌 레벨 설정
          map.setLevel(4);

          // 프로젝션 객체를 사용하여 좌표를 픽셀로 변환
          const projection = map.getProjection();
          const point = projection.pointFromCoords(position);

          // 마커를 화면 중앙보다 위쪽에 위치시키기 위해 y 좌표를 조정 (200픽셀 아래로)
          const adjustedPoint = new kakao.maps.Point(point.x, point.y + 200);

          // 조정된 픽셀 좌표를 다시 지도 좌표로 변환하여 중심점으로 설정
          const adjustedPosition = projection.coordsFromPoint(adjustedPoint);
          map.setCenter(adjustedPosition);

          // 기존 사용자 마커 제거
          if (userMarker) {
            userMarker.setMap(null);
          }

          // 사용자 위치 마커
          userMarker = new kakao.maps.Marker({
            position: position,
            map: map,
            image: new kakao.maps.MarkerImage(
              'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
              new kakao.maps.Size(24, 35)
            ),
            title: '내 위치'
          });
        }

        // 사용자 위치로 복귀
        function returnToUserLocation() {
          if (!map || !userPosition) return;

          map.setLevel(4);

          // 프로젝션 객체를 사용하여 좌표를 픽셀로 변환
          const projection = map.getProjection();
          const point = projection.pointFromCoords(userPosition);

          // 마커를 화면 중앙보다 위쪽에 위치시키기 위해 y 좌표를 조정 (200픽셀 아래로)
          const adjustedPoint = new kakao.maps.Point(point.x, point.y + 200);

          // 조정된 픽셀 좌표를 다시 지도 좌표로 변환하여 중심점으로 설정
          const adjustedPosition = projection.coordsFromPoint(adjustedPoint);
          map.setCenter(adjustedPosition);
        }

        // 레스토랑 마커 제거
        function clearRestaurants() {
          if (!map) return;

          // 기존 마커/오버레이 제거
          markers.forEach(m => m.setMap(null));
          overlays.forEach(o => o.setMap(null));
          markers = [];
          overlays = [];

          // 사용자 위치로 복귀
          returnToUserLocation();
        }

        // 레스토랑 마커 표시
        function showRestaurants(restaurants) {
          console.log('🍽️ showRestaurants 함수 호출됨, 식당 수:', restaurants.length);
          if (!map) {
            console.error('❌ 지도 객체가 없습니다!');
            return;
          }

          // 기존 마커/오버레이 제거
          markers.forEach(m => m.setMap(null));
          overlays.forEach(o => o.setMap(null));
          markers = [];
          overlays = [];

          const bounds = new kakao.maps.LatLngBounds();

          restaurants.forEach((restaurant, index) => {
            console.log('📍 마커 생성:', index + 1, restaurant.name, restaurant.latitude, restaurant.longitude);
            const position = new kakao.maps.LatLng(restaurant.latitude, restaurant.longitude);
            bounds.extend(position);

            // 마커 생성
            const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
            const imageSize = new kakao.maps.Size(36, 37);
            const imgOptions = {
              spriteSize: new kakao.maps.Size(36, 691),
              spriteOrigin: new kakao.maps.Point(0, (index * 46) + 10),
              offset: new kakao.maps.Point(13, 37)
            };

            const marker = new kakao.maps.Marker({
              position: position,
              map: map,
              image: new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions)
            });

            markers.push(marker);
            console.log('✅ 마커 추가 완료:', index + 1);
          });

          console.log('🗺️ 총 마커 개수:', markers.length);
          // 모든 마커가 보이도록 지도 범위 조정
          map.setBounds(bounds);
          console.log('🎯 지도 범위 조정 완료');
        }

        // 특정 레스토랑으로 포커스
        function focusRestaurant(restaurant) {
          if (!map) return;

          const position = new kakao.maps.LatLng(restaurant.latitude, restaurant.longitude);

          // 줌 레벨을 먼저 설정
          map.setLevel(3);

          // 프로젝션 객체를 사용하여 좌표를 픽셀로 변환
          const projection = map.getProjection();
          const point = projection.pointFromCoords(position);

          // 마커를 화면 중앙보다 위쪽에 위치시키기 위해 y 좌표를 조정 (100픽셀 아래로)
          const adjustedPoint = new kakao.maps.Point(point.x, point.y + 100);

          // 조정된 픽셀 좌표를 다시 지도 좌표로 변환하여 중심점으로 설정
          const adjustedPosition = projection.coordsFromPoint(adjustedPoint);
          map.setCenter(adjustedPosition);
        }
      </script>
    </body>
    </html>
  `;

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
