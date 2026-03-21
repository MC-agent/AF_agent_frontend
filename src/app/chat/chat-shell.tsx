"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Chat from "./chatting";
import SideBarFunction from "./sidebar";

const queryClient = new QueryClient();

export default function ChatShell() {
  return (
    <div style={{ display: "flex" }}>
      <QueryClientProvider client={queryClient}>
        <SideBarFunction />
        <Chat />
      </QueryClientProvider>
    </div>
  );
}
