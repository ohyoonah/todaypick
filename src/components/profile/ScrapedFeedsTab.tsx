"use client";

import { useInfiniteFeed } from "@/hooks/useInfiniteFeed";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { ROUTE_PATH } from "@/config/constants";
import { Feed } from "@/types/feed";
import { FEED_CATEGORY } from "@/config/constants";
import { useScrapFeed } from "@/hooks/useScrap";
import FeedCard from "@/components/feed/FeedCard";
import SkeletonFeedCard from "@/components/feed/SkeletonFeedCard";
import InfiniteScrollTrigger from "@/components/feed/InfiniteScrollTrigger";

export default function ScrapedFeedsTab() {
  const { user } = useAuthStore();
  const router = useRouter();
  const scrapMutation = useScrapFeed();

  const { feeds, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteFeed({
      category: FEED_CATEGORY.SCRAPED,
      limit: 3,
    });

  const handleScrap = async (feed: Feed) => {
    if (!user) {
      router.push(ROUTE_PATH.LOGIN);
      return;
    }

    try {
      await scrapMutation.mutateAsync(feed);
    } catch (error) {
      console.error("스크랩 처리 중 오류:", error);
      alert("스크랩 처리에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {feeds.length > 0 && !isLoading
          ? feeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} handleScrap={handleScrap} />
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <SkeletonFeedCard key={index} />
            ))}
      </div>
      <InfiniteScrollTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
}
