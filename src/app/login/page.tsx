"use client";


import {useState} from "react";
import styles from "../styles/login/page.module.scss";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";


export default function login(){
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const router = useRouter();
//     const loginMutation = useMutation({
//         mutationFn: login,
//         onSuccess: () => {
//         router.push("/chat");
//         },
//   });

    return(
        <div className={styles.loginContainer}>
            <form className={styles.loginForm}> 
                <div className={styles.inputGroup}>
                    <label>Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /> </label>
                </div>
                <div className={styles.inputGroup}>
                    <label>Password:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> </label>
                </div>
                <div className={styles.buttonGroup}>
                    <button type="submit">Login</button>
                    <button type="button" onClick={() => router.push("/assign")}>
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    )
};