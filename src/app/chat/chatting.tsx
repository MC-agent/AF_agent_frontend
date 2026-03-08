"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "../styles/chat/chatting.module.scss";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Chat() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "How can I help?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = value.trim();
    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text },
    ]);
    setValue("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/chats/{chat_id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const answer = await res.json();
      const content = answer?.messages?.[0] ?? "";

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content,
        },
      ]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className={styles.messages}>
      <div className={styles.inner}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === "assistant" ? styles.msg_bot : styles.msg_user}
          >
            <div className={styles.bubble}>{m.content}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Type a message..."
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
    </div>
  );
}
