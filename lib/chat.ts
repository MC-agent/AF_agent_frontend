import { throwApiError } from "@/lib/api-error";
import { buildAuthHeaders } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type ChatSummary = {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: number | string;
  chat_id: number;
  role: ChatRole;
  content: string;
  created_at?: string;
};

type ChatMessageApiResponse = {
  user_message: ChatMessage;
  ai_message: ChatMessage;
};

function getHeaders(token: string, includeJson = false) {
  return {
    Accept: "application/json",
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...buildAuthHeaders(token),
  };
}

export async function fetchChats(token: string) {
  const response = await fetch(`${BASE_URL}/api/chats`, {
    method: "GET",
    headers: getHeaders(token),
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    await throwApiError(response, "채팅 목록을 불러오는데 실패했습니다.");
  }

  return (await response.json()) as ChatSummary[];
}

export async function createChat(token: string) {
  const response = await fetch(`${BASE_URL}/api/chats`, {
    method: "POST",
    headers: getHeaders(token),
    credentials: "include",
  });

  if (!response.ok) {
    await throwApiError(response, "새 채팅을 생성하지 못했습니다.");
  }

  return (await response.json()) as ChatSummary;
}

export async function fetchChatMessages(chatId: number, token: string) {
  const response = await fetch(`${BASE_URL}/api/chats/${chatId}/messages`, {
    method: "GET",
    headers: getHeaders(token),
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    await throwApiError(response, "메시지를 불러오는데 실패했습니다.");
  }

  return (await response.json()) as ChatMessage[];
}

export async function sendChatMessage(
  chatId: number,
  content: string,
  token: string,
) {
  const response = await fetch(`${BASE_URL}/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: getHeaders(token, true),
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    await throwApiError(response, "메시지를 전송하지 못했습니다.");
  }

  return (await response.json()) as ChatMessageApiResponse;
}
