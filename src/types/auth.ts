import { User } from "@supabase/supabase-js";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData extends LoginData {
  confirmPassword: string;
  nickname: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}
