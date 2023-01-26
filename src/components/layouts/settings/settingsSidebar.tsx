import AppBreadcrumbs from "@/components/appBreadcrumbs";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { IoMdPerson, IoMdApps, IoMdLogOut } from "react-icons/io";
import { BsFillChatFill } from "react-icons/bs";
import { useSupabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

function SettingsSidebar({ ...props }) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Flex w={"xs"} direction="column" {...props}>
      <Stack flex="1" direction={"column"} overflow="hidden">
        <NextLink href="/chat">
          <Heading size={["sm", "md"]}>SupaChat</Heading>
        </NextLink>
        <Divider />
        <AppBreadcrumbs
          mb={2}
          p={2}
          rounded={"md"}
          bg={useColorModeValue("gray.100", "whiteAlpha.200")}
        />
        <Divider />
        <NextLink href="/settings">
          <Button justifyContent={"left"} leftIcon={<IoMdApps />} w="full">
            App Settings
          </Button>
        </NextLink>
        <NextLink href="/settings/profile">
          <Button justifyContent={"left"} leftIcon={<IoMdPerson />} w="full">
            Profile
          </Button>
        </NextLink>
        <Divider />
        <Button
          justifyContent={"left"}
          leftIcon={<BsFillChatFill />}
          w="full"
          onClick={() => {
            router.push("/chat");
          }}
        >
          Back to chat
        </Button>
        <Button
          colorScheme={"red"}
          justifyContent={"left"}
          onClick={() => {
            (async () => {
              const { error } = await supabase.auth.signOut();
              if (!error) router.reload();
            })();
          }}
          leftIcon={<IoMdLogOut />}
        >
          Log out
        </Button>
      </Stack>
    </Flex>
  );
}

export default SettingsSidebar;
