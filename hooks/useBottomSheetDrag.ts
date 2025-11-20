import { useRef, useState } from "react";
import { PanResponder, Animated } from "react-native";

export interface BottomSheetConfig {
  minHeight: number;
  maxHeight: number;
  defaultHeight: number;
  snapPoints?: number[];
}

export interface BottomSheetDrag {
  panResponder: ReturnType<typeof PanResponder.create>;
  animatedHeight: Animated.Value;
  currentHeight: number;
  setHeight: (height: number) => void;
  animateToHeight: (height: number) => void;
}

/**
 * BottomSheet 드래그 기능을 제공하는 커스텀 훅
 * @param config BottomSheet 설정
 * @param onHeightChange 높이 변경 시 호출될 콜백 (선택)
 * @param disabled 드래그 비활성화 여부 (선택)
 * @returns BottomSheet 드래그 관련 속성 및 메서드
 */
export const useBottomSheetDrag = (
  config: BottomSheetConfig,
  onHeightChange?: (height: number) => void,
  disabled: boolean = false
): BottomSheetDrag => {
  const { minHeight, maxHeight, defaultHeight, snapPoints } = config;

  const animatedHeight = useRef(new Animated.Value(defaultHeight)).current;
  const [currentHeight, setCurrentHeight] = useState(defaultHeight);

  // 높이를 애니메이션 없이 직접 설정
  const setHeight = (height: number) => {
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, height));
    animatedHeight.setValue(clampedHeight);
    setCurrentHeight(clampedHeight);
    onHeightChange?.(clampedHeight);
  };

  // 높이를 애니메이션과 함께 설정
  const animateToHeight = (height: number) => {
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, height));
    setCurrentHeight(clampedHeight);
    onHeightChange?.(clampedHeight);

    Animated.spring(animatedHeight, {
      toValue: clampedHeight,
      useNativeDriver: false,
      damping: 20,
      stiffness: 150,
    }).start();
  };

  // 가장 가까운 스냅 포인트 찾기
  const findNearestSnapPoint = (height: number): number => {
    if (!snapPoints || snapPoints.length === 0) {
      // 기본 스냅 포인트: minHeight, defaultHeight, maxHeight
      const defaultSnapPoints = [minHeight, defaultHeight, maxHeight];
      return defaultSnapPoints.reduce((prev, curr) =>
        Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
      );
    }

    return snapPoints.reduce((prev, curr) =>
      Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
    );
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onMoveShouldSetPanResponder: () => !disabled,
    onPanResponderMove: (_, gestureState) => {
      if (disabled) return;

      const newHeight = currentHeight - gestureState.dy;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        animatedHeight.setValue(newHeight);
        onHeightChange?.(newHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (disabled) return;

      const newHeight = currentHeight - gestureState.dy;
      const snapHeight = findNearestSnapPoint(newHeight);

      setCurrentHeight(snapHeight);
      onHeightChange?.(snapHeight);

      Animated.spring(animatedHeight, {
        toValue: snapHeight,
        useNativeDriver: false,
        damping: 20,
        stiffness: 150,
      }).start();
    },
  });

  return {
    panResponder,
    animatedHeight,
    currentHeight,
    setHeight,
    animateToHeight,
  };
};
