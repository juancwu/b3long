import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import * as d3 from "d3";

const Graph: NextPage = () => {
  const session = useSession();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasGraph = useState(false);

  const signOutCallback = useCallback(() => {
    signOut({
      callbackUrl: "/",
    });
  }, []);

  if (session.status === "loading") return null;

  if (session.status === "unauthenticated") {
    router.push("/");
    return null;
  }

  useEffect(() => {
    if (!hasGraph) {
    }
  }, []);

  return (
    <div className="w-full h-full">
      <header>
        <nav className={`bg-blue-400 p-6 flex items-center justify-between`}>
          <span className={`uppercase text-gray-50 font-bold`}>B3LONG</span>
          <button
            onClick={signOutCallback}
            className={`p-3 bg-yellow-400 rounded-md`}
          >
            Sign Out
          </button>
        </nav>
      </header>
      <div ref={containerRef}></div>
    </div>
  );
};

export default Graph;
