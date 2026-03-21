import Link from "next/link";
import styles from "./styles/not-found.module.scss";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.eyebrow}>Lost Route</div>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>요청하신 페이지를 찾을 수 없습니다.</h1>
        <p className={styles.description}>
          주소가 잘못 입력되었거나, 이동 중인 페이지일 수 있습니다. 로그인 후
          채팅으로 돌아가거나 첫 화면에서 다시 시작해 주세요.
        </p>

        <div className={styles.actions}>
          <Link href="/login" className={styles.primaryButton}>
            로그인으로 이동
          </Link>
          <Link href="/chat" className={styles.secondaryButton}>
            채팅으로 이동
          </Link>
        </div>

        <p className={styles.note}>
          AF Agent Frontend not-found page
        </p>
      </section>
    </main>
  );
}
