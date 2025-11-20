import { Restaurant } from "@/types/restaurant";
import { mockRestaurants } from "@/data/mockRestaurants";

/**
 * 검색어를 기반으로 식당을 검색합니다
 * @param query 검색어
 * @returns 필터링된 식당 배열
 */
export const searchRestaurants = (query: string): Restaurant[] => {
  const lowerQuery = query.toLowerCase();

  // 애견 동반 가능한 식당 검색
  if (
    lowerQuery.includes("애견") ||
    lowerQuery.includes("반려") ||
    lowerQuery.includes("강아지")
  ) {
    return mockRestaurants.filter((r) => r.features.includes("애견동반"));
  }

  // 브런치 카페 검색
  if (lowerQuery.includes("브런치")) {
    return mockRestaurants.filter((r) => r.category.includes("브런치"));
  }

  // 비오는 날, 국물 요리 검색
  if (
    lowerQuery.includes("비") ||
    lowerQuery.includes("국물") ||
    lowerQuery.includes("따뜻")
  ) {
    return mockRestaurants.filter((r) => r.category.includes("한식"));
  }

  // 데이트, 분위기 좋은 식당 검색
  if (lowerQuery.includes("데이트") || lowerQuery.includes("분위기")) {
    return mockRestaurants.filter((r) => r.rating >= 4.5);
  }

  // 24시간 영업, 야식 검색
  if (lowerQuery.includes("24시간") || lowerQuery.includes("야식")) {
    return mockRestaurants.filter((r) => r.features.includes("24시간"));
  }

  // 파스타, 이탈리안 검색
  if (lowerQuery.includes("파스타") || lowerQuery.includes("이탈리안")) {
    return mockRestaurants.filter((r) => r.category.includes("이탈리안"));
  }

  // 초밥, 스시, 일식 검색
  if (
    lowerQuery.includes("초밥") ||
    lowerQuery.includes("스시") ||
    lowerQuery.includes("일식")
  ) {
    return mockRestaurants.filter((r) => r.category.includes("일식"));
  }

  // 카테고리별 검색
  if (lowerQuery.includes("한식")) {
    return mockRestaurants.filter((r) => r.category.includes("한식"));
  }

  if (lowerQuery.includes("중식")) {
    return mockRestaurants.filter((r) => r.category.includes("중식"));
  }

  if (lowerQuery.includes("양식")) {
    return mockRestaurants.filter((r) => r.category.includes("양식"));
  }

  if (lowerQuery.includes("카페")) {
    return mockRestaurants.filter((r) => r.category.includes("카페"));
  }

  // 기본: 평점 순으로 상위 3개 반환
  return mockRestaurants
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
};

/**
 * AI 응답 메시지를 생성합니다
 * @param query 사용자 쿼리
 * @param restaurants 검색된 식당 목록
 * @returns AI 응답 메시지
 */
export const generateAIResponse = (
  query: string,
  restaurants: Restaurant[]
): string => {
  if (restaurants.length === 0) {
    return "죄송합니다. 조건에 맞는 맛집을 찾지 못했습니다. 다른 조건으로 검색해보시겠어요?";
  }

  const count = restaurants.length;

  return `${query}에 딱 맞는 맛집 ${count}곳을 찾았어요! 각 장소마다 특색이 있으니 자세히 살펴보세요.`;
};

/**
 * 식당 ID로 식당 정보를 가져옵니다
 * @param id 식당 ID
 * @returns 식당 정보 또는 undefined
 */
export const getRestaurantById = (id: string): Restaurant | undefined => {
  return mockRestaurants.find((r) => r.id === id);
};

/**
 * 카테고리별로 식당을 필터링합니다
 * @param category 카테고리
 * @returns 필터링된 식당 배열
 */
export const getRestaurantsByCategory = (category: string): Restaurant[] => {
  return mockRestaurants.filter((r) => r.category.includes(category));
};

/**
 * 특정 특징을 가진 식당을 필터링합니다
 * @param feature 특징 (예: "애견동반", "주차가능")
 * @returns 필터링된 식당 배열
 */
export const getRestaurantsByFeature = (feature: string): Restaurant[] => {
  return mockRestaurants.filter((r) => r.features.includes(feature));
};

/**
 * 평점 기준으로 식당을 필터링합니다
 * @param minRating 최소 평점
 * @returns 필터링된 식당 배열
 */
export const getRestaurantsByRating = (minRating: number): Restaurant[] => {
  return mockRestaurants.filter((r) => r.rating >= minRating);
};

/**
 * 모든 식당을 가져옵니다
 * @returns 모든 식당 배열
 */
export const getAllRestaurants = (): Restaurant[] => {
  return [...mockRestaurants];
};
