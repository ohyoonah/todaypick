"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";

export const useProfileQuery = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        throw new Error("프로필을 불러오는데 실패했습니다.");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
    enabled: !!user,
  });
};
