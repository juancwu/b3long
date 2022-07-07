import type { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  LiteralUnion,
  signIn,
  useSession,
} from "next-auth/react";
import { useCallback, useState } from "react";
import Loader from "../components/loader";
import NavBar from "../components/navbar";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    context.res.writeHead(302, { location: "/graph" });
    context.res.end();
    return {
      props: {},
    };
  }

  const providers = await getProviders();
  return {
    props: {
      providers,
      hasSession: !!session,
    },
  };
};

interface HomePageProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
  hasSession: boolean;
}

const Home: NextPage<HomePageProps> = ({ providers, hasSession }) => {
  const [isLoading, setIsLoading] = useState(false);
  const signInCallback = useCallback(() => {
    setIsLoading(true);
    signIn(providers.discord.id, {
      callbackUrl: "/graph",
    });
  }, []);

  return (
    <div className={`bg-white flex flex-col h-full w-full`}>
      <header className={`relative`}>
        <NavBar isLogged={hasSession} signInCallback={signInCallback} />
      </header>
      <main className={`mx-auto mt-16 w-full`}>
        <div className="flex items-center justify-center flex-col">
          <h1
            className={`text-dark font-bold text-4xl md:text-5xl px-3 lg:px-0 capitalize text-left`}
          >
            View Your Discord Communities In Bubbles.
          </h1>
          <p className={`text-gray text-left text-lg w-4/5 md:w-1/2 mt-6`}>
            <strong className={`inline-block text-dark font-bold`}>
              Discord
            </strong>{" "}
            is not just any other app use for{" "}
            <strong className={`inline-block text-dark font-bold`}>
              social interactions
            </strong>{" "}
            over the Internet. Over the years, Discord{" "}
            <strong className="inline-block text-dark font-bold">
              servers
            </strong>{" "}
            had become something bigger. They are the{" "}
            <strong className={`inline-block text-dark font-bold`}>
              communities
            </strong>{" "}
            that you can be, frankly,{" "}
            <strong className={`inline-block text-dark font-bold`}>you</strong>.
          </p>
        </div>
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={signInCallback}
            className={`px-6 py-4 bg-strong-pink font-bold text-lg text-white rounded-md grow-0 shrink-0`}
          >
            Start Now
          </button>
        </div>
      </main>
      {isLoading ? <Loader /> : null}
    </div>
  );
};

export default Home;
