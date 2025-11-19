import { Restaurant } from '@/types/restaurant';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Linking,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');
const MIN_HEIGHT = 180;
const MAX_HEIGHT = height * 0.85;
const DEFAULT_HEIGHT = height * 0.5;

interface BottomSheetProps {
  restaurants: Restaurant[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onNavigate: (restaurant: Restaurant) => void;
  onClose: () => void;
}

export default function BottomSheet({
  restaurants,
  currentIndex,
  onPrevious,
  onNext,
  onNavigate,
  onClose,
}: BottomSheetProps) {
  const [sheetHeight] = useState(new Animated.Value(DEFAULT_HEIGHT));
  const [currentHeight, setCurrentHeight] = useState(DEFAULT_HEIGHT);

  const restaurant = restaurants[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === restaurants.length - 1;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // 세로 방향으로 조금이라도 움직이면 즉시 반응
      return Math.abs(gestureState.dy) > 0;
    },
    onPanResponderGrant: () => {
      // 드래그 시작 시 애니메이션 중지
      sheetHeight.stopAnimation();
    },
    onPanResponderMove: (_, gestureState) => {
      const newHeight = currentHeight - gestureState.dy;
      if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
        sheetHeight.setValue(newHeight);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      let newHeight = currentHeight - gestureState.dy;

      if (newHeight < MIN_HEIGHT + 100) {
        newHeight = MIN_HEIGHT;
      } else if (newHeight < DEFAULT_HEIGHT - 50) {
        newHeight = MIN_HEIGHT;
      } else if (newHeight < DEFAULT_HEIGHT + 50) {
        newHeight = DEFAULT_HEIGHT;
      } else {
        newHeight = MAX_HEIGHT;
      }

      setCurrentHeight(newHeight);
      Animated.spring(sheetHeight, {
        toValue: newHeight,
        useNativeDriver: false,
        damping: 20,
        stiffness: 150,
      }).start();
    },
  });

  return (
    <Animated.View style={[styles.container, { height: sheetHeight }]}>
      <View style={styles.header} {...panResponder.panHandlers}>
        <View style={styles.handle} />
      </View>

      <View style={styles.minimizedContent}>
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.compactRatingRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#369667" />
              <Text style={styles.compactRating}>{restaurant.rating}</Text>
            </View>
            <Text style={styles.compactCategory}>{restaurant.category}</Text>
          </View>
        </View>

        <View style={styles.navigation}>
          <TouchableOpacity
            style={[styles.navButton, isFirst && styles.navButtonDisabled]}
            onPress={onPrevious}
            disabled={isFirst}
          >
            <Feather name="chevron-left" size={18} color={isFirst ? '#999' : '#fff'} />
          </TouchableOpacity>

          <View style={styles.indicator}>
            <Text style={styles.indicatorText}>
              {currentIndex + 1} / {restaurants.length}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.navButton, isLast && styles.navButtonDisabled]}
            onPress={onNext}
            disabled={isLast}
          >
            <Feather name="chevron-right" size={18} color={isLast ? '#999' : '#fff'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <View style={styles.ratingRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#369667" />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
          <Text style={styles.category}>{restaurant.category}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <Feather name="map-pin" size={18} color="#369667" />
            </View>
            <Text style={styles.infoText}>{restaurant.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <Feather name="clock" size={18} color="#369667" />
            </View>
            <Text style={styles.infoText}>{restaurant.hours}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.iconWrapper}>
              <Feather name="phone" size={18} color="#369667" />
            </View>
            <Text style={styles.infoText}>{restaurant.phone}</Text>
          </View>
          {restaurant.priceRange && (
            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Feather name="dollar-sign" size={18} color="#369667" />
              </View>
              <Text style={styles.infoText}>{restaurant.priceRange}</Text>
            </View>
          )}
        </View>

        {restaurant.features.length > 0 && (
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>특징</Text>
            <View style={styles.featuresTags}>
              {restaurant.features.map((feature, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <MaterialIcons name="smart-toy" size={20} color="#369667" />
            <Text style={styles.sectionTitle}>AI 요약</Text>
          </View>
          <Text style={styles.summaryText}>{restaurant.summary}</Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.searchAgainButton}
          onPress={onClose}
        >
          <Feather name="search" size={16} color="#666" />
          <Text style={styles.searchAgainButtonText}>다시 검색</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}
        >
          <Feather name="phone" size={16} color="#369667" />
          <Text style={styles.callButtonText}>전화</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => onNavigate(restaurant)}
        >
          <Feather name="navigation" size={16} color="#fff" />
          <Text style={styles.navigateButtonText}>길찾기</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    position: 'relative',
  },
  handle: {
    width: 48,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  minimizedContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  compactInfo: {
    marginBottom: 12,
  },
  compactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  compactRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
  },
  compactRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#369667',
  },
  compactCategory: {
    fontSize: 13,
    color: '#666',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#369667',
    borderRadius: 8,
    minWidth: 50,
  },
  navButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  navButtonTextDisabled: {
    color: '#999',
  },
  indicator: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  indicatorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#369667',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 28,
    marginRight: 10,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  featuresSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginLeft: 6,
    marginBottom: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuresTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  tagText: {
    fontSize: 14,
    color: '#369667',
    fontWeight: '500',
  },
  summarySection: {
    marginBottom: 140,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  searchAgainButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#666',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  searchAgainButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#369667',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  callButtonText: {
    color: '#369667',
    fontSize: 14,
    fontWeight: '600',
  },
  navigateButton: {
    flex: 1,
    backgroundColor: '#369667',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
