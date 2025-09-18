"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Feed, FeedCategory } from "@/types/feed";
import { FEED_CATEGORY, ROUTE_PATH } from "@/config/constants";
import { feedService } from "@/services/feedService";
import { useAuthStore } from "@/stores/authStore";

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
  const [scrapedFeeds, setScrapedFeeds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<FeedCategory>(category);

  const { user } = useAuthStore();
  const router = useRouter();

  // 피드 데이터 가져오기
  const fetchFeeds = useCallback(async () => {
    setIsLoading(true);

    try {
      let url = `/api/feeds?category=${activeTab}`;
      if (page) url += `&page=${page}`;
      if (limit) url += `&limit=${limit}`;

      const response = await fetch(url);
      const data = await response.json();

      setPaginationData({
        feeds: data.feeds || [],
        totalCount: data.totalCount || (data.feeds || []).length,
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
      });
    } catch (err) {
      console.error("피드를 불러오는 중 오류가 발생했습니다.", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, page, limit]);

  // 스크랩 처리
  const handleScrap = useCallback(
    async (feed: Feed) => {
      if (!user) {
        router.push(ROUTE_PATH.LOGIN);
        return;
      }

      try {
        if (scrapedFeeds.has(feed.id)) {
          await feedService.unscrapFeed(feed.id);
          setScrapedFeeds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(feed.id);
            return newSet;
          });
        } else {
          await feedService.scrapFeed(feed);
          setScrapedFeeds((prev) => new Set(prev).add(feed.id));
        }
      } catch (err) {
        console.error("스크랩 처리 실패:", err);
        alert(
          err instanceof Error ? err.message : "스크랩 처리에 실패했습니다."
        );
      }
    },
    [user, router, scrapedFeeds]
  );

  // 탭 변경
  const handleChangeTab = useCallback((tab: FeedCategory) => {
    setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
    setActiveTab(tab);
  }, []);

  // 초기 스크랩 상태 로드
  const initializeScrapedStatus = useCallback(async () => {
    if (!user) return;

    try {
      const scrapedIds = await feedService.getUserScrapedFeedIds();
      setScrapedFeeds(new Set(scrapedIds));
    } catch (err) {
      console.error("스크랩 상태 초기화 실패:", err);
    }
  }, [user]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.all([fetchFeeds(), initializeScrapedStatus()]);
      } catch (err) {
        console.error("초기화 실패:", err);
      }
    };

    initialize();
  }, [fetchFeeds, initializeScrapedStatus]);

  return {
    // 상태
    isLoading,
    feeds: paginationData.feeds,
    paginationData,
    scrapedFeeds,
    activeTab,

    // 액션
    fetchFeeds,
    handleScrap,
    handleChangeTab,

    // 유틸리티
    isScraped: (feedId: string) => scrapedFeeds.has(feedId),
  };
};
