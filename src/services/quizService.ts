import { QuizResult } from "@/types/quiz";
import { createClient } from "@/utils/supabase/client";
import { quizzes } from "@/data/quizzes";

const supabase = createClient();

export class QuizService {
  // 퀴즈 답안 제출
  static async submitQuizAnswer(
    quizId: string,
    selectedAnswer: number,
    userId: string
  ): Promise<{ isCorrect: boolean; explanation: string } | null> {
    try {
      // 클라이언트 데이터에서 퀴즈 정보 가져오기
      const quiz = quizzes.find((q) => q.id === quizId);
      if (!quiz) {
        throw new Error("퀴즈를 찾을 수 없습니다.");
      }

      const isCorrect = selectedAnswer === quiz.correct_answer;

      // 이미 답안을 제출했는지 확인
      const { data: existingResult } = await supabase
        .from("quiz_results")
        .select("id")
        .eq("user_id", userId)
        .eq("quiz_id", quizId)
        .single();

      if (existingResult) {
        throw new Error("이미 답안을 제출한 퀴즈입니다.");
      }

      // 답안 저장
      const { error: resultError } = await supabase
        .from("quiz_results")
        .insert({
          user_id: userId,
          quiz_id: quizId,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
          answered_at: new Date().toISOString(),
        });

      if (resultError) {
        throw resultError;
      }

      return {
        isCorrect,
        explanation: quiz.explanation,
      };
    } catch (error) {
      console.error("퀴즈 답안 제출 실패:", error);
      return null;
    }
  }

  // 특정 퀴즈에 대한 사용자 답안 확인
  static async getUserQuizResult(
    userId: string,
    quizId: string
  ): Promise<QuizResult | null> {
    try {
      const { data, error } = await supabase
        .from("quiz_results")
        .select("*")
        .eq("user_id", userId)
        .eq("quiz_id", quizId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("퀴즈 결과 확인 실패:", error);
      return null;
    }
  }
}

// 싱글톤 인스턴스 생성
export const quizService = new QuizService();
