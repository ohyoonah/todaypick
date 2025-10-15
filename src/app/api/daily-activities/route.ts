import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const searchParams = new URL(request.url).searchParams;
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "날짜가 필요합니다." },
        { status: 400 }
      );
    }

    // 특정 날짜의 활동 조회
    const { data, error } = await supabase
      .from("daily_activities")
      .select("*")
      .eq("user_id", user.user.id)
      .eq("date", date)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json(data || null, { status: 200 });
  } catch (error) {
    console.error("일일 활동 조회 오류:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "일일 활동을 불러오는데 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { activity, date } = body;

    if (!activity || !date) {
      return NextResponse.json(
        { error: "활동과 날짜가 필요합니다." },
        { status: 400 }
      );
    }

    const validActivities = ["feed_clicked", "quiz_completed", "quote_viewed"];

    if (!validActivities.includes(activity)) {
      return NextResponse.json(
        { error: "유효하지 않은 활동입니다." },
        { status: 400 }
      );
    }

    // 해당 날짜의 활동 업데이트 또는 생성
    const updateData: {
      user_id: string;
      date: string;
      updated_at: string;
      feed_clicked?: boolean;
      quiz_completed?: boolean;
      quote_viewed?: boolean;
    } = {
      user_id: user.user.id,
      date: date,
      updated_at: new Date().toISOString(),
    };

    // 활동별 필드 업데이트
    switch (activity) {
      case "feed_clicked":
        updateData.feed_clicked = true;
        break;
      case "quiz_completed":
        updateData.quiz_completed = true;
        break;
      case "quote_viewed":
        updateData.quote_viewed = true;
        break;
    }

    const { error } = await supabase
      .from("daily_activities")
      .upsert(updateData, {
        onConflict: "user_id,date",
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("일일 활동 업데이트 오류:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "일일 활동 업데이트에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}
