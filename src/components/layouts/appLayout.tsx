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
import SideBar from "./sidebar";

function AppLayout({ children }: { children: JSX.Element }) {
  return (
    <Flex h="100vh">
      <SideBar p="2" />
      <Channels
        p="2"
        borderLeft={"1px"}
        borderRight={"1px"}
        borderColor={useColorModeValue("gray.800", "white")}
      />
      <Box as={"main"} flex="1" p="2">
        {children}
      </Box>
    </Flex>
  );
}

export default AppLayout;
