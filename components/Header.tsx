import { useHeaderStore } from "@/stores/useHeaderStore"
import { useEffect, useRef } from "react"
import { Animated, Dimensions, Easing, Image, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Header = () => {
  const paddingTop = useSafeAreaInsets().top;
  const sheetHeight = useHeaderStore((state) => state.sheetHeight);
  const translateY = useRef(new Animated.Value(0)).current;
  const isHidden = useRef(false);

  useEffect(() => {
    const headerHeight = paddingTop + 68;
    const availableSpace = SCREEN_HEIGHT - sheetHeight;

    const hideThreshold = 140;  // 헤더를 숨길 때의 기준
    const showThreshold = 90;  // 헤더를 보일 때의 기준

    let shouldHide;
    if (isHidden.current) {
      shouldHide = availableSpace < showThreshold;
    } else {
      shouldHide = availableSpace < hideThreshold;
    }

    if (shouldHide !== isHidden.current) {
      isHidden.current = shouldHide;
      translateY.stopAnimation();
      Animated.timing(translateY, {
        toValue: shouldHide ? -headerHeight : 0,
        duration: 150,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start();
    }
  }, [sheetHeight, paddingTop]);

  return (
    <Animated.View style={[styles.container, { paddingTop, transform: [{ translateY }] }]}>
      <Image source={require('../assets/images/logo.png')} style={{ width: 140, height: 64, resizeMode: 'contain' }} />
    </Animated.View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingBottom: 2,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 20,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
})