import { Box, Button, Container, Text, useColorMode } from "@chakra-ui/react";
import { useSession } from "@supabase/auth-helpers-react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Home = () => {
  const session = useSession();

  const router = useRouter();

  const { toggleColorMode, colorMode } = useColorMode();

  useEffect(() => {
    if (!!session) router.push("/chat");
  });

  return (
    <Container>
      <Text>Chat Thoi Nao</Text>
      <Button onClick={toggleColorMode}>{colorMode as string}</Button>
      <NextLink href={"/chat"}>
        <Button>Go Chat</Button>
      </NextLink>
    </Container>
  );
};

export default Home;
