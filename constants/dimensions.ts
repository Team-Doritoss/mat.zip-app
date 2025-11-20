import { Dimensions } from "react-native";

// 화면 크기
export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

// BottomSheet 관련 상수
export const BOTTOM_SHEET_MIN_HEIGHT = 100;
export const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;
export const BOTTOM_SHEET_DEFAULT_HEIGHT = SCREEN_HEIGHT * 0.4;

// 헤더 관련 상수
export const HEADER_HEIGHT = 60;
export const HEADER_LOGO_SIZE = 100;

// 애니메이션 관련 상수
export const ANIMATION_DURATION = 300;
export const SPRING_CONFIG = {
  damping: 20,
  mass: 0.5,
  stiffness: 100,
};

// 채팅 관련 상수
export const CHAT_INPUT_MIN_HEIGHT = 50;
export const CHAT_INPUT_MAX_HEIGHT = 120;
export const CHAT_MESSAGE_MAX_WIDTH = SCREEN_WIDTH * 0.75;

// 지도 관련 상수
export const MAP_DEFAULT_ZOOM = 15;
export const MAP_MARKER_SIZE = 40;
export const DEFAULT_LOCATION = {
  latitude: 37.4979,
  longitude: 127.0276,
}; // 강남역

// 카드 관련 상수
export const CARD_BORDER_RADIUS = 12;
export const CARD_SHADOW_RADIUS = 8;
export const CARD_ELEVATION = 3;

// 간격 관련 상수
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

// Z-index 관련 상수
export const Z_INDEX = {
  base: 0,
  header: 100,
  bottomSheet: 200,
  modal: 300,
  toast: 400,
} as const;
