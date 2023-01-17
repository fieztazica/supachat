import { useProfile } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Stack,
  Text,
  Link,
  useColorMode,
  Divider,
  Switch,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import React, { useEffect } from "react";

const Home = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const toast = useToast();
  const profile = useProfile();

  useEffect(() => {
    if (!!profile) {
      toast({
        status: "info",
        title: `We found you, ${profile.full_name}!`,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex as={Container} direction="column" h="100vh">
      <Stack h="$100vh" justifyContent="center">
        <Center>
          <Heading size={"4xl"} mb={4}>
            SupaChat
          </Heading>
        </Center>
        <NextLink href={"/chat"}>
          <Button colorScheme={"cyan"} w="full">
            Hang in
          </Button>
        </NextLink>
        <Divider />
        <Center>
          <Text fontSize={"sm"}>
            Powered by{" "}
            <Link href={"https://vercel.com/"} isExternal>
              Vercel
            </Link>{" "}
            and{" "}
            <Link href={"https://supabase.com"} isExternal>
              Supabase
            </Link>
          </Text>
        </Center>
        <Center>
          <Text fontSize={"sm"}>
            Made with{" "}
            <Link href={"https://nextjs.org/"} isExternal>
              Next.js
            </Link>{" "}
            and{" "}
            <Link href={"https://chakra-ui.com/"} isExternal>
              Chakra UI
            </Link>
          </Text>
        </Center>
      </Stack>
      <Center flex="1" p={4}>
        <Switch
          colorScheme={"cyan"}
          size="lg"
          isChecked={colorMode === "light" ? false : true}
          onChange={toggleColorMode}
        />
      </Center>
    </Flex>
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
    title: "SupaChat | Home",
  },
};
