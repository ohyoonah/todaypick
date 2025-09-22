import { FiBookmark, FiTarget } from "react-icons/fi";
import { PROFILE_TAB, ProfileTabType } from "@/config/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProfileTabsProps {
  activeTab: ProfileTabType;
  handleChangeTab: (tab: ProfileTabType) => void;
}

export default function ProfileTabs({
  activeTab,
  handleChangeTab,
}: ProfileTabsProps) {
  const tabs = [
    {
      id: PROFILE_TAB.SCRAPED_FEEDS,
      label: "스크랩한 피드",
      icon: FiBookmark,
      color: "blue",
    },
    {
      id: PROFILE_TAB.QUIZ_RECORDS,
      label: "퀴즈 기록",
      icon: FiTarget,
      color: "green",
    },
    {
      id: PROFILE_TAB.SCRAPED_QUOTES,
      label: "스크랩한 명언",
      icon: FiBookmark,
      color: "purple",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6 p-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => handleChangeTab(tab.id)}
            className={cn(
              "flex items-center space-x-2 flex-1 min-w-fit px-4 py-3 rounded-lg transition-all duration-200",
              isActive
                ? `bg-gradient-to-r ${
                    tab.color === "blue"
                      ? "from-blue-500 to-blue-600 text-white shadow-md"
                      : tab.color === "green"
                      ? "from-green-500 to-green-600 text-white shadow-md"
                      : tab.color === "purple"
                      ? "from-purple-500 to-purple-600 text-white shadow-md"
                      : "from-orange-500 to-orange-600 text-white shadow-md"
                  } hover:scale-105`
                : "hover:bg-gray-100 text-gray-600"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">{tab.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
