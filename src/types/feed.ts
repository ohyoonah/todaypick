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
  is_scraped?: boolean;
  image_url?: string;
  author?: string;
}

export interface FeedSource {
  id: string;
  name: string;
  rss_url: string;
  category: FeedCategory;
}
