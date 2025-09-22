import { createClient } from "@/utils/supabase/client";
import { Feed, FeedSource, FeedCategory } from "@/types/feed";
import { feedSources } from "@/data/feeds";
import { FEED_CATEGORY } from "@/config/constants";
import Parser from "rss-parser";

// 유틸리티 함수들
function cleanDescription(description: string): string {
  if (!description) return "";

  return description
    .replace(/<[^>]*>/g, "") // HTML 태그 제거
    .replace(/&amp;/g, "&") // &amp; 변환
    .replace(/&lt;/g, "<") // &lt; 변환
    .replace(/&gt;/g, ">") // &gt; 변환
    .replace(/&quot;/g, '"') // &quot; 변환
    .replace(/&nbsp;/g, " ") // &nbsp; 제거
    .replace(/\s+/g, " ") // 연속된 공백을 하나로
    .trim();
}

// 서버사이드에서 RSS 피드를 가져오는 함수
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

export class FeedService {
  private supabase = createClient();

  async getFeeds(category: FeedCategory, limit: number = 12): Promise<Feed[]> {
    try {
      const allFeeds: Feed[] = [];
      const filteredSources = category
        ? feedSources.filter((source) => source.category === category)
        : feedSources;

      // 각 피드에서 가져올 개수 계산
      const itemsPerSource = Math.ceil(limit / filteredSources.length);

      console.log(
        `처리할 피드 소스 수: ${filteredSources.length}, 소스당 ${itemsPerSource}개`
      );

      // 각 RSS 피드를 병렬로 가져오기
      const batchSize = 5;
      const batches = [];

      for (let i = 0; i < filteredSources.length; i += batchSize) {
        batches.push(filteredSources.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const feedPromises = batch.map((source) =>
          fetchRSSFeed(source, itemsPerSource)
        );
        const feedResults = await Promise.allSettled(feedPromises);

        feedResults.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value) {
            allFeeds.push(...result.value);
            console.log(
              `${batch[index].name}: ${result.value.length}개 피드 수집`
            );
          } else {
            console.error(
              `RSS 피드 가져오기 실패 (${batch[index].name}):`,
              result.status === "rejected" ? result.reason : "알 수 없는 오류"
            );
          }
        });

        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log(`총 수집된 피드 수: ${allFeeds.length}`);

      // 최신순으로 정렬하고 limit만큼 반환
      return allFeeds
        .sort(
          (a, b) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime()
        )
        .slice(0, limit);
    } catch (error) {
      console.error("피드 조회 중 오류:", error);
      return [];
    }
  }

  async getFeedsWithPagination(
    category: FeedCategory,
    page: number = 1,
    limit: number = 12
  ): Promise<{
    feeds: Feed[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const allFeeds: Feed[] = [];
      const filteredSources = category
        ? feedSources.filter((source) => {
            if (category === FEED_CATEGORY.SCRAPED) return true;
            return source.category === category;
          })
        : feedSources;

      const itemsPerSource = Math.ceil(
        (page * limit * 2) / filteredSources.length
      );

      console.log(
        `처리할 피드 소스 수: ${filteredSources.length}, 소스당 ${itemsPerSource}개`
      );

      const batchSize = 5;
      const batches = [];

      for (let i = 0; i < filteredSources.length; i += batchSize) {
        batches.push(filteredSources.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        const feedPromises = batch.map((source) =>
          fetchRSSFeed(source, itemsPerSource)
        );
        const feedResults = await Promise.allSettled(feedPromises);

        feedResults.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value) {
            allFeeds.push(...result.value);
            console.log(
              `${batch[index].name}: ${result.value.length}개 피드 수집`
            );
          } else {
            console.error(
              `RSS 피드 가져오기 실패 (${batch[index].name}):`,
              result.status === "rejected" ? result.reason : "알 수 없는 오류"
            );
          }
        });

        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log(`총 수집된 피드 수: ${allFeeds.length}`);

      // 최신순으로 정렬
      const sortedFeeds = allFeeds.sort(
        (a, b) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
      );

      // 페이지네이션 계산
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
      return {
        feeds: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
      };
    }
  }

  // 스크랩 관련 메서드들
  async scrapFeed(feed: Feed) {
    const { data: user } = await this.supabase.auth.getUser();

    if (!user.user) {
      throw new Error("로그인이 필요합니다.");
    }

    const scrapedFeedsTable = this.supabase.from("scraped_feeds");

    if (await this.isFeedScraped(feed.id)) {
      const { error } = await scrapedFeedsTable
        .delete()
        .eq("user_id", user.user.id)
        .eq("feed->>id", feed.id)
        .single();

      if (error) {
        console.error("스크랩 해제 실패:", error);
        throw error;
      }
    } else {
      const { error } = await scrapedFeedsTable
        .insert({
          user_id: user.user.id,
          feed: feed,
        })
        .select()
        .single();

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

  // 스크랩 상태 확인
  async isFeedScraped(feedId: string): Promise<boolean> {
    const { data: user } = await this.supabase.auth.getUser();

    if (!user.user) {
      return false;
    }

    const { data, error } = await this.supabase
      .from("scraped_feeds")
      .select("id")
      .eq("user_id", user.user.id)
      .eq("feed->>id", feedId)
      .single();

    if (error) {
      console.error("스크랩 상태 확인 실패:", error);
      return false;
    }

    return !!data;
  }
}

export const feedService = new FeedService();
