import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ROUTE_PATH } from "@/config/constants";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    // IMPORTANT: Don't remove getClaims()
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    // 공개 경로들 (인증 불필요)
    const publicPaths = [ROUTE_PATH.HOME, ROUTE_PATH.LOGIN, ROUTE_PATH.SIGNUP];
    const isPublicPath = publicPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    // 인증이 필요한 경로에서 사용자가 없는 경우
    if (!user && !isPublicPath) {
      const url = request.nextUrl.clone();
      url.pathname = ROUTE_PATH.LOGIN;
      return NextResponse.redirect(url);
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Auth session missing!") {
      console.log("No active session in middleware - continuing");
    } else {
      console.error("Middleware auth error:", error);
    }
  }

  return supabaseResponse;
}
