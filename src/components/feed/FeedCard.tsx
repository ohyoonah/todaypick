"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { Feed } from "@/types/feed";
import { formatDate } from "@/utils/feedUtils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface FeedCardProps {
  feed: Feed;
  handleScrap: (feed: Feed) => void;
}

export default function FeedCard({ feed, handleScrap }: FeedCardProps) {
  const [imageLoading, setImageLoading] = useState(true);

  if (!feed) return null;

  const handleScrapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleScrap(feed);
  };

  return (
    <Link href={feed.url || ""} target="_blank">
      <Card className="h-full shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300 z-20"
          onClick={handleScrapClick}
          aria-label={feed.isScraped ? "스크랩 해제" : "스크랩 추가"}
        >
          {feed.isScraped ? (
            <GoBookmarkFill className="text-xl text-blue-500" />
          ) : (
            <GoBookmark className="text-xl text-slate-400 hover:text-blue-500" />
          )}
        </button>

        {/* 이미지 섹션 */}
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={feed.image_url || ""}
            alt={feed.title}
            fill
            className={`object-cover transition-all duration-300 hover:scale-105 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2 mb-2">
            {feed.title}
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Badge variant="secondary" className="text-xs">
              {feed.source}
            </Badge>
            <span>•</span>
            <span>{formatDate(feed.published_at)}</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-slate-600 text-sm line-clamp-3 mb-4">
            {feed.description}
          </p>
          {feed.author && (
            <span className="text-xs text-slate-400">by {feed.author}</span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
