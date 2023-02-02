import { useSupabase } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Stack,
  Text,
  Link,
  Icon,
  useColorMode,
  Divider,
  Switch,
  Flex,
} from "@chakra-ui/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa";

const Home = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const { profile, supabase } = useSupabase();

  // useEffect(() => {
  //   supabase.auth.onAuthStateChange(async (event, session) => {
  //     console.log("HOME",event);
  //     if (event == "PASSWORD_RECOVERY") {
  //       console.log("HOME PASSWORD_RECOVERY", session);
  //       // const newPassword =
  //       //   prompt("What would you like your new password to be?") || undefined;
  //       // const { data, error } = await supabase.auth.updateUser({
  //       //   password: newPassword,
  //       // });

  //       // if (data) alert("Password updated successfully!");
  //       // if (error) alert("There was an error updating your password.");
  //     }
  //   });

  //   // console.log(localStorage.getItem("chakra-ui-color-mode"))
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
            Hang in{!!profile && `, ${profile?.full_name}!`}
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
        <Stack direction={["column-reverse", "row"]} align="center">
          <Switch
            colorScheme={"cyan"}
            size="lg"
            isChecked={colorMode === "light" ? false : true}
            onChange={toggleColorMode}
          />
          <Link
            display={"flex"}
            isExternal
            href={"https://github.com/fiezt1492/chat-app-supabase"}
            alignSelf="center"
          >
            <Icon as={FaGithub} boxSize={[10, 7]} />
          </Link>
        </Stack>
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
    title: "SupaChat",
  },
};
