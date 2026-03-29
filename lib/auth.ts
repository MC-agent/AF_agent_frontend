export const AUTH_COOKIE_NAME = "af_agent_access_token";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type AuthUser = {
  id?: number | string;
  name?: string;
  email?: string;
};

const readCookie = (name: string) => {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
};

export const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return readCookie(AUTH_COOKIE_NAME);
};

export const persistAuthToken = async (token: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const response = await fetch("/api/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("세션 쿠키를 저장하지 못했습니다.");
  }

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
};

export const clearAuthToken = async () => {
  if (typeof window === "undefined") {
    return;
  }

  await fetch("/api/session", {
    method: "DELETE",
    credentials: "include",
  });
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const buildAuthHeaders = (token?: string | null): Record<string, string> => {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const normalizeUser = (payload: unknown): AuthUser | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("user" in payload && payload.user && typeof payload.user === "object") {
    return payload.user as AuthUser;
  }

  return payload as AuthUser;
};

export const fetchCurrentUser = async (token?: string | null) => {
  const authToken = token ?? getAuthToken();

  if (!authToken) {
    throw new Error("로그인 정보가 없습니다.");
  }

  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...buildAuthHeaders(authToken),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("사용자 정보를 불러오지 못했습니다.");
  }

  const data = await response.json();
  return normalizeUser(data);
};
