"use client";

import { FiCalendar } from "react-icons/fi";
import { LearningStatistics } from "@/types/auth";
import { cn } from "@/lib/utils";
import {
  getCurrentWeekDates,
  getCurrentWeekLabel,
  getLearningProgressByDate,
  getCompletedActivitiesCount,
  getProgressPercentage,
  isToday,
  getDayName,
  getFormattedDate,
} from "@/utils/profileUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CircularProgressbar from "@/components/CircularProgressbar";

interface WeeklyLearningProgressProps {
  statistics: LearningStatistics;
}

export default function WeeklyLearningProgress({
  statistics,
}: WeeklyLearningProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FiCalendar className="h-5 w-5" />
          <span>{getCurrentWeekLabel()} 학습 현황</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
          {getCurrentWeekDates().map((date) => {
            const dailyProgress = getLearningProgressByDate(date, statistics);
            const completedActivities =
              getCompletedActivitiesCount(dailyProgress);

            return (
              <div key={date.toISOString()} className="text-center">
                <div
                  className={cn(
                    "flex flex-col items-center mb-2 text-xs",
                    isToday(date)
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  )}
                >
                  <span>{getDayName(date)}</span>
                  <span>{getFormattedDate(date)}</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <CircularProgressbar
                    value={getProgressPercentage(completedActivities)}
                    size={80}
                    strokeWidth={6}
                    color={completedActivities === 3 ? "#10b981" : "#3b82f6"}
                    backgroundColor="#e5e7eb"
                    showValue={false}
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold">
                        {completedActivities}
                      </div>
                      <div className="text-xs text-muted-foreground">/3</div>
                    </div>
                  </CircularProgressbar>

                  <div className="flex space-x-1">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        dailyProgress.feedClick ? "bg-blue-500" : "bg-gray-300"
                      )}
                    />
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        dailyProgress.quizComplete
                          ? "bg-green-500"
                          : "bg-gray-300"
                      )}
                    />
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        dailyProgress.quoteView
                          ? "bg-purple-500"
                          : "bg-gray-300"
                      )}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>피드 확인</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>퀴즈 풀기</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>명언 확인</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
