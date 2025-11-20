import { Linking, Alert, Platform } from "react-native";
import { Restaurant } from "@/types/restaurant";
import {
  createKakaoMapAppURL,
  createKakaoMapWebURL,
  createPhoneURL,
  createShareText,
} from "@/utils/navigationURL";

/**
 * 카카오맵 앱으로 길찾기를 시작합니다
 * @param restaurant 식당 정보
 * @param userLat 사용자 위도 (선택)
 * @param userLng 사용자 경도 (선택)
 */
export const navigateToRestaurant = async (
  restaurant: Restaurant,
  userLat?: number,
  userLng?: number
): Promise<void> => {
  try {
    const appURL = createKakaoMapAppURL(restaurant);
    const canOpen = await Linking.canOpenURL(appURL);

    if (canOpen) {
      // 카카오맵 앱이 설치되어 있으면 앱으로 열기
      await Linking.openURL(appURL);
      console.log("카카오맵 앱으로 길찾기 시작");
    } else {
      // 앱이 없으면 웹으로 열기
      const webURL = createKakaoMapWebURL(restaurant, userLat, userLng);
      await Linking.openURL(webURL);
      console.log("카카오맵 웹으로 길찾기 시작");
    }
  } catch (error) {
    console.error("길찾기 시작 실패:", error);
    Alert.alert("오류", "길찾기를 시작할 수 없습니다.");
  }
};

/**
 * 전화 앱을 엽니다
 * @param phoneNumber 전화번호
 */
export const makePhoneCall = async (phoneNumber: string): Promise<void> => {
  try {
    const url = createPhoneURL(phoneNumber);
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert("오류", "전화를 걸 수 없습니다.");
    }
  } catch (error) {
    console.error("전화 걸기 실패:", error);
    Alert.alert("오류", "전화를 걸 수 없습니다.");
  }
};

/**
 * 식당 정보를 공유합니다
 * @param restaurant 식당 정보
 */
export const shareRestaurant = async (
  restaurant: Restaurant
): Promise<void> => {
  try {
    const { Share } = await import("react-native");
    const message = createShareText(restaurant);

    await Share.share({
      message,
      title: `맛.zip 추천: ${restaurant.name}`,
    });
  } catch (error) {
    console.error("공유 실패:", error);
    Alert.alert("오류", "공유에 실패했습니다.");
  }
};

/**
 * 외부 URL을 엽니다
 * @param url 열 URL
 */
export const openExternalURL = async (url: string): Promise<void> => {
  try {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert("오류", "URL을 열 수 없습니다.");
    }
  } catch (error) {
    console.error("URL 열기 실패:", error);
    Alert.alert("오류", "URL을 열 수 없습니다.");
  }
};

/**
 * 앱 설정 화면을 엽니다
 */
export const openAppSettings = async (): Promise<void> => {
  try {
    await Linking.openSettings();
  } catch (error) {
    console.error("설정 열기 실패:", error);
    Alert.alert("오류", "설정 화면을 열 수 없습니다.");
  }
};
