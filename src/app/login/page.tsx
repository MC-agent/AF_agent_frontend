"use client";


import {useState} from "react";
import styles from "../styles/login/page.module.scss";
import { useRouter } from "next/navigation";
import { useMutation,QueryClient, QueryClientProvider} from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
function Login_Process(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const router = useRouter();

    const HandleOnLogin = async ({email,password}) =>{
        try {

            const data = {"email":email,
                        "password":password}
            const res = await fetch(`${BASE_URL}/api/auth/login`,{
                method: 'POST',
                headers: {'Content-Type':"application/json"},
                body: JSON.stringify(data)
            
            }
            )
            
            return res.json();
        } catch (error) {
            throw new Error("Failed to fetch data");
    }
    };



    const loginMutation = useMutation({
        mutationFn: HandleOnLogin,
        onSuccess: (data) => {
            if(data.access_token){
                router.push("/chat");
            }
        },
        onError: (error)=>{

            alert(error.message);
        }
    });
    const handleSubmit = (e) => {
        e.preventDefault(); // 새로고침 방지
        loginMutation.mutate({ email, password }); // 실제 API 요청 트리거
    };
    return(
        <div className={styles.loginContainer}>
            <form className={styles.loginForm} onSubmit={(e) =>handleSubmit(e)}> 
                <div className={styles.inputGroup}>
                    <label>Username: <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} /> </label>
                </div>
                <div className={styles.inputGroup}>
                    <label>Password:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> </label>
                </div>
                <div className={styles.buttonGroup}>
                    <button type="submit" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                    </button>
                    <button type="button" onClick={() => router.push("/assign")}>
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    )
};

const queryClient = new QueryClient();

export default function App(){
return(

    <QueryClientProvider client={queryClient}>
        <Login_Process />
    </QueryClientProvider>
);

}