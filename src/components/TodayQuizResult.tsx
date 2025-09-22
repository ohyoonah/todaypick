import { cn } from "@/lib/utils";
import { Quiz } from "@/types/quiz";

interface TodayQuizResultProps {
  isCorrect: boolean;
  quiz: Quiz;
}

export default function TodayQuizResult({
  isCorrect,
  quiz,
}: TodayQuizResultProps) {
  return (
    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
      <div className="text-center mb-4">
        <p
          className={cn(
            "text-lg font-semibold mb-2",
            isCorrect ? "text-success" : "text-destructive"
          )}
        >
          {isCorrect ? "🎉 정답입니다!" : "❌ 정답이 아닙니다"}
        </p>
        <p className="text-sm text-muted-foreground">
          정답: {quiz.options[quiz.correct_answer]}
        </p>
      </div>

      {quiz.explanation && (
        <div className="mt-4 p-3 bg-card border border-border rounded-lg">
          <h4 className="text-sm font-medium text-card-foreground mb-2">
            💡 해설
          </h4>
          <p className="text-sm text-muted-foreground">{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
}
