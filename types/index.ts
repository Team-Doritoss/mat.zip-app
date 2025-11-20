/**
 * 중앙 타입 정의 파일
 * 모든 타입을 여기서 re-export하여 import를 간소화합니다
 */

// Location types
export type {
  UserLocation,
  Coordinate,
  MapRegion,
  LocationPermissionStatus,
} from "./location";

// Route types
export type { RouteInfo, RouteResponse, DistanceInfo } from "./route";

// Restaurant types
export type {
  Restaurant,
  RestaurantCategory,
  PriceRange,
  RestaurantFilter,
  RestaurantSortOption,
  RestaurantSearchResult,
} from "./restaurant";

// Chat types
export type { ChatMessage, MessageRole, ChatState } from "./chat";

// Error types
export { ErrorCode, AppError } from "./error";
export type { ErrorHandlerResult } from "./error";
