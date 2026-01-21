"use client";

import Chat from "./chatting";
import SideBar from "./sidebar";

export default function Main() {

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Chat />
    </div>
  );
}
