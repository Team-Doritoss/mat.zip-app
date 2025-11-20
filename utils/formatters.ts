/**
 * 거리를 포맷팅하는 유틸리티 함수
 * @param meters 미터 단위 거리
 * @returns 포맷된 거리 문자열 (예: "1.5km" 또는 "500m")
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${Math.round(meters)}m`;
};

/**
 * 시간을 포맷팅하는 유틸리티 함수
 * @param minutes 분 단위 시간
 * @returns 포맷된 시간 문자열 (예: "1시간 30분" 또는 "45분")
 */
export const formatTime = (minutes: number): string => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
  }
  return `${minutes}분`;
};

/**
 * 가격 범위를 포맷팅하는 유틸리티 함수
 * @param priceRange 가격 범위 (예: "10000-20000")
 * @returns 포맷된 가격 문자열 (예: "₩10,000-20,000")
 */
export const formatPriceRange = (priceRange: string): string => {
  const [min, max] = priceRange.split("-").map(Number);
  const formatNumber = (num: number) =>
    num.toLocaleString("ko-KR", { style: "currency", currency: "KRW" });

  if (max) {
    return `${formatNumber(min)}-${formatNumber(max)}`;
  }
  return formatNumber(min);
};

/**
 * 전화번호를 포맷팅하는 유틸리티 함수
 * @param phone 전화번호 (예: "01012345678")
 * @returns 포맷된 전화번호 (예: "010-1234-5678")
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("02")) {
    // 서울 지역번호
    return cleaned.replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length === 11) {
    // 휴대폰 번호
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length === 10) {
    // 일반 전화번호
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  return phone;
};

/**
 * 영업시간을 파싱하여 현재 영업 중인지 확인
 * @param hours 영업시간 문자열 (예: "11:00-22:00")
 * @returns 영업 중 여부
 */
export const isOpenNow = (hours: string): boolean => {
  try {
    const [open, close] = hours.split("-").map((time) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    });

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return currentMinutes >= open && currentMinutes < close;
  } catch {
    return false;
  }
};

/**
 * 날짜를 상대적 시간으로 포맷팅
 * @param date Date 객체
 * @returns 상대적 시간 문자열 (예: "방금 전", "5분 전", "2시간 전")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return date.toLocaleDateString("ko-KR");
};
