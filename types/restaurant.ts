import { DistanceInfo } from "./route";

/**
 * 맛집 관련 타입 정의
 */

/**
 * 맛집 카테고리
 */
export type RestaurantCategory =
  | "한식"
  | "중식"
  | "일식"
  | "양식"
  | "카페"
  | "디저트"
  | "분식"
  | "치킨"
  | "피자"
  | "패스트푸드"
  | "기타";

/**
 * 가격대
 */
export type PriceRange = "₩" | "₩₩" | "₩₩₩" | "₩₩₩₩";

/**
 * 맛집 정보
 */
export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  address: string;
  phone: string;
  hours: string;
  latitude: number;
  longitude: number;
  images: string[];
  features: string[];
  summary: string;
  reviewCount: number;
  priceRange?: string;
  distance?: DistanceInfo;
}

/**
 * 맛집 검색 필터
 */
export interface RestaurantFilter {
  category?: string;
  priceRange?: PriceRange;
  minRating?: number;
  features?: string[];
  maxDistance?: number; // meters
}

/**
 * 맛집 정렬 옵션
 */
export type RestaurantSortOption =
  | "distance"
  | "rating"
  | "reviewCount"
  | "priceRange";

/**
 * 맛집 검색 결과
 */
export interface RestaurantSearchResult {
  restaurants: Restaurant[];
  totalCount: number;
  hasMore: boolean;
}
