"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import styles from "../styles/login/page.module.scss";
import { persistAuthToken } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type LoginParams = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token?: string;
  token_type?: string;
  detail?: string;
};

function LoginProcess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleOnLogin = async ({
    email,
    password,
  }: LoginParams): Promise<LoginResponse> => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    return res.json();
  };

  const loginMutation = useMutation<LoginResponse, Error, LoginParams>({
    mutationFn: handleOnLogin,
    onSuccess: (data) => {
      if (!data.access_token) {
        alert("Login failed");
        return;
      }

      persistAuthToken(data.access_token);
      router.replace("/chat");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>
            Username:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <div className={styles.inputGroup}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
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
  );
}

const queryClient = new QueryClient();

export default function LoginForm() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginProcess />
    </QueryClientProvider>
  );
}
