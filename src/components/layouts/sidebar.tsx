import { useSupabase } from "@/lib/supabaseClient";
import { Profile } from "@/types";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Fade,
  Flex,
  Heading,
  HStack,
  IconButton,
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
import { MdDarkMode, MdLightMode } from "react-icons/md";

function AvatarStatus({ profile, ...props }: { profile?: Profile }) {
  return (
    <Avatar
      size="sm"
      name={profile?.full_name!}
      src={profile?.avatar_url || undefined}
      {...props}
    >
      <AvatarBadge
        boxSize="3"
        bg="green.500"
        // border="1px"
        // borderColor={useColorModeValue("white", "gray.800")}
      />
    </Avatar>
  );
}

function SideBarButton({
  isOpen,
  children,
  icon,
  ariaLabel,
  ...props
}: {
  icon: JSX.Element;
  isOpen: boolean;
  ariaLabel: string;
  children: JSX.Element;
}) {
  return (
    <>
      {isOpen ? (
        <Button variant={"ghost"} leftIcon={icon} p={2} {...props}>
          {children}
        </Button>
      ) : (
        <IconButton
          aria-label={ariaLabel}
          variant={"ghost"}
          hidden={isOpen}
          icon={icon}
          {...props}
        />
      )}
    </>
  );
}

function SideBar({ ...props }) {
  const {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    getButtonProps,
    getDisclosureProps,
  } = useDisclosure();
  const { profile } = useSupabase();
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Flex w={isOpen ? "2xs" : "full-content"} direction="column" {...props}>
      <Stack flex="1" direction={"column"} overflow="hidden">
        <Heading size={["sm", "md"]} hidden={!isOpen}>
          SupaChat
        </Heading>
        <IconButton
          aria-label="Color Mode Button"
          icon={colorMode === "light" ? <MdDarkMode /> : <MdLightMode />}
          onClick={toggleColorMode}
          variant={"ghost"}
        />
        <Box overflow={"auto"} maxH={"$100vh"} flex="1" rounded="md" pr={1}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
            (n, i) => (
              <Box
                key={i}
                height={"50px"}
                bg="tomato"
                rounded="md"
                mt={1}
                mb={1}
                p={2}
                justifyItems="center"
                justifyContent={"center"}
              >
                <Text>{i}</Text>
              </Box>
            )
          )}
        </Box>
      </Stack>
      <Flex
        direction={isOpen ? "row" : "column"}
        justifyContent={"space-between"}
        align="center"
        mt={2}
      >
        {isOpen ? (
          <Button
            variant={"ghost"}
            leftIcon={<AvatarStatus profile={profile!} />}
            p={2}
          >
            <Text>{profile?.full_name}</Text>
          </Button>
        ) : (
          <IconButton
            aria-label="Profile Button"
            variant={"ghost"}
            hidden={isOpen}
            icon={<AvatarStatus profile={profile!} />}
          />
        )}
        <IconButton
          aria-label="expand sidebar"
          variant={"ghost"}
          icon={
            isOpen ? (
              <TbLayoutSidebarRightExpand />
            ) : (
              <TbLayoutSidebarLeftExpand />
            )
          }
          onClick={onToggle}
          {...getButtonProps()}
        />
      </Flex>
    </Flex>
  );
}

export default SideBar;
