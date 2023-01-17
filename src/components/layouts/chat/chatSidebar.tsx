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
          <Heading size={["sm", "md"]} hidden={!isOpen}>
            SupaChat
          </Heading>
        </NextLink>
        <Divider />
        <InputGroup hidden={!isOpen}>
          <InputLeftElement pointerEvents="none">🔍</InputLeftElement>
          <Input placeholder="Search" />
        </InputGroup>
        {isOpen && (
          <Box overflow={"auto"} maxH={"$100vh"} flex="1" rounded="md" pr={1}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (n, i) => (
                <NextLink key={i} href={`/chat/${i}`}>
                  <Button
                    as={Card}
                    maxH={"md"}
                    // w="full"
                    display="block"
                    // bg="tomato"
                    rounded="md"
                    mt={1}
                    mb={1}
                    p={2}
                    justifyItems="center"
                    justifyContent={"center"}
                    direction="row"
                    variant={"ghost"}
                  >
                    <Text>{i}</Text>
                  </Button>
                </NextLink>
              )
            )}
          </Box>
        )}
      </Stack>
      <Divider mt={2} />
      <Flex
        direction={isOpen ? "row" : "column"}
        justifyContent={"space-between"}
        align="center"
        mt={2}
      >
        <SidebarMenu isExpanded={isOpen}></SidebarMenu>
      </Flex>
    </Flex>
  );
}

export default ChatSideBar;
