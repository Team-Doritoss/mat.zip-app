import { useState, useRef, useEffect } from "react";
import { ScrollView } from "react-native";
import { ChatMessage, Restaurant } from "@/types";
import {
  searchRestaurants,
  generateAIResponse,
} from "@/services/restaurantService";

export interface UseChatReturn {
  messages: ChatMessage[];
  inputText: string;
  isTyping: boolean;
  scrollViewRef: React.RefObject<ScrollView | null>;
  setInputText: (text: string) => void;
  handleSend: () => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "1",
  role: "assistant",
  content: "안녕하세요! 맛.zip입니다. 어떤 맛집을 찾고 계신가요?",
  timestamp: new Date(),
};

/**
 * 채팅 기능을 제공하는 커스텀 훅
 * @param onRestaurantsFound 식당 검색 완료 시 호출될 콜백
 * @returns 채팅 관련 상태 및 메서드
 */
export const useChat = (
  onRestaurantsFound?: (restaurants: Restaurant[]) => void
): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputText;
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const restaurants = searchRestaurants(query);
      const aiResponse = generateAIResponse(query, restaurants);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        restaurants: restaurants.length > 0 ? restaurants : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      if (onRestaurantsFound && restaurants.length > 0) {
        onRestaurantsFound(restaurants);
      }
    }, 1000);
  };

  const clearMessages = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return {
    messages,
    inputText,
    isTyping,
    scrollViewRef,
    setInputText,
    handleSend,
    addMessage,
    clearMessages,
  };
};
