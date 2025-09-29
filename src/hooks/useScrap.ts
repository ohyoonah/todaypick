import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Feed } from "@/types/feed";
import { feedService } from "@/services/feedService";

export const useScrapFeed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feed: Feed) => {
      if (feed.is_scraped) {
        await feedService.unscrapFeed(feed.id);
      } else {
        await feedService.scrapFeed(feed);
      }
      return feed;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });
};
