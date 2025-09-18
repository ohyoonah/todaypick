import { NextRequest, NextResponse } from "next/server";
import { feedService } from "@/services/feedService";
import { FeedCategory } from "@/types/feed";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const result = await feedService.getFeedsWithPagination(
      category as FeedCategory,
      page,
      limit
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("피드 API 오류:", error);
    return NextResponse.json(
      { error: "피드를 불러오는데 실패했습니다." },
      { status: 500 }
    );
  }
}
