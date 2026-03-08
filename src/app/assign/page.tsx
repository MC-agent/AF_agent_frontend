"use client";

import { useState, FormEvent } from "react";
import styles from "../styles/assign/page.module.scss";
import { useRouter } from "next/navigation";
import {
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type SignupParams = {
  email: string;
  password: string;
  name: string;
};

type SignupResponse = {
  message?: string;
  detail?: string;
};

function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [email, setEmail] = useState("");
  const isPasswordMatch = password === repassword;

  const router = useRouter();

  const handleOnAuth = async ({
    email,
    password,
    name,
  }: SignupParams): Promise<SignupResponse> => {
    if (!isPasswordMatch) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (!res.ok) {
      throw new Error("회원가입 요청에 실패했습니다.");
    }

    return res.json();
  };

  const loginMutation = useMutation<SignupResponse, Error, SignupParams>({
    mutationFn: handleOnAuth,
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({
      email,
      password,
      name: username,
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleOnSubmit}>
        <div className={styles.email}>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.password}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.repassword}>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={repassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </div>

        <div>{isPasswordMatch ? "" : "비밀번호가 일치하지 않습니다"}</div>

        <div className={styles.email}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "가입 중..." : "가입 완료"}
        </button>
      </form>
    </div>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Authentication />
    </QueryClientProvider>
  );
}
