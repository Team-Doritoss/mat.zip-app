import * as Location from "expo-location";
import { DEFAULT_LOCATION } from "@/constants/dimensions";
import { UserLocation, ErrorCode, AppError } from "@/types";
import { handleError } from "@/utils/errorHandler";

/**
 * 위치 권한을 요청하고 현재 위치를 가져옵니다
 * @returns 사용자 위치 또는 기본 위치 (강남역)
 */
export const getUserLocation = async (): Promise<UserLocation> => {
  try {
    // 위치 권한 확인
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      // 권한이 없으면 요청
      const { status: newStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (newStatus !== "granted") {
        const error = new AppError(
          ErrorCode.LOCATION_PERMISSION_DENIED,
          "위치 권한이 거부되었습니다"
        );
        handleError(error);
        return DEFAULT_LOCATION;
      }
    }

    // 현재 위치 가져오기
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    console.log(
      `📍 사용자 위치: ${location.coords.latitude}, ${location.coords.longitude}`
    );

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    const errorResult = handleError(error);
    console.error("위치 정보 가져오기 실패:", errorResult.userMessage);
    return DEFAULT_LOCATION;
  }
};

/**
 * 위치 권한 상태를 확인합니다
 * @returns 권한 허용 여부
 */
export const checkLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    const errorResult = handleError(error);
    console.error("위치 권한 확인 실패:", errorResult.userMessage);
    return false;
  }
};

/**
 * 위치 권한을 요청합니다
 * @returns 권한 허용 여부
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    const errorResult = handleError(error);
    console.error("위치 권한 요청 실패:", errorResult.userMessage);
    return false;
  }
};

/**
 * 백그라운드 위치 추적을 시작합니다
 * @param callback 위치 변경 시 호출될 콜백
 * @returns 구독 객체
 */
export const watchUserLocation = async (
  callback: (location: UserLocation) => void
): Promise<Location.LocationSubscription | null> => {
  try {
    const hasPermission = await checkLocationPermission();

    if (!hasPermission) {
      console.log("위치 권한이 없습니다.");
      return null;
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000, // 5초마다 업데이트
        distanceInterval: 10, // 10m 이동 시 업데이트
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );

    return subscription;
  } catch (error) {
    const errorResult = handleError(error);
    console.error("위치 추적 시작 실패:", errorResult.userMessage);
    return null;
  }
};

/**
 * 위치 추적을 중지합니다
 * @param subscription 구독 객체
 */
export const stopWatchingLocation = (
  subscription: Location.LocationSubscription | null
): void => {
  if (subscription) {
    subscription.remove();
  }
};
