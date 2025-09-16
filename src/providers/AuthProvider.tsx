"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/stores/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, setUser, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        await initialize();
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuth();
      }
    };

    initializeAuth();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      switch (event) {
        case "INITIAL_SESSION":
          break;

        case "SIGNED_OUT":
          clearAuth();
          break;

        case "SIGNED_IN":
          if (!session?.user) return clearAuth();
          setUser(session.user);
          setLoading(false);
          break;

        case "TOKEN_REFRESHED":
          if (!session?.user) return clearAuth();
          setUser(session.user);
          setLoading(false);
          break;

        default:
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [initialize, setUser, setLoading, clearAuth]);

  return <>{children}</>;
}
