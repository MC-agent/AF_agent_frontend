"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import styles from "../styles/login/page.module.scss";
import { persistAuthToken } from "@/lib/auth";
import { throwApiError } from "@/lib/api-error";

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

const errorMessageStyle = {
  whiteSpace: "pre-line" as const,
  padding: "12px 14px",
  borderRadius: "12px",
  background: "rgba(248, 113, 113, 0.12)",
  border: "1px solid rgba(248, 113, 113, 0.28)",
  color: "#fecaca",
  fontSize: "13px",
  lineHeight: 1.5,
};

function LoginProcess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
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
      await throwApiError(res, "로그인에 실패했습니다.");
    }

    return res.json();
  };

  const loginMutation = useMutation<LoginResponse, Error, LoginParams>({
    mutationFn: handleOnLogin,
    onSuccess: (data) => {
      setFormError("");

      if (!data.access_token) {
        setFormError("로그인 응답에 access token 이 없습니다.");
        return;
      }

      persistAuthToken(data.access_token);
      router.replace("/chat");
    },
    onError: (error) => {
      setFormError(error.message);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
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
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError("");
              }}
            />
          </label>
        </div>

        <div className={styles.inputGroup}>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormError("");
              }}
            />
          </label>
        </div>

        {formError ? <div style={errorMessageStyle}>{formError}</div> : null}

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
