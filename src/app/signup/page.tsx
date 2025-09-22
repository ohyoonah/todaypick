import Link from "next/link";
import { ROUTE_PATH } from "@/config/constants";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold text-foreground">회원가입</h2>
      <SignUpForm />
      <div className="relative flex items-center w-full">
        <Separator className="flex-1" />
        <span className="px-4 text-xs text-muted-foreground">또는</span>
        <Separator className="flex-1" />
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link
            href={ROUTE_PATH.LOGIN}
            className="text-primary hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
