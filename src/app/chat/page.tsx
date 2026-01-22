"use client";

import Chat from "./chatting";
import SideBarFunction from "./sidebar";
import {useMutation, QueryClient, QueryClientProvider} from '@tanstack/react-query';


const queryClient = new QueryClient;
export default function Main() {

  return (
    <div style={{ display: "flex" }}>
      <QueryClientProvider client={queryClient}>
        <SideBarFunction />
        <Chat />
      </QueryClientProvider>
    </div>
  );
}
