"use client";

import Link from "next/link";
import { useActionState, useCallback, useEffect, startTransition } from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { logout } from "@/app/login/action";
import { ROUTE_PATH } from "@/config/constants";
import { useAuthStore } from "@/stores/authStore";
import { formatAuthError } from "@/utils/authUtils";
import { getInitials } from "@/utils/profileUtils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, setUser } = useAuthStore();
  const [state, formAction, isPending] = useActionState(logout, { error: "" });

  useEffect(() => {
    if (!isPending && !state.error) {
      setUser(null);
    }

    if (state.error) {
      alert(formatAuthError("Failed to logout"));
    }
  }, [isPending, state, setUser]);

  const handleLogOut = useCallback(() => {
    startTransition(() => {
      formAction();
    });
  }, [formAction]);

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        <Link href={ROUTE_PATH.HOME} className="text-xl font-bold">
          TodayPick
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt="프로필"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(user.user_metadata?.nickname || "")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-background"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.nickname || "사용자"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={ROUTE_PATH.PROFILE}
                    className="flex items-center cursor-pointer"
                  >
                    <FiUser className="mr-2 h-4 w-4" />
                    <span>내 프로필</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogOut}
                  className="text-red-600 cursor-pointer"
                  disabled={isPending}
                >
                  <FiLogOut className="mr-2 h-4 w-4" />
                  <span>{isPending ? "로그아웃 중..." : "로그아웃"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href={ROUTE_PATH.LOGIN}>
                <Button variant="outline" className="cursor-pointer">
                  로그인
                </Button>
              </Link>
              <Link href={ROUTE_PATH.SIGNUP}>
                <Button className="cursor-pointer">회원가입</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
