"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chat from "./chatting";
import SideBarFunction from "./sidebar";
import { clearAuthToken, fetchCurrentUser, getAuthToken, type AuthUser } from "@/lib/auth";
import {
  createChat,
  fetchChatMessages,
  fetchChats,
  sendChatMessage,
  type ChatMessage,
  type ChatSummary,
} from "@/lib/chat";

async function ensureToken() {
  const token = getAuthToken();

  if (!token) {
    throw new Error("로그인 정보가 없습니다.");
  }

  return token;
}

export default function ChatShell() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [chatListLoading, setChatListLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatError, setChatError] = useState("");

  const loadChatMessages = async (chatId: number, token: string) => {
    setMessageLoading(true);
    setSelectedChatId(chatId);
    setMessages([]);

    try {
      const data = await fetchChatMessages(chatId, token);
      setMessages(data);
      setChatError("");
    } finally {
      setMessageLoading(false);
    }
  };

  const refreshChatList = async (token: string) => {
    const data = await fetchChats(token);
    setChats(data);
    return data;
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await ensureToken();
        const [user, chatList] = await Promise.all([
          fetchCurrentUser(token),
          fetchChats(token),
        ]);

        setCurrentUser(user);
        setChats(chatList);

        if (chatList.length > 0) {
          await loadChatMessages(chatList[0].id, token);
        } else {
          setSelectedChatId(null);
          setMessages([]);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "채팅 화면을 불러오지 못했습니다.";

        if (message.includes("로그인")) {
          clearAuthToken();
          router.replace("/login");
          return;
        }

        setChatError(message);
      } finally {
        setUserLoading(false);
        setChatListLoading(false);
      }
    };

    void bootstrap();
  }, [router]);

  const handleSelectChat = async (chatId: number) => {
    if (chatId === selectedChatId) {
      return;
    }

    try {
      const token = await ensureToken();
      await loadChatMessages(chatId, token);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "채팅을 불러오지 못했습니다.";
      setChatError(message);
    }
  };

  const handleCreateChat = async () => {
    try {
      setCreatingChat(true);
      setChatError("");

      const token = await ensureToken();
      const newChat = await createChat(token);

      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChat.id);
      setMessages([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "새 채팅을 생성하지 못했습니다.";
      setChatError(message);
    } finally {
      setCreatingChat(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    const trimmed = content.trim();

    if (!trimmed || sendingMessage) {
      return;
    }

    const optimisticId = `temp-${Date.now()}`;
    const optimisticChatId = selectedChatId ?? -1;

    setMessages((prev) => [
      ...prev,
      {
        id: optimisticId,
        chat_id: optimisticChatId,
        role: "user",
        content: trimmed,
      },
    ]);

    setSendingMessage(true);
    setChatError("");

    try {
      const token = await ensureToken();

      let activeChatId = selectedChatId;
      if (!activeChatId) {
        const newChat = await createChat(token);
        activeChatId = newChat.id;
        setChats((prev) => [newChat, ...prev]);
        setSelectedChatId(newChat.id);
      }

      await sendChatMessage(activeChatId, trimmed, token);

      const [updatedMessages, updatedChats] = await Promise.all([
        fetchChatMessages(activeChatId, token),
        refreshChatList(token),
      ]);

      setMessages(updatedMessages);

      if (!updatedChats.some((chat) => chat.id === activeChatId)) {
        setSelectedChatId(updatedChats[0]?.id ?? null);
      }
    } catch (error) {
      setMessages((prev) => prev.filter((message) => message.id !== optimisticId));
      const message =
        error instanceof Error ? error.message : "메시지를 전송하지 못했습니다.";
      setChatError(message);
    } finally {
      setSendingMessage(false);
    }
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) ?? null;

  return (
    <div style={{ display: "flex" }}>
      <SideBarFunction
        chats={chats}
        selectedChatId={selectedChatId}
        currentUser={currentUser}
        userLoading={userLoading}
        chatListLoading={chatListLoading}
        creatingChat={creatingChat}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
      />
      <Chat
        chatTitle={selectedChat?.title ?? null}
        chatId={selectedChatId}
        messages={messages}
        loading={messageLoading}
        sending={sendingMessage}
        error={chatError}
        onSendMessage={handleSendMessage}
        onCreateChat={handleCreateChat}
      />
    </div>
  );
}
