"use client";

import { useFeed } from "@/hooks/useFeed";
import { FEED_CATEGORY } from "@/config/constants";
import FeedPagination from "@/components/feed/FeedPagination";
import FeedCard from "@/components/feed/FeedCard";
import SkeletonFeedCard from "@/components/feed/SkeletonFeedCard";

export default function ScrapedFeedsTab() {
  const { isLoading, handleScrap, paginationData } = useFeed({
    category: FEED_CATEGORY.SCRAPED,
    page: 1,
    limit: 3,
  });

  return (
    <>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {paginationData.feeds.length > 0 && !isLoading
          ? paginationData.feeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} handleScrap={handleScrap} />
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <SkeletonFeedCard key={index} />
            ))}
      </div>
      {/* 페이지네이션 */}
      {paginationData.totalPages > 1 && !isLoading && (
        <FeedPagination
          totalPages={paginationData.totalPages}
          currentPage={paginationData.currentPage}
        />
      )}
    </>
  );
}
