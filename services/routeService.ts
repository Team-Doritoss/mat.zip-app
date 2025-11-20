import { KAKAO_REST_API_KEY } from "@/constants/key";
import { RouteInfo, RouteResponse, Coordinate, ErrorCode, AppError } from "@/types";
import { handleError } from "@/utils/errorHandler";

/**
 * 카카오 모빌리티 API를 사용하여 경로 정보를 가져옵니다
 * @param userLat 출발지 위도
 * @param userLng 출발지 경도
 * @param destLat 목적지 위도
 * @param destLng 목적지 경도
 * @returns 거리 및 경로 좌표 정보
 */
export const getRouteInfo = async (
  userLat: number,
  userLng: number,
  destLat: number,
  destLng: number
): Promise<RouteInfo> => {
  try {
    const response = await fetch(
      `https://apis-navi.kakaomobility.com/v1/waypoints/directions`,
      {
        method: "POST",
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: { x: userLng, y: userLat },
          destination: { x: destLng, y: destLat },
          priority: "RECOMMEND",
          car_fuel: "GASOLINE",
          car_hipass: false,
          alternatives: false,
          road_details: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `카카오 자동차 API 에러: ${response.status}`,
        errorText
      );
      throw new AppError(
        ErrorCode.API_ERROR,
        `카카오 경로 API 요청 실패: ${response.status}`,
        { status: response.status, errorText }
      );
    }

    const data: RouteResponse = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        "경로를 찾을 수 없습니다",
        { data }
      );
    }

    const route = data.routes[0];
    const meters = route.summary.distance;
    const carTime = Math.ceil(route.summary.duration / 60); // 초를 분으로 변환

    // 경로 좌표 추출
    const pathCoordinates: Coordinate[] = [];

    if (route.sections && route.sections.length > 0) {
      route.sections.forEach((section) => {
        if (section.roads && section.roads.length > 0) {
          section.roads.forEach((road) => {
            if (road.vertexes && road.vertexes.length > 0) {
              // vertexes는 [x1, y1, x2, y2, ...] 형태
              for (let i = 0; i < road.vertexes.length; i += 2) {
                pathCoordinates.push({
                  lng: road.vertexes[i],
                  lat: road.vertexes[i + 1],
                });
              }
            }
          });
        }
      });
    }

    console.log(
      `📍 경로 정보: ${
        meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${meters}m`
      }, 좌표 ${pathCoordinates.length}개`
    );

    return {
      meters,
      carTime,
      pathCoordinates,
    };
  } catch (error) {
    const errorResult = handleError(error);
    console.error("카카오 길찾기 API 호출 실패:", errorResult.userMessage);
    return {
      meters: 0,
      pathCoordinates: [],
    };
  }
};

/**
 * 여러 목적지에 대한 경로 정보를 병렬로 가져옵니다
 * @param userLat 출발지 위도
 * @param userLng 출발지 경도
 * @param destinations 목적지 배열 [{lat, lng}, ...]
 * @returns 각 목적지에 대한 경로 정보 배열
 */
export const getMultipleRouteInfo = async (
  userLat: number,
  userLng: number,
  destinations: Coordinate[]
): Promise<RouteInfo[]> => {
  const promises = destinations.map((dest) =>
    getRouteInfo(userLat, userLng, dest.lat, dest.lng)
  );

  return Promise.all(promises);
};

/**
 * 두 지점 간의 직선 거리를 계산합니다 (Haversine 공식)
 * @param lat1 지점1 위도
 * @param lng1 지점1 경도
 * @param lat2 지점2 위도
 * @param lng2 지점2 경도
 * @returns 미터 단위 거리
 */
export const calculateStraightDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
