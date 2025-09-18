"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { FeedCategory } from "@/types/feed";
import { FEED_CATEGORY } from "@/config/constants";
import { getValidCategory } from "@/utils/feedUtils";
import { useFeed } from "@/hooks/useFeed";
import FeedCategoryTab from "@/components/feed/FeedCategoryTab";
import FeedCard from "@/components/feed/FeedCard";
import SkeletonFeedCard from "@/components/feed/SkeletonFeedCard";
import FeedPagination from "@/components/feed/FeedPagination";

export default function CategoryByFeed() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const validCategory = getValidCategory(category);

  const {
    isLoading,
    feeds,
    paginationData,
    activeTab,
    handleScrap,
    handleChangeTab,
    isScraped,
  } = useFeed({
    category: validCategory,
    page,
    limit: 12,
  });

  // 탭 변경
  const handleTabChange = useCallback(
    (tab: FeedCategory) => {
      handleChangeTab(tab);
      router.push(`${pathname}?category=${tab}&page=1`);
    },
    [router, pathname, handleChangeTab]
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {activeTab === FEED_CATEGORY.IT_NEWS ? "IT 기사" : "테크 블로그"}
        </h2>
        <p className="text-muted-foreground text-sm">
          {activeTab === FEED_CATEGORY.IT_NEWS
            ? "최신 IT 뉴스와 업계 동향을 확인해보세요."
            : "개발자들의 기술 블로그와 튜토리얼을 확인해보세요."}
        </p>
      </div>

      <FeedCategoryTab
        activeTab={activeTab}
        handleChangeTab={handleTabChange}
      />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading || feeds.length === 0
          ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonFeedCard key={index} />
            ))
          : feeds.map((feed) => (
              <FeedCard
                key={feed.id}
                feed={feed}
                isScraped={isScraped(feed.id)}
                handleScrap={handleScrap}
              />
            ))}
      </div>

      {/* 페이지네이션 */}
      {paginationData.totalPages > 1 && !isLoading && (
        <FeedPagination
          totalPages={paginationData.totalPages}
          currentPage={paginationData.currentPage}
        />
      )}
    </div>
  );
}
