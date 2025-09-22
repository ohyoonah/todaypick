export interface Quote {
  id: string;
  text: string;
  author: string;
}

export interface ScrapedQuote {
  id: string;
  user_id: string;
  quote: Quote;
  created_at: string;
  is_scraped?: boolean;
}
