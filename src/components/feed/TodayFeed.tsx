"use client";

import Link from "next/link";
import { ROUTE_PATH } from "@/config/constants";
import { useFeed } from "@/hooks/useFeed";
import FeedCategoryTab from "@/components/feed/FeedCategoryTab";
import FeedCard from "@/components/feed/FeedCard";
import SkeletonFeedCard from "@/components/feed/SkeletonFeedCard";

export default function TodayFeed() {
  const { isLoading, feeds, activeTab, handleScrap, handleChangeTab } = useFeed(
    {
      limit: 3,
    }
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              오늘의 피드
            </h2>
            <p className="text-muted-foreground text-sm">
              최신 IT 뉴스와 테크 블로그 글을 확인해보세요.
            </p>
          </div>
          <Link
            href={ROUTE_PATH.FEEDS + "?category=" + activeTab + "&page=1"}
            className="text-sm text-blue-500"
          >
            전체보기
          </Link>
        </div>
      </div>

      {/* 탭 내비게이션 */}
      <FeedCategoryTab
        activeTab={activeTab}
        handleChangeTab={handleChangeTab}
      />

      {/* 피드 그리드 */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading || feeds.length === 0
          ? Array.from({ length: 3 }).map((_, index) => (
              <SkeletonFeedCard key={index} />
            ))
          : feeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} handleScrap={handleScrap} />
            ))}
      </div>
    </div>
  );
  return;
}
