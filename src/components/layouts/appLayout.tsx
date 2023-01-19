import {
  Box,
  Flex,
  Grid,
  GridItem,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Channels from "./channels";
import SideBar from "./chat/chatSidebar";
import { useEffect } from "react";
import { useSupabase } from "@/lib/supabaseClient";

function AppLayout({
  children,
  sidebar,
}: {
  children: JSX.Element;
  sidebar: JSX.Element;
}) {
  const { supabase, user } = useSupabase();
  useEffect(() => {
    if (!user) return;

    const onlineChannel = supabase.channel("online", {
      config: {
        presence: {
          key: `${user?.id}`,
        },
      },
    });

    document.addEventListener("keydown", function (event) {
      onlineChannel.track({ isTyping: Date.now() });
    });

    onlineChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        onlineChannel.track({
          online_at: new Date().toISOString(),
        });
      }
    });
    return () => {
      onlineChannel.untrack();
    };
  }, [user, supabase]);
  return (
    <Flex h="100vh" w="100vw" maxH="100vh">
      <Box>{sidebar}</Box>
      <Box as={"main"} flex="1">
        {children}
      </Box>
    </Flex>
  );
}

export default AppLayout;
