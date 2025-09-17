"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { FaCopy } from "react-icons/fa";
import { useAuthStore } from "@/stores/authStore";
import { Quote } from "@/types/quote";
import { ROUTE_PATH } from "@/config/constants";
import { getTodayQuote } from "@/utils/quoteUtils";
import { quoteService } from "@/services/quoteService";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TodayQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isScraped, setIsScraped] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const todayQuote = getTodayQuote();
        setQuote(todayQuote);

        if (user) {
          const scraped = await quoteService.isQuoteScraped(todayQuote.id);
          setIsScraped(scraped);
        }
      } catch (err) {
        console.error("명언을 불러오는 중 오류가 발생했습니다.", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuote();
  }, [user]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!quote) return;

    const text = `"${quote.text}" - ${quote.author}`;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
      alert("클립보드 복사에 실패했습니다.");
    }
  }, [quote]);

  const handleScrap = useCallback(async () => {
    if (!user) {
      router.push(ROUTE_PATH.LOGIN);
      return;
    }

    if (!quote) return;

    try {
      if (isScraped) {
        await quoteService.unscrapQuote(quote.id);
        setIsScraped(false);
      } else {
        await quoteService.scrapQuote(quote);
        setIsScraped(true);
      }
    } catch (err) {
      console.error("스크랩 처리 실패:", err);
      alert(err instanceof Error ? err.message : "스크랩 처리에 실패했습니다.");
    }
  }, [user, router, quote, isScraped]);

  const renderSkeletonCard = useMemo(() => {
    return (
      <Card className="relative w-full mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-6 right-6 z-10">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>

        <CardContent className="relative p-12">
          <div className="relative flex flex-col text-center mb-8">
            <div className="space-y-3 mb-8 px-8">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>

            <div className="flex items-center justify-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          <div className="absolute bottom-6 right-6">
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }, []);

  const renderQuoteCard = useMemo(() => {
    if (!quote) return null;

    return (
      <Card className="relative w-full mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <button
          className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer"
          onClick={handleScrap}
          aria-label={isScraped ? "스크랩 해제" : "스크랩 추가"}
        >
          {isScraped ? (
            <GoBookmarkFill className="text-2xl text-blue-500" />
          ) : (
            <GoBookmark className="text-2xl text-slate-400 hover:text-blue-500" />
          )}
        </button>

        <CardContent className="relative p-12">
          <div className="relative flex flex-col text-center mb-8">
            <div className="absolute -top-6 -left-6 text-7xl text-blue-200/40 font-serif select-none">
              &quot;
            </div>
            <div className="absolute -bottom-10 -right-6 text-7xl text-purple-200/40 font-serif select-none">
              &quot;
            </div>

            <blockquote className="text-2xl leading-relaxed text-slate-800 mb-8 px-8 font-medium">
              {quote.text}
            </blockquote>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {quote.author.charAt(0)}
                </span>
              </div>
              <cite className="text-slate-600 text-lg font-medium">
                - {quote.author} -
              </cite>
            </div>
          </div>

          <Button
            onClick={handleCopyToClipboard}
            variant="outline"
            size="lg"
            className={cn(
              "absolute bottom-6 right-6 flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl cursor-pointer",
              isCopied
                ? "text-emerald-600 bg-emerald-50/90"
                : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/90"
            )}
            aria-label="복사하기"
          >
            <FaCopy className="text-lg" />
            <span className="font-medium">
              {isCopied ? "복사됨" : "복사하기"}
            </span>
          </Button>
        </CardContent>
      </Card>
    );
  }, [quote, isScraped, isCopied, handleCopyToClipboard, handleScrap]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">오늘의 명언</h2>
        <p className="text-muted-foreground text-sm">
          매일 자정에 새로운 명언이 업데이트됩니다.
        </p>
      </div>

      {isLoading ? renderSkeletonCard : renderQuoteCard}
    </div>
  );
}
