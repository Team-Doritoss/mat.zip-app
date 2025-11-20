import { KAKAO_KEY } from "@/constants/key";

/**
 * 카카오맵 WebView용 HTML 템플릿을 생성합니다
 * @param kakaoKey 카카오 API 키
 * @returns HTML 문자열
 */
export const generateMapHTML = (): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <title>맛.zip 지도</title>
      <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}"></script>
      <style>
        * { margin: 0; padding: 0; user-select: none; -webkit-user-select: none; -ms-user-select: none; }
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
        let userPosition = null;
        let userHeading = 0;
        let previousHeading = 0;
        let routePolyline = null;
        let routePolylineBorder = null;

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
            navigator.geolocation.watchPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                moveToUserLocation(lat, lng);
              },
              (error) => {
                console.log('위치 정보를 가져올 수 없습니다:', error.message);
              },
              {
                enableHighAccuracy: true,
                maximumAge: 0
              }
            );
          }
        });

        // 사용자 위치 마커 생성 (DOM 기반으로 부드러운 회전)
        function createUserLocationMarker(position) {
          // 기존 사용자 마커 제거
          if (userMarker) {
            userMarker.setMap(null);
          }

          // CustomOverlay로 DOM 요소 사용
          const content = document.createElement('div');
          content.id = 'user-location-marker';
          content.innerHTML = \`
            <div style="position: relative; width: 40px; height: 40px;">
              <!-- 외곽 그림자 -->
              <div style="
                position: absolute;
                width: 26px;
                height: 26px;
                top: 7px;
                left: 7px;
                border-radius: 50%;
                background: #369667;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              "></div>

              <!-- 메인 원 (초록색) -->
              <div style="
                position: absolute;
                width: 26px;
                height: 26px;
                top: 7px;
                left: 7px;
                border-radius: 50%;
                background: #369667;
                border: 3.5px solid #FFFFFF;
                box-sizing: border-box;
              ">
                <div id="direction-arrow" style="
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  transition: transform 0.3s cubic-bezier(0.4, 0, 0.4, 1);
                  transform-origin: center;
                ">
                  <svg width="20" height="20" viewBox="0 0 26 26">
                    <polygon points="13,4 8,20 13,17 18,20" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>
          \`;

          userMarker = new kakao.maps.CustomOverlay({
            position: position,
            content: content,
            yAnchor: 0.5,
            zIndex: 100
          });

          userMarker.setMap(map);
        }

        // 방향만 업데이트 (부드러운 회전)
        function updateUserHeading(heading) {
          const arrow = document.getElementById('direction-arrow');
          if (arrow && heading !== null && heading !== undefined && !isNaN(heading)) {
            // 오프셋 적용
            let targetHeading = heading - 105;

            // 0-360 범위로 정규화
            targetHeading = ((targetHeading % 360) + 360) % 360;
            let currentHeading = ((previousHeading % 360) + 360) % 360;

            // 최단 거리로 회전하도록 각도 차이 계산
            let diff = targetHeading - currentHeading;

            // -180 ~ 180 범위로 조정하여 최단 경로 선택
            if (diff > 180) {
              diff -= 360;
            } else if (diff < -180) {
              diff += 360;
            }

            // 이전 각도에서 최단 거리만큼 회전
            let finalRotation = previousHeading + diff;

            arrow.style.transform = \`rotate(\${finalRotation}deg)\`;
            previousHeading = finalRotation;
          }
        }

        // 사용자 위치로 이동
        function moveToUserLocation(lat, lng) {
          if (!map) return;
          const position = new kakao.maps.LatLng(lat, lng);
          userPosition = position; // 사용자 위치 저장

          // 첫 로딩시에만 지도 이동
          if (!userMarker) {
            // 줌 레벨 설정
            map.setLevel(4);

            // 프로젝션 객체를 사용하여 좌표를 픽셀로 변환
            const projection = map.getProjection();
            const point = projection.pointFromCoords(position);

            // 마커를 화면 중앙보다 위쪽에 위치시키기 위해 y 좌표를 조정 (150픽셀 아래로)
            const adjustedPoint = new kakao.maps.Point(point.x, point.y + 150);

            // 조정된 픽셀 좌표를 다시 지도 좌표로 변환하여 중심점으로 설정
            const adjustedPosition = projection.coordsFromPoint(adjustedPoint);
            map.setCenter(adjustedPosition);

            // 사용자 위치 마커 생성
            createUserLocationMarker(position);
          } else {
            // 마커가 이미 있으면 위치만 업데이트
            userMarker.setPosition(position);
          }
        }

        // 사용자 위치로 복귀
        function returnToUserLocation() {
          if (!map || !userPosition) return;

          map.setLevel(4);

          // 프로젝션 객체를 사용하여 좌표를 픽셀로 변환
          const projection = map.getProjection();
          const point = projection.pointFromCoords(userPosition);

          // 마커를 화면 중앙보다 위쪽에 위치시키기 위해 y 좌표를 조정 (150픽셀 아래로)
          const adjustedPoint = new kakao.maps.Point(point.x, point.y + 150);

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

          // 경로 제거
          if (routePolyline) {
            routePolyline.setMap(null);
            routePolyline = null;
          }
          if (routePolylineBorder) {
            routePolylineBorder.setMap(null);
            routePolylineBorder = null;
          }

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

            // 마커 클릭 이벤트
            kakao.maps.event.addListener(marker, 'click', function() {
              console.log('🖱️ 마커 클릭:', index, restaurant.name);
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'markerClick',
                  index: index
                }));
              }
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

          // 기존 경로 제거
          if (routePolyline) {
            routePolyline.setMap(null);
            routePolyline = null;
          }
          if (routePolylineBorder) {
            routePolylineBorder.setMap(null);
            routePolylineBorder = null;
          }

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

          // 경로가 있으면 그리기 (지도 이동 후에 그려야 제대로 표시됨)
          setTimeout(() => {
            if (restaurant.distance && restaurant.distance.pathCoordinates && restaurant.distance.pathCoordinates.length > 0) {
              console.log('🛣️ 경로 그리기 시작, 좌표 수:', restaurant.distance.pathCoordinates.length);

              const path = restaurant.distance.pathCoordinates.map(coord =>
                new kakao.maps.LatLng(coord.lat, coord.lng)
              );

              // 먼저 하얀색 테두리 그리기 (더 굵게)
              routePolylineBorder = new kakao.maps.Polyline({
                path: path,
                strokeWeight: 12,
                strokeColor: '#FFFFFF',
                strokeOpacity: 1,
                strokeStyle: 'solid',
                zIndex: 2
              });

              // 그 위에 초록색 경로 그리기
              routePolyline = new kakao.maps.Polyline({
                path: path,
                strokeWeight: 8,
                strokeColor: '#369667',
                strokeOpacity: 1,
                strokeStyle: 'solid',
                zIndex: 3
              });

              routePolylineBorder.setMap(map);
              routePolyline.setMap(map);
              console.log('✅ 경로 표시 완료 (테두리 포함)');
            }
          }, 100);
        }
      </script>
    </body>
    </html>
  `;
};
