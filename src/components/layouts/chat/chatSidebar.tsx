import { useSupabase } from "@/lib/supabaseClient";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Fade,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToken,
} from "@chakra-ui/react";
import { useTheme } from "@emotion/react";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";
import { useRef } from "react";
import NextLink from "next/link";
import SidebarMenu from "../../sidebarMenu";
import SideBarButton from "../../sidebarButton";
import AvatarStatus from "../../avatarStatus";
import Channels from "../channels";
import OnlineUsers from "@/components/onlineUsers";
import CreateChannelButton from "@/components/createChannelButton";

function ChatSideBar({ ...props }) {
  const {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    getButtonProps,
    getDisclosureProps,
  } = useDisclosure({ defaultIsOpen: true });
  const { profile } = useSupabase();
  const { toggleColorMode, colorMode } = useColorMode();
  // const searchRef = useRef();

  function handleSearchIconClick() {
    onOpen();
  }

  return (
    <Flex w={isOpen ? "sm" : "full-content"} direction="column" {...props}>
      <Stack flex="1" direction={"column"} overflow="hidden">
        <NextLink href="/chat">
          <Heading size={["xs", "md"]}>SupaChat</Heading>
        </NextLink>
        <Divider />
        <InputGroup pr={1}>
          <InputLeftElement pointerEvents="none">🔍</InputLeftElement>
          <Input placeholder="Search" />
        </InputGroup>
        <HStack align={"center"}>
          <Heading size={["md", "sm"]}>Channels</Heading>
          <CreateChannelButton />
        </HStack>
        <Channels pr={1} />
      </Stack>
      <Divider mt={2} />
      <Flex
        direction={isOpen ? "row" : "column"}
        justifyContent={"space-between"}
        align="center"
        mt={2}
      >
        <SidebarMenu />
      </Flex>
    </Flex>
  );
}

export default ChatSideBar;
