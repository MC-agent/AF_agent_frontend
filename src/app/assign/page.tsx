import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SignupForm from "./signup-form";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export const metadata: Metadata = {
  title: "회원가입",
  description: "AF Agent Frontend 회원가입 페이지입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AssignPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (token) {
    redirect("/chat");
  }

  return <SignupForm />;
}
