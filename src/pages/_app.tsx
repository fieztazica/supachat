// import '@/styles/globals.css'
import type { AppProps } from "next/app";
import { useEffect } from "react";
import {
  ChakraProvider,
  Fade,
  Progress,
  useDisclosure,
} from "@chakra-ui/react";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import type { NextPage } from "next";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { Url } from "url";
import { Database } from "@/types/supabase";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  const indicator = useDisclosure();
  const router = useRouter();

  const pageMeta = (Component as any)?.defaultProps?.meta || {};
  const pageSEO = { ...SEO, ...pageMeta };
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    const handleStart = (url: Url) => {
      console.log(`Loading: ${url}`);
      indicator.onOpen();
    };

    const handleStop = () => {
      indicator.onClose();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo {...pageSEO} />
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ChakraProvider>
          <Fade in={indicator.isOpen}>
            <Progress
              colorScheme={"cyan"}
              height="2px"
              flex={1}
              position="fixed"
              zIndex={"99"}
              isIndeterminate
              w="100%"
            />
          </Fade>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </SessionContextProvider>
    </>
  );

  // return (
  //   <SessionContextProvider
  //     supabaseClient={supabase}
  //     initialSession={pageProps.initialSession}
  //   >
  //     <ChakraProvider>
  //       <Component {...pageProps} />
  //     </ChakraProvider>
  //   </SessionContextProvider>
  // );
}
