import { FEED_CATEGORY } from "@/config/constants";
import { FeedCategory } from "@/types/feed";
import { cn } from "@/lib/utils";

interface FeedCategoryTabProps {
  activeTab: FeedCategory;
  handleChangeTab: (tab: FeedCategory) => void;
}

export default function FeedCategoryTab({
  activeTab,
  handleChangeTab,
}: FeedCategoryTabProps) {
  return (
    <div className="flex space-x-1 mb-6 bg-muted/50 rounded-lg p-1 shadow-sm">
      <button
        onClick={() => handleChangeTab(FEED_CATEGORY.IT_NEWS)}
        className={cn(
          "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
          activeTab === FEED_CATEGORY.IT_NEWS
            ? "bg-background shadow-sm text-primary"
            : "text-muted-foreground hover:text-primary hover:bg-background/50"
        )}
      >
        IT 기사
      </button>
      <button
        onClick={() => handleChangeTab(FEED_CATEGORY.TECH_BLOG)}
        className={cn(
          "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
          activeTab === FEED_CATEGORY.TECH_BLOG
            ? "bg-background shadow-sm text-primary"
            : "text-muted-foreground hover:text-primary hover:bg-background/50"
        )}
      >
        테크 블로그
      </button>
    </div>
  );
}
