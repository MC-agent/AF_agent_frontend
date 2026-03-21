import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatShell from "./chat-shell";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export const metadata: Metadata = {
  title: "채팅",
  description: "AF Agent Frontend 채팅 페이지입니다.",
};

export default async function ChatPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  return <ChatShell />;
}
