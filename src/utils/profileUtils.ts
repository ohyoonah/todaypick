import { LearningStatistics } from "@/types/auth";

export const getInitials = (nickname: string) => {
  return nickname.slice(0, 2).toUpperCase();
};

// 현재 주의 월요일부터 일요일까지 계산
export const getCurrentWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
};

// 주차 계산
const getWeekNumber = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstMonday = new Date(firstDayOfMonth);
  const dayOfWeek = firstDayOfMonth.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  firstMonday.setDate(firstDayOfMonth.getDate() + daysToMonday);

  const diffTime = date.getTime() - firstMonday.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  return Math.max(1, weekNumber);
};

// 월 + 주차 라벨
export const getCurrentWeekLabel = (): string => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const weekNumber = getWeekNumber(date);
  return `${month}월 ${weekNumber}주`;
};

// 해당 날짜의 학습 데이터 찾기
export const getLearningProgressByDate = (
  date: Date,
  statistics: LearningStatistics
) => {
  return (
    statistics.weeklyStatistics.find(
      (day) => day.date === date.toISOString().split("T")[0]
    )?.dailyProgress || {
      feedClick: false,
      quizComplete: false,
      quoteView: false,
    }
  );
};

// 완료된 활동 수 계산
export const getCompletedActivitiesCount = (dailyProgress: {
  feedClick: boolean;
  quizComplete: boolean;
  quoteView: boolean;
}): number => {
  return [
    dailyProgress.feedClick,
    dailyProgress.quizComplete,
    dailyProgress.quoteView,
  ].filter(Boolean).length;
};

// 진행률 퍼센트 계산
export const getProgressPercentage = (completedActivities: number) => {
  return (completedActivities / 3) * 100;
};

// 오늘 날짜인지 확인
export const isToday = (date: Date) => {
  return date.toDateString() === new Date().toDateString();
};

// 요일 이름 가져오기
export const getDayName = (date: Date) => {
  return date.toLocaleDateString("ko-KR", {
    weekday: "short",
  });
};

// 날짜 포맷팅 (월/일)
export const getFormattedDate = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};
