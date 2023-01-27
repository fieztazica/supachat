import { useSupabase } from "@/lib/supabaseClient";
import { Channel } from "@/types";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Link,
  Tag,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { CgCornerUpLeft } from "react-icons/cg";
import ChangeChannelAvatarButton from "./changeChannelAvatarButton";
import ChangeChannelNameButton from "./changeChannelNameButton";
import ChannelAvatar from "./channelAvatar";
import ManageMembersModal from "./manageMembersModal";
import ManageNicknamesModal from "./manageNicknamesModal";

function ChannelRightBar({ channel, ...props }: { channel: Channel }) {
  const { user, supabase } = useSupabase();
  const toast = useToast();
  const router = useRouter();
  const borderColor = useColorModeValue("gray.200", "gray.700")

  if (!user) return null;

  const togglePublicity = () => {
    (async () => {
      const { error } = await supabase
        .from("channels")
        .update({ is_private: !channel.is_private })
        .eq("id", channel.id)
        .eq("owner_id", user.id);

      if (error) {
        console.error(error);
        toast({ title: `${error.message}`, status: "error" });
      } else {
        toast({ title: `Succeed!`, status: "success" });
      }
    })();
  };

  const handleLeaveChannel = () => {
    (async () => {
      const leave = async (deleteChannel: boolean = false) => {
        const leaveMemberRes = await supabase
          .from("members")
          .delete()
          .eq("channel_id", channel.id)
          .eq("user_id", user.id);

        if (!!leaveMemberRes.error) {
          console.error(leaveMemberRes.error);
          toast({
            title: "Leave failed!",
            description: `${leaveMemberRes.error.message}`,
            status: "error",
          });
        } else {
          if (deleteChannel)
            await supabase.from("channels").delete().eq("id", channel.id);
          router.push("/chat");
        }
      };

      // Whether the user is owner
      if (user.id === channel.owner_id) {
        // Check if the channel has more than 1 member
        const checkChannelMembersRes = await supabase
          .from("members")
          .select("*", { count: "exact", head: true })
          .eq("channel_id", channel.id);

        if (!!checkChannelMembersRes.count) {
          if (checkChannelMembersRes.count > 1) {
            const replaceOwnerRes = await supabase
              .from("members")
              .select("user_id")
              .neq("user_id", user.id)
              .eq("channel_id", channel.id)
              .limit(1)
              .single();

            await supabase
              .from("channels")
              .update({ owner_id: replaceOwnerRes.data?.user_id })
              .eq("id", channel.id);

            leave();
          }
          // If the channel has only 1 or less than 1 member do leave with delete channel
          else leave(true);
        }

        if (!!checkChannelMembersRes.error) {
          console.error(checkChannelMembersRes.error);
          toast({
            title: "Leave failed!",
            description: `${checkChannelMembersRes.error.message}`,
            status: "error",
          });
        }
      }
      //If not owner do a normal leave
      else leave();
    })();
  };

  // const retrieveChannelAvatarURL = async (avatar_url: string | null) => {
  //   try {
  //     if (!avatar_url) return undefined;

  //     if (!!new URL(avatar_url)) return avatar_url;

  //     const { data, error } = await supabase.storage
  //       .from("avatars")
  //       .download(avatar_url);

  //     if (error) {
  //       throw error;
  //     }

  //     const url = URL.createObjectURL(data);
  //     return url;
  //   } catch (error) {
  //     console.log("Error downloading image: ", error);
  //   }
  // };

  return (
    <Flex
      direction={"column"}
      borderLeft={"1px"}
      borderColor={borderColor}
      minW="xs"
      maxW="xs"
      maxH={"$100vh"}
      {...props}
    >
      <Box w="$100vw" overflow={"auto"} p={4}>
        <VStack minW="$100vw">
          {/* <ChannelAvatar channel={channel} /> */}
          <Avatar src={channel.avatar_url ?? undefined} as={Link} href={channel?.avatar_url} isExternal />
          <Text>{channel.name ?? channel.id}</Text>
          <Tag colorScheme={channel.is_private ? "purple" : "cyan"}>
            {channel.is_private ? `Private` : `Public`}
          </Tag>
          <Divider />

          {channel.owner_id === user.id && (
            <>
              <ChangeChannelNameButton channel={channel} />
              <ChangeChannelAvatarButton channel={channel} />
              <Button w="100%" onClick={togglePublicity}>
                {channel.is_private
                  ? "Open channel to public"
                  : "Make channel private"}
              </Button>
            </>
          )}
          <ManageMembersModal channel={channel} />
          <ManageNicknamesModal channel={channel} />
          <Divider />
          <Button
            leftIcon={<CgCornerUpLeft />}
            colorScheme={"red"}
            w="100%"
            onClick={handleLeaveChannel}
          >
            Leave channel
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}

export default ChannelRightBar;
