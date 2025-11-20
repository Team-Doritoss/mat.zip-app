import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { Restaurant } from "@/types/restaurant";
import { useChat } from "@/hooks/useChat";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ChatInterfaceProps {
  onRestaurantsFound?: (restaurants: Restaurant[]) => void;
  onNavigationRequest?: (restaurant: Restaurant) => void;
}

export default function ChatInterface({
  onRestaurantsFound,
  onNavigationRequest,
}: ChatInterfaceProps) {
  const {
    messages,
    inputText,
    isTyping,
    scrollViewRef,
    setInputText,
    handleSend,
  } = useChat(onRestaurantsFound);
  const paddingBottom = useSafeAreaInsets().bottom;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onNavigationRequest={onNavigationRequest}
          />
        ))}
        {isTyping && (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color="#369667" />
          </View>
        )}
      </ScrollView>

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        disabled={isTyping}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  dragHandle: {
    alignItems: "center",
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray300,
    borderRadius: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: SPACING.md,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
});
