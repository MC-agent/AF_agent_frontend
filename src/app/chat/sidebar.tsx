"use client";

import { useState, useEffect } from "react";
import styles from "../styles/chat/sidebar.module.scss";
import {useMutation, QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useRouter} from "next/navigation";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL; 
const MOCKDATA = [
  {
    "id": 2,
    "user_id": 1,
    "title": "제주도 숙소 추천",
    "created_at": "2024-01-05T10:00:00",
    "updated_at": "2024-01-05T11:30:00"
  },
  {
    "id": 1,
    "user_id": 1,
    "title": "강남 맛집 추천",
    "created_at": "2024-01-04T12:00:00",
    "updated_at": "2024-01-04T14:00:00"
  }
];
type Msg = {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export default function SideBarFunction() {
  const [open, setOpen] = useState(true);
  const [messages,setMessages] = useState<Msg[]>([]);
  const router = useRouter();

  const GetChatInfo = async() => {

    const res =  await fetch(`${BASE_URL}/api/chats`,{
      method:'GET',
      //headers: {"Authorization": `Bearer ${access_token}`}
    })
    if (!res.ok) {
        throw new Error('채팅 목록을 불러오는데 실패했습니다.');
      }

    const data = await res.json();
    setMessages(data);

    return res;
  }
  useEffect(() => {
 //   GetChatInfo();
    setMessages(MOCKDATA);
  }, []);

  const HandleOnLogout = (e) => {

    router.push("/login")
  }


  return (
    <div className={styles.wrapper}>
      {/* 토글 버튼 */}
      <button
        className={styles.toggleButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "⟨" : "⟩"}
      </button>

      {/* 사이드바 본체 */}
      <aside
        className={`${styles.sidebar} ${
          open ? styles.open : styles.closed
        }`}
      >
        <div className={styles.header}>Chat Rooms</div>

        <div className={styles.list}>
          {messages.map((m) =>(
            <li key={m.id} className={styles.item}>
              {m.title}
            </li>
          ))}

        </div>

        <div className={styles.logoutButton}>
          <button type="button" onClick={(e)=>HandleOnLogout(e)}> LogOut</button>
        </div>
      </aside>
    </div>
  );
}


