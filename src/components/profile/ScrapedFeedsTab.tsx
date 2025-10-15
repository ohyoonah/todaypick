"use client";

import { useInfiniteFeed } from "@/hooks/useInfiniteFeed";
import { FEED_CATEGORY } from "@/config/constants";
import FeedCard from "@/components/feed/FeedCard";
import SkeletonFeedCard from "@/components/feed/SkeletonFeedCard";
import InfiniteScrollTrigger from "@/components/feed/InfiniteScrollTrigger";

export default function ScrapedFeedsTab() {
  const {
    feeds,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    handleScrap,
  } = useInfiniteFeed({
    category: FEED_CATEGORY.SCRAPED,
    limit: 3,
  });

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
