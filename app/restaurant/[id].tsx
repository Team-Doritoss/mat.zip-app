import { mockRestaurants } from '@/data/mockRestaurants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const restaurant = mockRestaurants.find(r => r.id === id);

  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text>맛집을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${restaurant.phone}`);
  };

  const handleNavigation = () => {
    const url = `https://map.kakao.com/link/to/${restaurant.name},${restaurant.latitude},${restaurant.longitude}`;
    Linking.openURL(url);
  };

  const handleAskQuestion = (question: string) => {
    setAiQuestion(question);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      let answer = '';
      if (question.includes('주차')) {
        answer = restaurant.features.includes('주차가능')
          ? '네, 주차 가능합니다. 발렛파킹 서비스도 제공하고 있어요.'
          : '주차 공간이 협소하니 대중교통 이용을 권장드립니다.';
      } else if (question.includes('예약')) {
        answer = restaurant.features.includes('예약필수')
          ? '예약 필수입니다. 전화로 미리 예약하시는 것을 추천드려요.'
          : '예약 없이도 방문 가능하지만, 주말에는 대기가 있을 수 있습니다.';
      } else if (question.includes('아기의자')) {
        answer = restaurant.features.includes('아기의자')
          ? '네, 아기의자가 준비되어 있습니다.'
          : '죄송하지만 아기의자는 별도로 제공하지 않습니다.';
      } else {
        answer = '해당 정보는 매장에 직접 문의해주시면 더 정확한 답변을 받으실 수 있습니다.';
      }
      setAiAnswer(answer);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 이미지 슬라이더 */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageSlider}
        >
          {restaurant.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* 기본 정보 */}
        <View style={styles.infoSection}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
            </View>
          </View>

          <Text style={styles.category}>{restaurant.category}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.detailText}>{restaurant.address}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.icon}>🕒</Text>
            <Text style={styles.detailText}>{restaurant.hours}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.icon}>💰</Text>
            <Text style={styles.detailText}>{restaurant.priceRange}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.icon}>💬</Text>
            <Text style={styles.detailText}>리뷰 {restaurant.reviewCount}개</Text>
          </View>
        </View>

        {/* 특징 태그 */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>매장 특징</Text>
          <View style={styles.tagsContainer}>
            {restaurant.features.map((feature, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI 요약 */}
        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <Text style={styles.sectionTitle}>🤖 AI 요약</Text>
          </View>
          <Text style={styles.summaryText}>{restaurant.summary}</Text>
        </View>

        {/* AI 질문 섹션 */}
        <View style={styles.questionSection}>
          <Text style={styles.sectionTitle}>{"?"} 궁금한 점을 물어보세요</Text>
          <View style={styles.quickQuestions}>
            {['주차 가능해?', '예약 필요해?', '아기의자 있어?'].map((q, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickQuestionButton}
                onPress={() => handleAskQuestion(q)}
              >
                <Text style={styles.quickQuestionText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {aiQuestion && (
            <View style={styles.aiAnswerContainer}>
              <View style={styles.aiQuestionBubble}>
                <Text style={styles.aiQuestionText}>👤 {aiQuestion}</Text>
              </View>
              <View style={styles.aiAnswerBubble}>
                <Text style={styles.aiAnswerText}>🤖 {aiAnswer}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 하단 액션 버튼 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleNavigation}>
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionText}>길찾기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionText}>전화</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.chatButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={[styles.actionText, styles.chatButtonText]}>AI에게 묻기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageSlider: {
    height: 250,
  },
  image: {
    width: 390,
    height: 250,
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#369667',
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    width: 24,
  },
  detailText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
  },
  featuresSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  summarySection: {
    padding: 20,
    backgroundColor: '#F5F9FF',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryHeader: {
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#555',
  },
  questionSection: {
    padding: 20,
    marginBottom: 80,
  },
  quickQuestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  quickQuestionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#666',
  },
  aiAnswerContainer: {
    marginTop: 16,
  },
  aiQuestionBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '80%',
  },
  aiQuestionText: {
    fontSize: 14,
    color: '#fff',
  },
  aiAnswerBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: '80%',
  },
  aiAnswerText: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  chatButton: {
    backgroundColor: '#369667',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  chatButtonText: {
    color: '#fff',
  },
});
