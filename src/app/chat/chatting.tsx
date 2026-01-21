"use client";

import { useState,useRef, useEffect, FormEvent } from "react";
import styles from "../styles/chat/chatting.module.scss";

type Msg = {id:string,role: "user" | "assistant", content: string};


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
        const res = await fetch("http://localhost:5001/chat",
          {method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name: "523", request: text }),
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

 

  return (

    <div className={styles.messages}>
      {messages.map((m) => (
        <div
        key={m.id}
        className={m.role === "assistant" ? styles.msg_bot : styles.msg_user}>
        
        <div className={styles.bubble}>{m.role === "assistant" ? "Assistant: " + m.content : "User: "+ m.content}</div>
        </div>
      ))}
    <div ref={endRef}/>
      <textarea className={styles.textarea} placeholder="Type a message input..." rows={1}/>
    </div>
    );
}
