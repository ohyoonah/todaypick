"use client";

import { useState, useMemo } from "react";
import { useAuthStore } from "@/stores/authStore";
import { PROFILE_TAB, ProfileTabType } from "@/config/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ScrapedFeedsTab from "@/components/profile/ScrapedFeedsTab";

export default function ProfilePage() {
  const { loading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTabType>(
    PROFILE_TAB.SCRAPED_FEEDS
  );

  const renderActiveTab = useMemo(() => {
    switch (activeTab) {
      case PROFILE_TAB.QUIZ_RECORDS:
        return;
      case PROFILE_TAB.SCRAPED_QUOTES:
        return;
      case PROFILE_TAB.SCRAPED_FEEDS:
      default:
        return <ScrapedFeedsTab />;
    }
  }, [activeTab]);

  const renderProfileSkeleton = useMemo(() => {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }, []);

  const handleChangeTab = (tabId: ProfileTabType) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {loading ? (
        renderProfileSkeleton
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 프로필 헤더 */}
          <ProfileHeader />
          {/* 탭 내비게이션 */}
          <ProfileTabs
            activeTab={activeTab}
            handleChangeTab={handleChangeTab}
          />
          {/* 탭 컨텐츠 */}
          {renderActiveTab}
        </div>
      )}
    </div>
  );
}
