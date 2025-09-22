"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Feed, FeedCategory } from "@/types/feed";
import { FEED_CATEGORY, ROUTE_PATH } from "@/config/constants";
import { useAuthStore } from "@/stores/authStore";
import { feedService } from "@/services/feedService";

interface UseFeedProps {
  category?: FeedCategory;
  limit?: number;
  page?: number;
}

interface PaginationData {
  feeds: Feed[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const useFeed = ({
  category = FEED_CATEGORY.IT_NEWS,
  limit = 12,
  page = 1,
}: UseFeedProps = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    feeds: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [activeTab, setActiveTab] = useState<FeedCategory>(
    category as FeedCategory
  );

  const { user } = useAuthStore();
  const router = useRouter();

  const fetchFeeds = useCallback(async () => {
    setIsLoading(true);

    try {
      let url = `/api/feeds?category=${activeTab || category}`;
      if (!!limit) url += `&limit=${limit}`;
      if (!!page) url += `&page=${page}`;

      const response = await fetch(url);
      const data = await response.json();

      setPaginationData({
        feeds: data.feeds || [],
        totalCount: data.totalCount || 0,
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
      });
    } catch (err) {
      console.error("피드를 불러오는 중 오류가 발생했습니다.", err);
    } finally {
      setIsLoading(false);
    }
  }, [category, page, limit, activeTab]);

  const handleScrap = useCallback(
    async (feed: Feed) => {
      if (!user) {
        router.push(ROUTE_PATH.LOGIN);
        return;
      }

      try {
        setPaginationData((prev) => ({
          ...prev,
          feeds: prev.feeds.map((f) => {
            if (f.id === feed.id) {
              return { ...f, isScraped: !f.isScraped };
            }
            return f;
          }),
        }));

        if (feed.isScraped) {
          await feedService.unscrapFeed(feed.id);
        } else {
          await feedService.scrapFeed(feed);
        }
      } catch (err) {
        console.error("스크랩 처리 실패:", err);

        // 실패 시 원래 상태로 롤백
        setPaginationData((prev) => ({
          ...prev,
          feeds: prev.feeds.map((f) => {
            if (f.id === feed.id) {
              return { ...f, isScraped: !f.isScraped };
            }
            return f;
          }),
        }));

        alert(
          err instanceof Error ? err.message : "스크랩 처리에 실패했습니다."
        );
      }
    },
    [user, router]
  );

  const handleChangeTab = useCallback((tab: FeedCategory) => {
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  return {
    isLoading,
    feeds: paginationData.feeds,
    paginationData,
    activeTab,
    fetchFeeds,
    handleScrap,
    handleChangeTab,
  };
};
