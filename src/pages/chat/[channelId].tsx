import ChatLayout from "@/components/layouts/chat/chatLayout";
import Messages from "@/components/messages";
import OnlineUsers from "@/components/onlineUsers";
import { useSupabase } from "@/lib/supabaseClient";
import { Channel } from "@/types";
import { Database } from "@/types/supabase";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Tag,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MdInfoOutline } from "react-icons/md";
import { CgCornerUpLeft } from "react-icons/cg";

function Channel({ activeChannel, ...props }: { activeChannel: Channel }) {
  const RightBarState = useDisclosure({ defaultIsOpen: true });
  const { user, supabase, channels } = useSupabase();
  const toast = useToast();
  const router = useRouter();

  if (!user) return null;

  const channel = channels.find((c) => c.id === activeChannel.id);

  if (!channel) return null;

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
      }
    })();
  };

  return (
    <>
      <Head>
        <title>
          SupaChat | {!channel.name ? `Channel ${channel.id}` : channel.name}
        </title>
      </Head>
      <Flex w="$100vw">
        <Flex direction={"column"} h="$100vh" flex="1">
          <Flex
            align={"center"}
            p={2}
            justifyContent={"space-between"}
            borderBottom={"1px"}
          >
            <Heading size="md">
              {!channel.name ? `Channel ${channel.id}` : channel.name}
            </Heading>
            <IconButton
              variant={"ghost"}
              fontSize="2xl"
              aria-label="Show Box Chat Info Button"
              icon={<MdInfoOutline />}
              onClick={RightBarState.onToggle}
            />
          </Flex>
          <Messages channelId={channel.id} />
        </Flex>
        {RightBarState.isOpen && (
          <Flex
            direction={"column"}
            borderLeft={"1px"}
            minW="xs"
            maxW="xs"
            maxH={"$100vh"}
          >
            <Box w="$100vw" overflow={"auto"} p={4}>
              <VStack minW="$100vw">
                <Avatar src={channel.avatar_url ?? undefined} />
                <Text>{channel.name ?? channel.id}</Text>
                <Tag colorScheme={channel.is_private ? "purple" : "cyan"}>
                  {channel.is_private ? `Private` : `Public`}
                </Tag>
                <Divider />
                <Button w="100%">Change channel avatar</Button>
                <Button w="100%">Manage members</Button>
                <Button w="100%">Manage nicknames</Button>
                {channel.owner_id === user.id && (
                  <Button w="100%" onClick={togglePublicity}>
                    {channel.is_private
                      ? "Open channel to public"
                      : "Make channel private"}
                  </Button>
                )}
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
        )}
      </Flex>
    </>
  );
}

// @ts-ignore
Channel.getLayout = function getLayout(page: React.ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Channel;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const supabase = await createServerSupabaseClient<Database>(context);

  const sUser = await supabase.auth.getUser();

  if (!sUser.data.user) {
    return {
      redirect: {
        destination: "/chat",
        permanent: false,
      },
    };
  }

  const channelId = context.params?.["channelId"];

  const { data: checkJoinData } = await supabase
    .from("members")
    .select("*, channel:channels(*)")
    .eq("channel_id", channelId)
    .eq("user_id", sUser.data.user.id)
    .eq("is_joined", true)
    .limit(1)
    .single();

  // console.log(checkJoinData);

  if (!checkJoinData)
    return {
      notFound: true,
    };

  const channel = checkJoinData?.channel as Channel;

  return {
    props: { activeChannel: channel },
  };
};
