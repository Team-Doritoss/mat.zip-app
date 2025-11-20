/**
 * 에러 관련 타입 정의
 */

/**
 * 에러 코드
 */
export enum ErrorCode {
  // Network errors
  NETWORK_ERROR = "NETWORK_ERROR",
  API_ERROR = "API_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",

  // Location errors
  LOCATION_PERMISSION_DENIED = "LOCATION_PERMISSION_DENIED",
  LOCATION_UNAVAILABLE = "LOCATION_UNAVAILABLE",

  // Data errors
  NOT_FOUND = "NOT_FOUND",
  INVALID_DATA = "INVALID_DATA",
  PARSE_ERROR = "PARSE_ERROR",

  // Unknown
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * 커스텀 에러 클래스
 */
export class AppError extends Error {
  code: ErrorCode;
  details?: unknown;

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
  }
}

/**
 * 에러 핸들러 결과
 */
export interface ErrorHandlerResult {
  message: string;
  code: ErrorCode;
  shouldRetry: boolean;
  userMessage: string;
}
