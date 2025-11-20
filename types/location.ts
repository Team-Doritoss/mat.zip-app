/**
 * 위치 관련 타입 정의
 */

/**
 * 사용자 위치 정보
 */
export interface UserLocation {
  latitude: number;
  longitude: number;
}

/**
 * 좌표 정보 (위도/경도)
 */
export interface Coordinate {
  lat: number;
  lng: number;
}

/**
 * 지도 영역 정보
 */
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

/**
 * 위치 권한 상태
 */
export type LocationPermissionStatus =
  | "granted"
  | "denied"
  | "undetermined"
  | "restricted";
