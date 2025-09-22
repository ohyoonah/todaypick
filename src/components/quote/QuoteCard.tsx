import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { FaCopy } from "react-icons/fa";
import { Quote } from "@/types/quote";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuoteCardProps {
  quote: Quote | null;
  isScraped: boolean;
  isCopied: boolean;
  handleScrap: () => void;
  handleCopyToClipboard: () => void;
}

export default function QuoteCard({
  quote,
  isScraped,
  isCopied,
  handleScrap,
  handleCopyToClipboard,
}: QuoteCardProps) {
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
}
