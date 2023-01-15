import { useSupabase } from "@/lib/supabaseClient";
import { Box, Button, Container, Text, useColorMode } from "@chakra-ui/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import React from "react";

const Home = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { currentUser, session, supabase } = useSupabase();

  console.log(currentUser)

  return (
    <Container>
      <Text>{currentUser?.full_name}</Text>
      <Text>Chat Thoi Nao</Text>
      <Button onClick={toggleColorMode}>{colorMode as string}</Button>
      <NextLink href={"/chat"}>
        <Button>Go Chat</Button>
      </NextLink>
    </Container>
  );
};

// export const getServerSideProps: GetServerSideProps = async (
//   ctx: GetServerSidePropsContext
// ) => {
//   const supabase = await createServerSupabaseClient(ctx);

//   const { data, error } = await supabase.auth.getSession();

//   if (error) {
//     throw new Error(error.message);
//   }

//   if (!data.session)
//     return {
//       props: {},
//     };

//   return {
//     redirect: {
//       destination: "/chat",
//       permanent: false,
//     },
//   };
// };

export default Home;
