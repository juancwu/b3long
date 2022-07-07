import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const session = useSession();

  if (session.status === "loading") return null;

  return (
    <div className={styles.container}>
      {session.status === "unauthenticated" ? (
        <button onClick={() => signIn()}>sign in</button>
      ) : (
        <button onClick={() => signOut({ callbackUrl: "/" })}>sign out</button>
      )}
    </div>
  );
};

export default Home;
