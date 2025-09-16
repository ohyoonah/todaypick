"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/stores/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, setUser, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    // 초기화
    initialize();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      switch (event) {
        case "SIGNED_OUT":
          clearAuth();
          break;

        case "SIGNED_IN":
          if (!session?.user) return clearAuth();

          setUser(session?.user);
          setLoading(false);
          break;

        case "TOKEN_REFRESHED":
          if (!session?.user) return clearAuth();

          setUser(session?.user);
          setLoading(false);
          break;

        default:
          clearAuth();
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [initialize, setUser, setLoading, clearAuth]);

  return <>{children}</>;
}
