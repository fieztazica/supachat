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

function AppLayout({
  children,
  sidebar,
}: {
  children: JSX.Element;
  sidebar: JSX.Element;
}) {
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
