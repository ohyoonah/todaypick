// ------------- 유효성 검사 -------------
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("비밀번호는 8자 이상이어야 합니다");
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push("영문자를 포함해야 합니다");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("숫자를 포함해야 합니다");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("특수문자를 포함해야 합니다");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateNickname(nickname: string): boolean {
  return nickname.length >= 2 && nickname.length <= 20;
}

// ------------- 에러 메시지 처리 -------------
export const formatAuthError = (errorMessage: string): string => {
  const authErrorMap: Record<string, string> = {
    "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다",
    "User not found": "사용자를 찾을 수 없습니다",
    "Email already exists": "이미 존재하는 이메일입니다",
    "Password too weak": "비밀번호가 너무 약합니다",
    "Invalid email": "올바른 이메일 형식을 입력해주세요",
    "Password mismatch": "비밀번호가 일치하지 않습니다",
    "Invalid nickname": "닉네임은 2-20자 사이여야 합니다",
    "Failed to logout": "로그아웃 실패",
    "Auth session missing!": "인증 세션이 없습니다", // 추가
  };

  return (
    authErrorMap[errorMessage] ||
    errorMessage ||
    "알 수 없는 오류가 발생했습니다"
  );
};
