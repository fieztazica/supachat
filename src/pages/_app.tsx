// import '@/styles/globals.css'
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { NextPage } from "next";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <ChakraProvider>{getLayout(<Component {...pageProps} />)}</ChakraProvider>
    </SessionContextProvider>
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
