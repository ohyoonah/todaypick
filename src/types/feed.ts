import { FEED_CATEGORY } from "@/config/constants";

export type FeedCategory = (typeof FEED_CATEGORY)[keyof typeof FEED_CATEGORY];

export interface Feed {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  category: FeedCategory;
  image_url?: string;
  author?: string;
}

export interface ScrapedFeed {
  id: string;
  user_id: string;
  feed: Feed;
  created_at: string;
}

export interface FeedSource {
  id: string;
  name: string;
  rss_url: string;
  category: FeedCategory;
}
