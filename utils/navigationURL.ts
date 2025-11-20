import { Restaurant } from "@/types/restaurant";

/**
 * 카카오맵 앱 URL 생성 (길찾기용)
 * @param restaurant 식당 정보
 * @returns 카카오맵 앱 딥링크 URL
 */
export const createKakaoMapAppURL = (restaurant: Restaurant): string => {
  const { name, latitude, longitude } = restaurant;
  // 카카오맵 길찾기 딥링크 형식
  return `kakaomap://route?ep=${latitude},${longitude}&ename=${encodeURIComponent(name)}`;
};

/**
 * 카카오맵 웹 URL 생성 (길찾기용)
 * @param restaurant 식당 정보
 * @param userLat 사용자 위도 (선택)
 * @param userLng 사용자 경도 (선택)
 * @returns 카카오맵 웹 URL
 */
export const createKakaoMapWebURL = (
  restaurant: Restaurant,
  userLat?: number,
  userLng?: number
): string => {
  const { name, latitude, longitude } = restaurant;

  if (userLat && userLng) {
    return `https://map.kakao.com/link/from/내위치,${userLat},${userLng}/to/${encodeURIComponent(
      name
    )},${latitude},${longitude}`;
  }

  return `https://map.kakao.com/link/map/${encodeURIComponent(
    name
  )},${latitude},${longitude}`;
};

/**
 * 카카오맵 장소 상세 URL 생성
 * @param restaurant 식당 정보
 * @returns 카카오맵 장소 상세 URL
 */
export const createKakaoMapPlaceURL = (restaurant: Restaurant): string => {
  const { name, latitude, longitude } = restaurant;
  return `https://map.kakao.com/link/map/${encodeURIComponent(
    name
  )},${latitude},${longitude}`;
};

/**
 * 전화 앱 URL 생성
 * @param phoneNumber 전화번호
 * @returns 전화 앱 딥링크 URL
 */
export const createPhoneURL = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  return `tel:${cleaned}`;
};

/**
 * 공유하기 텍스트 생성
 * @param restaurant 식당 정보
 * @returns 공유할 텍스트
 */
export const createShareText = (restaurant: Restaurant): string => {
  const { name, category, address, rating } = restaurant;
  const mapURL = createKakaoMapPlaceURL(restaurant);

  return `맛.zip 추천 맛집!\n\n${name} (${category})\n⭐ ${rating}\n📍 ${address}\n\n${mapURL}`;
};

/**
 * 구글 지도 URL 생성 (백업용)
 * @param restaurant 식당 정보
 * @returns 구글 지도 URL
 */
export const createGoogleMapsURL = (restaurant: Restaurant): string => {
  const { name, latitude, longitude } = restaurant;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_name=${encodeURIComponent(
    name
  )}`;
};

/**
 * 네이버 지도 URL 생성 (백업용)
 * @param restaurant 식당 정보
 * @returns 네이버 지도 URL
 */
export const createNaverMapURL = (restaurant: Restaurant): string => {
  const { name, latitude, longitude } = restaurant;
  return `https://map.naver.com/v5/search/${encodeURIComponent(
    name
  )}?c=${longitude},${latitude},15,0,0,0,dh`;
};
