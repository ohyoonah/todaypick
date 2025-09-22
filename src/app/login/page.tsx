import Link from "next/link";
import { ROUTE_PATH } from "@/config/constants";
import { LoginForm } from "@/components/auth/LoginForm";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <div className="container mx-auto h-[calc(100vh-70px)] px-8">
      <div className="flex flex-col items-center justify-center gap-6 max-w-md h-full mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">로그인</h2>

        <LoginForm />

        <div className="relative flex items-center w-full">
          <Separator className="flex-1" />
          <span className="px-4 text-xs text-gray-500">또는</span>
          <Separator className="flex-1" />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <Link
              href={ROUTE_PATH.SIGNUP}
              className="text-primary hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
