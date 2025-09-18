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
    <div className="flex space-x-1 mb-6 bg-white/50 backdrop-blur-sm rounded-lg p-1 shadow-lg">
      <button
        onClick={() => handleChangeTab(FEED_CATEGORY.IT_NEWS)}
        className={cn(
          "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300",
          activeTab === FEED_CATEGORY.IT_NEWS
            ? "bg-white shadow-md text-blue-600"
            : "text-slate-600 hover:text-blue-600 hover:bg-white/50"
        )}
      >
        IT 기사
      </button>
      <button
        onClick={() => handleChangeTab(FEED_CATEGORY.TECH_BLOG)}
        className={cn(
          "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300",
          activeTab === FEED_CATEGORY.TECH_BLOG
            ? "bg-white shadow-md text-blue-600"
            : "text-slate-600 hover:text-blue-600 hover:bg-white/50"
        )}
      >
        테크 블로그
      </button>
    </div>
  );
}
