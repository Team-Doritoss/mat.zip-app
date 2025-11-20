import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Restaurant } from "@/types/restaurant";
import { textStyles, layoutStyles } from "@/styles/commonStyles";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/dimensions";

interface AIQuestionSectionProps {
  restaurant: Restaurant;
}

const QUICK_QUESTIONS = ["주차 가능해?", "예약 필요해?", "아기의자 있어?"];

export default function AIQuestionSection({
  restaurant,
}: AIQuestionSectionProps) {
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  const handleAskQuestion = (question: string) => {
    setAiQuestion(question);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      let answer = "";
      if (question.includes("주차")) {
        answer = restaurant.features.includes("주차가능")
          ? "네, 주차 가능합니다. 발렛파킹 서비스도 제공하고 있어요."
          : "주차 공간이 협소하니 대중교통 이용을 권장드립니다.";
      } else if (question.includes("예약")) {
        answer = restaurant.features.includes("예약필수")
          ? "예약 필수입니다. 전화로 미리 예약하시는 것을 추천드려요."
          : "예약 없이도 방문 가능하지만, 주말에는 대기가 있을 수 있습니다.";
      } else if (question.includes("아기의자")) {
        answer = restaurant.features.includes("아기의자")
          ? "네, 아기의자가 준비되어 있습니다."
          : "죄송하지만 아기의자는 별도로 제공하지 않습니다.";
      } else {
        answer =
          "해당 정보는 매장에 직접 문의해주시면 더 정확한 답변을 받으실 수 있습니다.";
      }
      setAiAnswer(answer);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>? 궁금한 점을 물어보세요</Text>

      <View style={styles.quickQuestions}>
        {QUICK_QUESTIONS.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickQuestionButton}
            onPress={() => handleAskQuestion(question)}
          >
            <Text style={styles.quickQuestionText}>{question}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    marginBottom: 80,
  },
  sectionTitle: {
    ...textStyles.h4,
    marginBottom: SPACING.md,
  },
  quickQuestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.sm,
  },
  quickQuestionButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  quickQuestionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  aiAnswerContainer: {
    marginTop: SPACING.md,
  },
  aiQuestionBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: SPACING.sm,
    maxWidth: "80%",
  },
  aiQuestionText: {
    fontSize: 14,
    color: COLORS.white,
  },
  aiAnswerBubble: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: "80%",
  },
  aiAnswerText: {
    fontSize: 14,
    color: COLORS.text,
  },
});
