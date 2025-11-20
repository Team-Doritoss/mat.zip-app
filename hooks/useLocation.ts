import { useState, useEffect } from "react";
import * as Location from "expo-location";
import {
  getUserLocation,
  watchUserLocation,
  stopWatchingLocation,
} from "@/services/locationService";
import { UserLocation } from "@/types";

export interface UseLocationReturn {
  location: UserLocation | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 사용자의 현재 위치를 가져오는 커스텀 훅
 * @param watch 위치 추적 여부 (선택, 기본값: false)
 * @returns 위치 정보, 로딩 상태, 에러, 재요청 함수
 */
export const useLocation = (watch: boolean = false): UseLocationReturn => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const userLocation = await getUserLocation();
      setLocation(userLocation);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (!watch) return;

    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      subscription = await watchUserLocation((newLocation) => {
        setLocation(newLocation);
      });
    };

    startWatching();

    return () => {
      stopWatchingLocation(subscription);
    };
  }, [watch]);

  return {
    location,
    loading,
    error,
    refetch: fetchLocation,
  };
};
