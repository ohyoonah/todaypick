import { NextRequest, NextResponse } from "next/server";
import { feedService } from "@/services/feedService";
import { FeedCategory } from "@/types/feed";
import { createClient } from "@/utils/supabase/server";
import { FEED_CATEGORY } from "@/config/constants";

const parseFeedParams = (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  return { category, page, limit };
};

const getScrapedFeeds = async (userId: string, page: number, limit: number) => {
  const supabase = await createClient();

  const {
    data: scrapedFeeds,
    error,
    count,
  } = await supabase
    .from("scraped_feeds")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw new Error(`스크랩된 피드 조회 실패: ${error.message}`);
  }

  return {
    feeds:
      scrapedFeeds?.map(({ feed }) => ({ ...feed, is_scraped: true })) || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
  };
};

const getFeedsWithScrapedStatus = async (
  category: FeedCategory,
  page: number,
  limit: number,
  userId?: string
) => {
  const supabase = await createClient();

  const result = await feedService.getFeedsWithPagination(
    category,
    page,
    limit
  );

  if (!userId) {
    return {
      ...result,
      feeds: result.feeds.map((feed) => ({ ...feed, is_scraped: false })),
    };
  }

  const { data: scrapedFeeds } = await supabase
    .from("scraped_feeds")
    .select("feed->>id")
    .eq("user_id", userId);

  const feedsWithStatus = result.feeds.map((feed) => ({
    ...feed,
    is_scraped: scrapedFeeds?.some((item) => item.id === feed.id) || false,
  }));

  return {
    ...result,
    feeds: feedsWithStatus,
  };
};

export async function GET(request: NextRequest) {
  try {
    const { category, page, limit } = parseFeedParams(request);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (category === FEED_CATEGORY.SCRAPED) {
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const result = await getScrapedFeeds(user.id, page, limit);
      return NextResponse.json(result, { status: 200 });
    } else {
      const result = await getFeedsWithScrapedStatus(
        category as FeedCategory,
        page,
        limit,
        user?.id
      );

      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    console.error("피드 API 오류:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "피드를 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
