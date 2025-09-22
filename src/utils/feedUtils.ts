import { FEED_CATEGORY } from "@/config/constants";
import { FeedCategory } from "@/types/feed";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "방금 전";
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}일 전`;

  return date.toLocaleDateString("ko-KR");
};

export const getValidCategory = (category: string | null): FeedCategory => {
  if (
    !category ||
    (category !== FEED_CATEGORY.IT_NEWS && category !== FEED_CATEGORY.TECH_BLOG)
  ) {
    return FEED_CATEGORY.IT_NEWS;
  }

  return category as FeedCategory;
};
