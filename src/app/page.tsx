import TodayQuote from "@/components/TodayQuote";
import TodayQuiz from "@/components/TodayQuiz";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 오늘의 IT 퀴즈 */}
        <TodayQuiz />

        {/* 오늘의 명언 */}
        <TodayQuote />
      </div>
    </div>
  );
}
