import { generateAIResponse, searchRestaurants } from '@/data/mockRestaurants';
import { ChatMessage, Restaurant } from '@/types/restaurant';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

interface ChatInterfaceProps {
  onRestaurantsFound?: (restaurants: Restaurant[]) => void;
  onNavigationRequest?: (restaurant: Restaurant) => void;
}

export default function ChatInterface({ onRestaurantsFound, onNavigationRequest }: ChatInterfaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 맛.zip AI 어시스턴트입니다. 어떤 맛집을 찾고 계신가요?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const restaurants = searchRestaurants(inputText);
      const aiResponse = generateAIResponse(inputText, restaurants);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        restaurants,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      if (onRestaurantsFound && restaurants.length > 0) {
        onRestaurantsFound(restaurants);
      }
    }, 1000);
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.iconContainer}>
            <MaterialIcons name="smart-toy" size={24} color="#369667" />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {message.content}
          </Text>
          {message.restaurants && message.restaurants.length > 0 && (
            <View style={styles.restaurantsPreview}>
              {message.restaurants.map(restaurant => (
                <View key={restaurant.id} style={styles.restaurantCard}>
                  <TouchableOpacity
                    style={styles.restaurantInfo}
                    onPress={() => router.push(`/restaurant/${restaurant.id}` as any)}
                  >
                    <View style={styles.restaurantNameRow}>
                      <Feather name="map-pin" size={14} color="#369667" />
                      <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    </View>
                    <View style={styles.restaurantRatingRow}>
                      <Ionicons name="star" size={14} color="#FF9500" />
                      <Text style={styles.restaurantRating}>{restaurant.rating}</Text>
                    </View>
                    <Text style={styles.restaurantFeatures}>
                      {restaurant.features.slice(0, 2).join(' · ')}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.restaurantActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => router.push(`/restaurant/${restaurant.id}` as any)}
                    >
                      <Text style={styles.actionBtnText}>상세보기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.navBtn]}
                      onPress={() => onNavigationRequest?.(restaurant)}
                    >
                      <Feather name="navigation" size={14} color="#fff" />
                      <Text style={[styles.actionBtnText, styles.navBtnText]}>길찾기</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
        {isUser && (
          <View style={styles.iconContainer}>
            <Feather name="user" size={24} color="#007AFF" />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialIcons name="smart-toy" size={20} color="#369667" />
          <Text style={styles.headerTitle}>AI 맛집 어시스턴트</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(renderMessage)}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="smart-toy" size={24} color="#369667" />
            </View>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color="#666" />
              <Text style={styles.typingText}>답변 작성 중...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.suggestionsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['애견동반 브런치집', '비오는 날 국물요리', '데이트 맛집'].map(
              (suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionButton}
                  onPress={() => setInputText(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="어떤 맛집을 찾고 계신가요?"
            placeholderTextColor="#999"
            multiline
            maxLength={200}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#333',
  },
  userMessageText: {
    color: '#fff',
  },
  restaurantsPreview: {
    marginTop: 12,
  },
  restaurantCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    overflow: 'hidden',
  },
  restaurantInfo: {
    padding: 10,
  },
  restaurantNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  restaurantRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  restaurantRating: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  restaurantFeatures: {
    fontSize: 12,
    color: '#888',
  },
  restaurantActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  navBtn: {
    backgroundColor: '#369667',
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
  },
  navBtnText: {
    color: '#fff',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  suggestionsRow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: '#666',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 15,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
