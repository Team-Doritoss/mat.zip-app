import { Restaurant } from "./restaurant";

/**
 * 채팅 관련 타입 정의
 */

/**
 * 채팅 메시지 역할
 */
export type MessageRole = "user" | "assistant";

/**
 * 채팅 메시지
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  restaurants?: Restaurant[];
}

/**
 * 채팅 상태
 */
export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  inputText: string;
}
