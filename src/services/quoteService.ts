import { createClient } from "@/utils/supabase/client";
import { ScrapedQuote, Quote } from "@/types/quote";

export class QuoteService {
  private supabase = createClient();

  async scrapQuote(quote: Quote): Promise<ScrapedQuote> {
    const { data: user } = await this.supabase.auth.getUser();

    if (!user.user) {
      throw new Error("로그인이 필요합니다.");
    }

    const { data, error } = await this.supabase
      .from("scraped_quotes")
      .insert({
        user_id: user.user.id,
        quote: quote,
      })
      .select()
      .single();

    if (error) {
      console.error("명언 스크랩 실패:", error);
      throw error;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      quote: data.quote as Quote,
      created_at: data.created_at,
    };
  }

  async unscrapQuote(quoteId: string): Promise<void> {
    const { data: user } = await this.supabase.auth.getUser();

    if (!user.user) {
      throw new Error("로그인이 필요합니다.");
    }

    const { error } = await this.supabase
      .from("scraped_quotes")
      .delete()
      .eq("user_id", user.user.id)
      .eq("quote->>id", quoteId);

    if (error) {
      console.error("스크랩 해제 실패:", error);
      throw error;
    }
  }

  async isQuoteScraped(quoteId: string): Promise<boolean> {
    const { data: user } = await this.supabase.auth.getUser();

    if (!user.user) {
      return false;
    }

    const { data, error } = await this.supabase
      .from("scraped_quotes")
      .select("id")
      .eq("user_id", user.user.id)
      .eq("quote->>id", quoteId)
      .single();

    if (error) {
      console.error("스크랩 상태 확인 실패:", error);
      return false;
    }

    return !!data;
  }
}

export const quoteService = new QuoteService();
