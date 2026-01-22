"use client";

import {useState} from "react";
import styles from "../styles/assign/page.module.scss"
import {useRouter} from "next/navigation";
import {useMutation, QueryClient, QueryClientProvider} from '@tanstack/react-query';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; 


function Authentication(){

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [repassword,setRePassword] = useState("");
    const [email,setEmail] = useState("");
    const isPasswordMatch = password === repassword;

    const router = useRouter(); 

    const HandleOnAuth = async ({email,password,name}) => {
        if (!isPasswordMatch){
            alert("패스워드가 일치하지 않습니다.")
        };
        const res = await fetch(`${BASE_URL}/api/auth/signup`,{
            method: 'POST',
            headers: {'Content-Type':"application/json"},
            body: JSON.stringify({
                "email" : email,
                "password": password,
                "name":name})
        })
    
        return res.json()
    };

    const loginMutation = useMutation({
        mutationFn:HandleOnAuth,
        onSuccess: () => {
            router.push('/login')
        },
        onError: (error)=>{

            alert(error.message);
        }
    })

    const HandleOnSubmit = (e) =>{

        e.preventDefault();
        loginMutation.mutate({email,password,username});
    }
    

    return (

        <div className={styles.container}>
            <form>
                <div className={styles.email}>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />    
                </div>
                <div className={styles.password}>
                    <label>PassWord:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className={styles.repassword}>
                    <label>RePassword:</label>
                    <input type="password" value={repassword} onChange={(e) =>setRePassword(e.target.value)}/>
                </div>
                <div> {isPasswordMatch ? "" :"비밀번호가 일치하지 않습니다"}</div>
                <div className={styles.email}>
                    <label>Username:</label>
                    <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <button type="button" onClick={(e) => HandleOnSubmit(e)}>
                    가입 완료
                </button>
            </form>


        </div>
    );
}


const queryClient = new QueryClient();


export default function App(){


    return(
    
        <QueryClientProvider client={queryClient}>
            <Authentication />
        </QueryClientProvider>
    );
}