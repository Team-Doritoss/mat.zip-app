import { ErrorCode, AppError, ErrorHandlerResult } from "@/types/error";

/**
 * 에러 처리 유틸리티
 */

/**
 * 에러를 AppError로 변환합니다
 */
export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes("Network") || error.message.includes("fetch")) {
      return new AppError(
        ErrorCode.NETWORK_ERROR,
        "네트워크 연결에 실패했습니다",
        error
      );
    }

    // Location errors
    if (error.message.includes("location") || error.message.includes("permission")) {
      return new AppError(
        ErrorCode.LOCATION_PERMISSION_DENIED,
        "위치 권한이 필요합니다",
        error
      );
    }

    // API errors
    if (error.message.includes("API")) {
      return new AppError(ErrorCode.API_ERROR, "API 요청에 실패했습니다", error);
    }

    return new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error);
  }

  return new AppError(
    ErrorCode.UNKNOWN_ERROR,
    "알 수 없는 오류가 발생했습니다",
    error
  );
};

/**
 * 에러를 처리하고 사용자에게 표시할 메시지를 반환합니다
 */
export const handleError = (error: unknown): ErrorHandlerResult => {
  const appError = toAppError(error);

  let userMessage = "";
  let shouldRetry = false;

  switch (appError.code) {
    case ErrorCode.NETWORK_ERROR:
      userMessage = "인터넷 연결을 확인해주세요";
      shouldRetry = true;
      break;

    case ErrorCode.API_ERROR:
      userMessage = "서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요";
      shouldRetry = true;
      break;

    case ErrorCode.TIMEOUT_ERROR:
      userMessage = "요청 시간이 초과되었습니다. 다시 시도해주세요";
      shouldRetry = true;
      break;

    case ErrorCode.LOCATION_PERMISSION_DENIED:
      userMessage = "위치 권한을 허용해주세요";
      shouldRetry = false;
      break;

    case ErrorCode.LOCATION_UNAVAILABLE:
      userMessage = "위치 정보를 가져올 수 없습니다";
      shouldRetry = true;
      break;

    case ErrorCode.NOT_FOUND:
      userMessage = "요청한 정보를 찾을 수 없습니다";
      shouldRetry = false;
      break;

    case ErrorCode.INVALID_DATA:
      userMessage = "잘못된 데이터 형식입니다";
      shouldRetry = false;
      break;

    case ErrorCode.PARSE_ERROR:
      userMessage = "데이터 처리 중 오류가 발생했습니다";
      shouldRetry = false;
      break;

    default:
      userMessage = "오류가 발생했습니다. 다시 시도해주세요";
      shouldRetry = true;
  }

  // 개발 환경에서는 콘솔에 상세 에러 출력
  if (__DEV__) {
    console.error("Error handled:", {
      code: appError.code,
      message: appError.message,
      details: appError.details,
    });
  }

  return {
    message: appError.message,
    code: appError.code,
    shouldRetry,
    userMessage,
  };
};

/**
 * Promise를 안전하게 실행하고 에러를 처리합니다
 */
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    const errorResult = handleError(error);
    console.warn("Safe async failed:", errorResult.userMessage);
    return fallback;
  }
};

/**
 * 재시도 로직이 포함된 Promise 실행
 */
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const errorResult = handleError(error);

      if (!errorResult.shouldRetry) {
        throw toAppError(error);
      }

      if (attempt < maxRetries) {
        console.log(`Retry attempt ${attempt}/${maxRetries} after ${delayMs}ms`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw toAppError(lastError);
};
