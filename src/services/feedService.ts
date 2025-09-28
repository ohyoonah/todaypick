import { createClient } from "@/utils/supabase/client";
import { Feed, FeedSource, FeedCategory } from "@/types/feed";
import { feedSources } from "@/data/feeds";
import { FEED_CATEGORY } from "@/config/constants";
import Parser from "rss-parser";

// 유틸리티 함수들
function cleanDescription(description: string): string {
  if (!description) return "";

  return description
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// RSS 피드 수집 함수
async function fetchRSSFeed(
  source: FeedSource,
  limit: number = 12
): Promise<Feed[]> {
  try {
    const response = await fetch(source.rss_url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RSS Reader)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new Parser({
      customFields: {
        feed: ["image"],
        item: ["media:content", "media:thumbnail", "enclosure"],
      },
    });

    const feed = await parser.parseString(xmlText);

    if (!feed.items || feed.items.length === 0) {
      return [];
    }

    return feed.items.slice(0, limit).map((item, index) => ({
      id: item.link || `${source.id}-${index}-${Date.now()}`,
      title: item.title || "제목 없음",
      description: cleanDescription(item.contentSnippet || item.content || ""),
      url: item.link || "",
      source: source.name,
      published_at: item.pubDate || new Date().toISOString(),
      category: source.category,
      image_url:
        item.enclosure?.url ||
        item["media:content"]?.$?.url ||
        item["media:thumbnail"]?.$?.url ||
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop&crop=center",
      author: item.creator || source.name,
    }));
  } catch (error) {
    console.error(`RSS 피드 파싱 실패 (${source.name}):`, error);
    return [];
  }
}

// 배치 처리 함수
async function processBatches<T, R>(
  items: T[],
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];
  const batchSize = 5;
  const batchDelay = 1000;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);

    // 마지막 배치가 아니면 지연
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, batchDelay));
    }
  }

  return results;
}

// 피드 수집 함수
async function collectFeeds(
  sources: FeedSource[],
  itemsPerSource: number
): Promise<Feed[]> {
  const processBatch = async (batch: FeedSource[]) => {
    const feedPromises = batch.map((source) =>
      fetchRSSFeed(source, itemsPerSource)
    );
    const feedResults = await Promise.allSettled(feedPromises);

    const batchFeeds: Feed[] = [];
    feedResults.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value) {
        batchFeeds.push(...result.value);
        console.log(`${batch[index].name}: ${result.value.length}개 피드 수집`);
      } else {
        console.error(
          `RSS 피드 가져오기 실패 (${batch[index].name}):`,
          result.status === "rejected" ? result.reason : "알 수 없는 오류"
        );
      }
    });

    return batchFeeds;
  };

  const feeds = await processBatches(sources, processBatch);
  return feeds;
}

// 빈 결과 반환 함수
function getEmptyResult(page: number) {
  return {
    feeds: [],
    totalCount: 0,
    totalPages: 0,
    currentPage: page,
  };
}

// 메인 서비스 클래스
export class FeedService {
  private supabase = createClient();

  async getFeedsWithPagination(
    category: FeedCategory,
    page: number = 1,
    limit: number = 12
  ) {
    try {
      const filteredSources = this.getFilteredSources(category);

      if (filteredSources.length === 0) {
        return getEmptyResult(page);
      }

      const itemsPerSource = Math.ceil(
        (page * limit * 2) / filteredSources.length
      );

      console.log(
        `처리할 피드 소스 수: ${filteredSources.length}, 소스당 ${itemsPerSource}개`
      );

      const allFeeds = await collectFeeds(filteredSources, itemsPerSource);
      console.log(`총 수집된 피드 수: ${allFeeds.length}`);

      const sortedFeeds = allFeeds.sort(
        (a, b) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
      );

      const totalCount = sortedFeeds.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedFeeds = sortedFeeds.slice(startIndex, endIndex);

      return {
        feeds: paginatedFeeds,
        totalCount,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error("피드 조회 중 오류:", error);
      return getEmptyResult(page);
    }
  }

  // 스크랩 관련 메서드들
  async scrapFeed(feed: Feed) {
    const { data: user } = await this.supabase.auth.getUser();

    if (!user.user) {
      throw new Error("로그인이 필요합니다.");
    }

    const isScraped = await this.isFeedScraped(feed.id);
    const scrapedFeedsTable = this.supabase.from("scraped_feeds");

    if (isScraped) {
      const { error } = await scrapedFeedsTable
        .delete()
        .eq("user_id", user.user.id)
        .eq("feed->>id", feed.id);

      if (error) {
        console.error("스크랩 해제 실패:", error);
        throw error;
      }
    } else {
      const { error } = await scrapedFeedsTable.insert({
        user_id: user.user.id,
        feed: feed,
      });

      if (error) {
        console.error("피드 스크랩 실패:", error);
        throw error;
      }
    }
  }

  async unscrapFeed(feedId: string) {
    const { data: user } = await this.supabase.auth.getUser();

    if (!user.user) {
      throw new Error("로그인이 필요합니다.");
    }

    const { error } = await this.supabase
      .from("scraped_feeds")
      .delete()
      .eq("user_id", user.user.id)
      .eq("feed->>id", feedId);

    if (error) {
      console.error("스크랩 해제 실패:", error);
      throw error;
    }
  }

  async isFeedScraped(feedId: string): Promise<boolean> {
    const { data: user } = await this.supabase.auth.getUser();

    if (!user.user) {
      return false;
    }

    const { data, error } = await this.supabase
      .from("scraped_feeds")
      .select("id")
      .eq("user_id", user.user.id)
      .eq("feed->>id", feedId);

    if (error) {
      console.error("스크랩 상태 확인 실패:", error);
      return false;
    }

    return data && data.length > 0;
  }

  private getFilteredSources(category: FeedCategory) {
    if (category === FEED_CATEGORY.SCRAPED) {
      return feedSources;
    }
    return feedSources.filter((source) => source.category === category);
  }
}

export const feedService = new FeedService();
