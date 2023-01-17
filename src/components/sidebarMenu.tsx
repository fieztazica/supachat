import { useSupabase } from "@/lib/supabaseClient";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Text,
  forwardRef,
  BoxProps,
  ButtonProps,
  IconButton,
  Box,
  Flex,
  Stack,
} from "@chakra-ui/react";
import AvatarStatus from "./avatarStatus";
import SideBarButton from "./sidebarButton";
import { IoMdPerson, IoMdSettings, IoMdLogOut } from "react-icons/io";
import NextLink from "next/link";
import { useRouter } from "next/router";

// const RefSidebarButton = forwardRef<ButtonProps, "button">((props, ref) => (
//   <SideBarButton ref={ref} {...props} />
// ));

function SidebarMenu({ isExpanded }: { isExpanded: boolean }) {
  const { profile, supabase } = useSupabase();
  const router = useRouter();

  return (
    <Menu>
      <MenuButton
        as={!!isExpanded ? Button : IconButton}
        variant={"ghost"}
        // leftIcon={!!isExpanded && <AvatarStatus profile={profile!} />}
        // icon={!isExpanded && <AvatarStatus profile={profile!} />}
        isOpen={!!isExpanded}
        ariaLabel={"Menu Button"}
        aria-label="Menu Button"
        w="100%"
        size="lg"
        pl={2}
        pr={2}
      >
        <Stack direction={"row"} align="center">
          <AvatarStatus profile={profile!} />
          <Stack
            direction={"column"}
            spacing={"0"}
            overflow={"hidden"}
          >
            <Text align={"left"}>{profile?.full_name}</Text>
            <Text
              align={"left"}
              fontSize={"xs"}
              fontWeight={"thin"}
              color={"gray.500"}
            >
              @{profile?.username || "unknown"}
            </Text>
          </Stack>
        </Stack>
      </MenuButton>
      <MenuList>
        <MenuGroup>
          <MenuItem
            icon={<IoMdPerson />}
            as={NextLink}
            href="/settings/profile"
          >
            Profile
          </MenuItem>
          <MenuItem icon={<IoMdSettings />} as={NextLink} href="/settings">
            Settings
          </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup>
          <MenuItem
            icon={<IoMdLogOut />}
            onClick={() => {
              (async () => {
                const { error } = await supabase.auth.signOut();
                if (!error) router.reload();
              })();
            }}
          >
            Log out
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}

export default SidebarMenu;
