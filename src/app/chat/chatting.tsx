"use client";

import { useState,useRef, useEffect, FormEvent } from "react";
import styles from "../styles/chat/chatting.module.scss";

type Msg = {id:string,role: "user" | "assistant", content: string};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; 
export default function Chat() {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState<Msg[]>([{id:crypto.randomUUID(),role:"assistant",
        content:"how can I help"}]);
    
    const [loading,setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const text = value.trim();
        if (!text || loading) return;
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: text }]);
        setValue("");
        setLoading(true);

        try{
        const res = await fetch(`${BASE_URL}/api/chats/{chat_id}/messages`,
          {method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ content: text }),
          }
        );
        if(!res.ok) throw new Error(`Request failed: ${res.status}`);
        const answer = await res.json();
        const content = answer?.messages?.[0] ?? "";
        setMessages((m) => [...m, {id:crypto.randomUUID(), role: "assistant", content:content}]);
        } catch(err){
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
    }

    const handleKeyDown = (e) => {
      // 한글 입력 중 조합이 끝나지 않았을 때 이벤트 중복 방지 (isComposing)
      if (e.nativeEvent.isComposing) return; 

      // Enter 키를 눌렀고, Shift 키는 누르지 않았을 때
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Enter 누를 때 줄바꿈이 되는 기본 동작 막기
        handleOnSubmit(e);  // 전송 함수 실행
      }
    };

  return (

    <div className={styles.messages}>
        <div className={styles.inner}>
          {messages.map((m) => (
            <div
            key={m.id}
            className={m.role === "assistant" ? styles.msg_bot : styles.msg_user}>
            
            <div className={styles.bubble}>{m.role === "assistant" ? "" + m.content : ""+ m.content}</div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>
      <textarea className={styles.textarea} placeholder="Type a message input..." rows={1} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown}/>
    </div>
    );
}
