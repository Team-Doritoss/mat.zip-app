import { Coordinate } from "./location";

/**
 * 경로 관련 타입 정의
 */

/**
 * 경로 정보 (거리, 시간, 좌표)
 */
export interface RouteInfo {
  meters: number;
  walkTime?: number;
  carTime?: number;
  transitTime?: number;
  pathCoordinates: Coordinate[];
}

/**
 * 카카오 모빌리티 API 응답 타입
 */
export interface RouteResponse {
  routes: Array<{
    summary: {
      distance: number;
      duration: number;
      fare?: number;
    };
    sections: Array<{
      roads: Array<{
        name?: string;
        distance?: number;
        duration?: number;
        vertexes: number[];
      }>;
    }>;
  }>;
}

/**
 * 거리 정보 (맛집의 distance 필드)
 */
export interface DistanceInfo {
  meters: number;
  walkTime?: number;
  carTime?: number;
  transitTime?: number;
  pathCoordinates?: Coordinate[];
}
