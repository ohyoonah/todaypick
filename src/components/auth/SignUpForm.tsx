"use client";

import { useState, useCallback, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { signup } from "@/app/signup/action";
import { FORM_DATA, ROUTE_PATH } from "@/config/constants";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignUpForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [state, formAction, isPending] = useActionState(signup, {
    user: null,
    error: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!state.user) return;

    setUser(state.user);
    router.push(ROUTE_PATH.HOME);
  }, [state.user, setUser, router]);

  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleToggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  return (
    <form action={formAction} className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor={FORM_DATA.NICKNAME} className="text-sm text-gray-700">
          닉네임
        </Label>
        <Input
          id={FORM_DATA.NICKNAME}
          type="text"
          name={FORM_DATA.NICKNAME}
          placeholder="닉네임을 입력하세요"
          className="h-12"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={FORM_DATA.EMAIL} className="text-sm text-gray-700">
          이메일
        </Label>
        <Input
          id={FORM_DATA.EMAIL}
          type={FORM_DATA.EMAIL}
          name={FORM_DATA.EMAIL}
          placeholder="이메일을 입력하세요"
          className="h-12"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={FORM_DATA.PASSWORD} className="text-sm text-gray-700">
          비밀번호
        </Label>
        <div className="relative">
          <Input
            id={FORM_DATA.PASSWORD}
            type={showPassword ? "text" : FORM_DATA.PASSWORD}
            placeholder="비밀번호를 입력하세요"
            name={FORM_DATA.PASSWORD}
            className="h-12 pr-12"
            required
          />
          <button
            type="button"
            onClick={handleTogglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={FORM_DATA.CONFIRM_PASSWORD}
          className="text-sm text-gray-700"
        >
          비밀번호 확인
        </Label>
        <div className="relative">
          <Input
            id={FORM_DATA.CONFIRM_PASSWORD}
            name={FORM_DATA.CONFIRM_PASSWORD}
            type={showConfirmPassword ? "text" : FORM_DATA.PASSWORD}
            placeholder="비밀번호를 다시 입력하세요"
            className="h-12 pr-12"
            required
          />
          <button
            type="button"
            onClick={handleToggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
      </div>

      {state.error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {state.error}
          </AlertDescription>
        </Alert>
      )}

      {!!state.user && !isPending && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full h-12 cursor-pointer"
        disabled={isPending}
      >
        {isPending ? "가입 중..." : "회원가입"}
      </Button>
    </form>
  );
}
