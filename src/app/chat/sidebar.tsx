"use client";

import { useState } from "react";
import styles from "../styles/chat/sidebar.module.scss";

export default function SideBar() {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.wrapper}>
      {/* 토글 버튼 */}
      <button
        className={styles.toggleButton}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "⟨" : "⟩"}
      </button>

      {/* 사이드바 본체 */}
      <aside
        className={`${styles.sidebar} ${
          open ? styles.open : styles.closed
        }`}
      >
        <div className={styles.header}>Chat Rooms</div>

        <ul className={styles.list}>
          <li className={styles.item}>General</li>
          <li className={`${styles.item} ${styles.active}`}>Project A</li>
          <li className={styles.item}>ProjectB</li>
          <li className={styles.item}>Random</li>
        </ul>
      </aside>
    </div>
  );
}
