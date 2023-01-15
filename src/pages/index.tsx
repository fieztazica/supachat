import { useProfile } from "@/lib/supabaseClient";
import { Box, Button, Container, Text, useColorMode } from "@chakra-ui/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import React from "react";

const Home = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const profile  = useProfile();

  return (
    <Container>
      <Text>{profile?.full_name}</Text>
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

Home.defaultProps = {
  meta: {
    title: 'SupaChat | Home',
  },
}
