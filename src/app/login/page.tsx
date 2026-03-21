import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export const metadata: Metadata = {
  title: "로그인",
  description: "AF Agent Frontend 로그인 페이지입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (token) {
    redirect("/chat");
  }

  return <LoginForm />;
}
