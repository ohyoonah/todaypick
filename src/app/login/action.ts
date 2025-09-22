"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { validateEmail, formatAuthError } from "@/utils/authUtils";
import { FORM_DATA, ROUTE_PATH } from "@/config/constants";

export async function login(
  prevState: { user: User | null; error: string },
  formData: FormData
) {
  const supabase = await createClient();

  const data = {
    email: formData.get(FORM_DATA.EMAIL) as string,
    password: formData.get(FORM_DATA.PASSWORD) as string,
  };

  if (!validateEmail(data.email)) {
    return { user: null, error: formatAuthError("Invalid email") };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { user: null, error: formatAuthError(error.message) };
  }

  revalidatePath(ROUTE_PATH.HOME, "layout");
  return { user, error: "" };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: formatAuthError(error.message) };
  }
  revalidatePath(ROUTE_PATH.HOME, "layout");
  redirect(ROUTE_PATH.HOME);
}
