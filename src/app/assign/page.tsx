"use client";

import {useState} from "react";
import styles from "../styles/assign/page.module.scss"

export default function authentication(){

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [repassword,setRePassword] = useState("");
    const [email,setEmail] = useState("");
    const isPasswordMatch = password === repassword;

    return (

        <div className={styles.container}>
            <form>
                <div className={styles.username}>
                    <label>UserName:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />    
                </div>
                <div className={styles.password}>
                    <label>PassWord:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className={styles.repassword}>
                    <label>RePassword:</label>
                    <input type="password" value={repassword} onChange={(e) =>setRePassword(e.target.value)}/>
                </div>

                <div className={styles.email}>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </form>


        </div>
    )

}