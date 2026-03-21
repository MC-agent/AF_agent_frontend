"use client";

import styles from "../styles/chat/sidebar.module.scss";
import { useRouter } from "next/navigation";
import { clearAuthToken, type AuthUser } from "@/lib/auth";
import { type ChatSummary } from "@/lib/chat";

type SidebarProps = {
  chats: ChatSummary[];
  selectedChatId: number | null;
  currentUser: AuthUser | null;
  userLoading: boolean;
  chatListLoading: boolean;
  creatingChat: boolean;
  onSelectChat: (chatId: number) => void;
  onCreateChat: () => void;
};

const createButtonStyle = {
  width: "100%",
  marginBottom: "12px",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 700,
  color: "#081022",
  background: "linear-gradient(90deg, rgba(99, 102, 241, 0.95), rgba(34, 197, 94, 0.82))",
  boxShadow: "0 14px 34px rgba(99, 102, 241, 0.18)",
};

const chatButtonReset = {
  width: "100%",
  textAlign: "left" as const,
};

const emptyStateStyle = {
  padding: "16px 12px",
  borderRadius: "12px",
  fontSize: "13px",
  lineHeight: 1.5,
  color: "rgba(232, 238, 252, 0.66)",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
};

export default function SideBarFunction({
  chats,
  selectedChatId,
  currentUser,
  userLoading,
  chatListLoading,
  creatingChat,
  onSelectChat,
  onCreateChat,
}: SidebarProps) {
  const router = useRouter();

  const handleOnLogout = () => {
    clearAuthToken();
    router.replace("/login");
  };

  return (
    <div className={styles.wrapper}>
      <aside className={`${styles.sidebar} ${styles.open}`}>
        <div className={styles.header}>Chat Rooms</div>

        <div className={styles.userCard}>
          <div className={styles.userLabel}>Signed in</div>
          <div className={styles.userName}>
            {userLoading ? "사용자 정보 불러오는 중..." : currentUser?.name || "이름 없음"}
          </div>
          <div className={styles.userEmail}>
            {userLoading ? "" : currentUser?.email || "이메일 없음"}
          </div>
        </div>

        <button
          type="button"
          style={createButtonStyle}
          onClick={onCreateChat}
          disabled={creatingChat}
        >
          {creatingChat ? "채팅 만드는 중..." : "+ 새 채팅"}
        </button>

        <div className={styles.list}>
          {chatListLoading ? (
            <div style={emptyStateStyle}>채팅 목록을 불러오는 중입니다.</div>
          ) : null}

          {!chatListLoading && chats.length === 0 ? (
            <div style={emptyStateStyle}>
              아직 생성된 채팅이 없습니다.
              <br />
              새 채팅을 만들어 대화를 시작해 보세요.
            </div>
          ) : null}

          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              className={`${styles.item} ${selectedChatId === chat.id ? styles.active : ""}`}
              style={chatButtonReset}
              onClick={() => onSelectChat(chat.id)}
            >
              {chat.title}
            </button>
          ))}
        </div>

        <div className={styles.logoutButton}>
          <button type="button" onClick={handleOnLogout}>
            Log out
          </button>
        </div>
      </aside>
    </div>
  );
}
