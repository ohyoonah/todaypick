"use client";

import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { AuthState } from "@/types/auth";

interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthStore extends AuthState {
  userProfile: UserProfile | null;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  loadUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // 초기 상태
  user: null,
  userProfile: null,
  loading: true,

  // 초기화
  initialize: async () => {
    const supabase = createClient();

    try {
      set({ loading: true });

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Auth initialization error:", error);
        set({ user: null, userProfile: null });
        return;
      }

      set({ user });

      // 사용자가 있으면 프로필 데이터도 로드
      if (user) {
        await get().loadUserProfile();
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({ user: null, userProfile: null });
    } finally {
      set({ loading: false });
    }
  },

  // 사용자 프로필 로드
  loadUserProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const profile = await response.json();
        set({ userProfile: profile });
      } else {
        console.error("프로필 로드 실패");
        set({ userProfile: null });
      }
    } catch (error) {
      console.error("프로필 로드 오류:", error);
      set({ userProfile: null });
    }
  },

  setUser: (user: User | null) => set({ user }),
  setUserProfile: (profile: UserProfile | null) =>
    set({ userProfile: profile }),
  setLoading: (loading: boolean) => set({ loading }),
  clearAuth: () => set({ user: null, userProfile: null, loading: false }),
}));
