import TodayFeed from "@/components/feed/TodayFeed";
import TodayQuiz from "@/components/TodayQuiz";
import TodayQuote from "@/components/TodayQuote";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 오늘의 피드 */}
        <TodayFeed />

        {/* 오늘의 IT 퀴즈 */}
        <TodayQuiz />

        {/* 오늘의 명언 */}
        <TodayQuote />
      </div>
    </div>
  );
}
