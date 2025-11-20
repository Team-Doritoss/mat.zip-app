import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ChatMessage as ChatMessageType, Restaurant } from "@/types";
import { COLORS } from "@/constants/colors";
import { SPACING, CHAT_MESSAGE_MAX_WIDTH } from "@/constants/dimensions";

interface ChatMessageProps {
  message: ChatMessageType;
  onNavigationRequest?: (restaurant: Restaurant) => void;
}

export default function ChatMessage({
  message,
  onNavigationRequest,
}: ChatMessageProps) {
  const router = useRouter();
  const isUser = message.role === "user";

  return (
    <View
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
          <View style={styles.restaurantsContainer}>
            {message.restaurants.map((restaurant, index) => (
              <View key={restaurant.id} style={styles.restaurantCard}>
                <TouchableOpacity
                  onPress={() => router.push(`/restaurant/${restaurant.id}`)}
                  style={styles.restaurantInfo}
                >
                  <Text style={styles.restaurantNumber}>{index + 1}</Text>
                  <View style={styles.restaurantDetails}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantCategory}>
                      {restaurant.category}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => onNavigationRequest?.(restaurant)}
                >
                  <MaterialIcons name="directions" size={20} color="#369667" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  assistantMessageContainer: {
    justifyContent: "flex-start",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  messageBubble: {
    maxWidth: CHAT_MESSAGE_MAX_WIDTH,
    padding: SPACING.md,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#369667",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: COLORS.gray100,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
  },
  userMessageText: {
    color: COLORS.white,
  },
  restaurantsContainer: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  restaurantCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  restaurantInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  restaurantNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#369667",
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 28,
    marginRight: SPACING.md,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  restaurantCategory: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.sm,
  },
});
