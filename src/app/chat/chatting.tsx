"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "../styles/chat/chatting.module.scss";
import { type ChatMessage } from "@/lib/chat";

type ChatProps = {
  chatId: number | null;
  chatTitle: string | null;
  messages: ChatMessage[];
  loading: boolean;
  sending: boolean;
  error: string;
  onSendMessage: (content: string) => Promise<void> | void;
  onCreateChat: () => Promise<void> | void;
};

const panelStyle = {
  maxWidth: "520px",
  margin: "auto",
  padding: "24px",
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.07)",
  border: "1px solid rgba(255, 255, 255, 0.10)",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
  textAlign: "center" as const,
};

const emptyTitleStyle = {
  fontSize: "28px",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: "rgba(232, 238, 252, 0.96)",
};

const emptyBodyStyle = {
  marginTop: "12px",
  lineHeight: 1.6,
  color: "rgba(232, 238, 252, 0.72)",
};

const emptyButtonStyle = {
  marginTop: "20px",
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  color: "#081022",
  background: "linear-gradient(90deg, rgba(99, 102, 241, 0.95), rgba(34, 197, 94, 0.82))",
};

const errorMessageStyle = {
  margin: "0 18px 12px",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "rgba(248, 113, 113, 0.12)",
  border: "1px solid rgba(248, 113, 113, 0.28)",
  color: "#fecaca",
  fontSize: "13px",
  lineHeight: 1.5,
  whiteSpace: "pre-line" as const,
};

export default function Chat({
  chatId,
  chatTitle,
  messages,
  loading,
  sending,
  error,
  onSendMessage,
  onCreateChat,
}: ChatProps) {
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, sending]);

  const sendMessage = async () => {
    const text = value.trim();

    if (!text || sending) {
      return;
    }

    setValue("");
    await onSendMessage(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const showEmptyChat = !loading && chatId !== null && messages.length === 0;

  return (
    <div className={styles.messages}>
      {error ? <div style={errorMessageStyle}>{error}</div> : null}

      <div className={styles.inner}>
        {chatId === null ? (
          <div style={panelStyle}>
            <div style={emptyTitleStyle}>새 채팅을 시작해 보세요.</div>
            <p style={emptyBodyStyle}>
              숙소 추천, 맛집 추천, 여행 일정 상담처럼 원하는 질문을 바로 시작할 수 있습니다.
            </p>
            <button type="button" style={emptyButtonStyle} onClick={onCreateChat}>
              첫 채팅 만들기
            </button>
          </div>
        ) : null}

        {showEmptyChat ? (
          <div style={panelStyle}>
            <div style={emptyTitleStyle}>{chatTitle || "새 채팅"}</div>
            <p style={emptyBodyStyle}>
              첫 메시지를 보내면 백엔드가 이 채팅방에 맞춰 답변을 생성하고 제목도 자동으로 정리합니다.
            </p>
          </div>
        ) : null}

        {loading ? (
          <div style={panelStyle}>
            <div style={emptyTitleStyle}>대화 불러오는 중...</div>
          </div>
        ) : null}

        {!loading &&
          messages.map((message) => (
            <div
              key={message.id}
              className={message.role === "assistant" ? styles.msg_bot : styles.msg_user}
            >
              <div className={styles.bubble}>{message.content}</div>
            </div>
          ))}

        <div ref={endRef} />
      </div>

      <textarea
        className={styles.textarea}
        placeholder={chatId ? "메시지를 입력하세요..." : "질문을 입력하면 새 채팅을 만들어 전송합니다."}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={sending}
      />
    </div>
  );
}
