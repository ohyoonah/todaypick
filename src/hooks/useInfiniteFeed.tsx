"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Feed, FeedCategory } from "@/types/feed";
import { FEED_CATEGORY, ROUTE_PATH } from "@/config/constants";
import { useAuthStore } from "@/stores/authStore";
import { useScrapFeed } from "./useScrap";

interface UseInfiniteFeedProps {
  category?: FeedCategory;
  limit?: number;
}

export const useInfiniteFeed = ({
  category = FEED_CATEGORY.IT_NEWS,
  limit = 12,
}: UseInfiniteFeedProps = {}) => {
  const [activeTab, setActiveTab] = useState<FeedCategory>(category);
  const { user } = useAuthStore();
  const router = useRouter();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["feeds", activeTab, limit, user?.id],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        category: activeTab,
        page: pageParam.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/feeds?${params}`);

      if (!response.ok) {
        throw new Error("피드를 불러오는데 실패했습니다.");
      }

      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },
  });

  const scrapMutation = useScrapFeed();

  const handleScrap = useCallback(
    async (feed: Feed) => {
      if (!user) {
        return router.push(ROUTE_PATH.LOGIN);
      }

      try {
        await scrapMutation.mutateAsync(feed);
      } catch (error) {
        console.error("스크랩 처리 중 오류:", error);
        alert("스크랩 처리에 실패했습니다.");
      }
    },
    [user, router, scrapMutation]
  );

  const handleChangeTab = useCallback((tab: FeedCategory) => {
    setActiveTab(tab);
  }, []);

  const allFeeds = data?.pages.flatMap((page) => page.feeds) || [];
  const uniqueFeeds = allFeeds.filter(
    (feed, index, self) => index === self.findIndex((f) => f.id === feed.id)
  );

  return {
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    feeds: uniqueFeeds,
    activeTab,
    handleScrap,
    handleChangeTab,
    fetchNextPage,
    refetch,
    error,
  };
};
