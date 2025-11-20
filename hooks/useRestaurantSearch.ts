import { useState, useCallback } from "react";
import { Restaurant } from "@/types/restaurant";
import { getRouteInfo } from "@/services/routeService";
import { getUserLocation } from "@/services/locationService";

export interface UseRestaurantSearchReturn {
  restaurants: Restaurant[];
  loading: boolean;
  error: Error | null;
  loadRouteInfo: (restaurants: Restaurant[]) => Promise<Restaurant[]>;
  updateRestaurant: (index: number, restaurant: Restaurant) => void;
  setRestaurants: (restaurants: Restaurant[]) => void;
}

/**
 * 식당 검색 및 경로 정보 로딩을 관리하는 커스텀 훅
 * @returns 식당 목록, 로딩 상태, 에러, 경로 정보 로딩 함수
 */
export const useRestaurantSearch = (): UseRestaurantSearchReturn => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 식당 목록에 경로 정보를 추가합니다
   * @param foundRestaurants 식당 목록
   * @returns 경로 정보가 추가된 식당 목록
   */
  const loadRouteInfo = useCallback(
    async (foundRestaurants: Restaurant[]): Promise<Restaurant[]> => {
      if (foundRestaurants.length === 0) {
        return foundRestaurants;
      }

      setLoading(true);
      setError(null);

      try {
        // 사용자 위치 가져오기
        const userLocation = await getUserLocation();
        const { latitude: userLat, longitude: userLng } = userLocation;

        console.log("🔄 거리/시간 정보 로딩 시작...");

        // 첫 번째 식당의 거리 정보를 즉시 로드
        const firstRouteInfo = await getRouteInfo(
          userLat,
          userLng,
          foundRestaurants[0].latitude,
          foundRestaurants[0].longitude
        );

        foundRestaurants[0].distance = firstRouteInfo;
        setRestaurants([...foundRestaurants]);
        console.log("✅ 첫 번째 식당 거리 정보 로드 완료");

        // 나머지 식당들은 백그라운드에서 순차적으로 로드
        for (let i = 1; i < foundRestaurants.length; i++) {
          const routeInfo = await getRouteInfo(
            userLat,
            userLng,
            foundRestaurants[i].latitude,
            foundRestaurants[i].longitude
          );

          foundRestaurants[i].distance = routeInfo;
          setRestaurants([...foundRestaurants]);
          console.log(`✅ ${i + 1}번째 식당 거리 정보 로드 완료`);
        }

        console.log("🍽️ 모든 거리 정보 로딩 완료");
        setLoading(false);

        return foundRestaurants;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to load route info");
        setError(error);
        setLoading(false);
        console.error("경로 정보 로딩 실패:", error);
        return foundRestaurants;
      }
    },
    []
  );

  /**
   * 특정 인덱스의 식당 정보를 업데이트합니다
   * @param index 업데이트할 식당의 인덱스
   * @param restaurant 업데이트할 식당 정보
   */
  const updateRestaurant = useCallback(
    (index: number, restaurant: Restaurant) => {
      setRestaurants((prev) => {
        const updated = [...prev];
        updated[index] = restaurant;
        return updated;
      });
    },
    []
  );

  return {
    restaurants,
    loading,
    error,
    loadRouteInfo,
    updateRestaurant,
    setRestaurants,
  };
};
