"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { FeedCategory } from "@/types/feed";
import { FEED_CATEGORY } from "@/config/constants";
import { getValidCategory } from "@/utils/feedUtils";
import { useInfiniteFeed } from "@/hooks/useInfiniteFeed";
import FeedCategoryTab from "@/components/feed/FeedCategoryTab";
import FeedCard from "@/components/feed/FeedCard";
import SkeletonFeedCard from "@/components/feed/SkeletonFeedCard";
import InfiniteScrollTrigger from "@/components/feed/InfiniteScrollTrigger";

export default function CategoryByFeed() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const validCategory = getValidCategory(category);
  const router = useRouter();
  const pathname = usePathname();

  const {
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    feeds,
    activeTab,
    handleScrap,
    handleChangeTab,
    fetchNextPage,
  } = useInfiniteFeed({
    category: validCategory,
    limit: 12,
  });

  const handleTabChange = useCallback(
    (tab: FeedCategory) => {
      handleChangeTab(tab);
      router.push(`${pathname}?category=${tab}`);
    },
    [handleChangeTab, router, pathname]
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
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonFeedCard key={index} />
            ))
          : feeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} handleScrap={handleScrap} />
            ))}
      </div>

      <InfiniteScrollTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
