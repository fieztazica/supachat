import ChannelRightBar from "@/components/channelRightBar";
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

function Channel({ activeChannel, ...props }: { activeChannel: Channel }) {
  const RightBarState = useDisclosure({ defaultIsOpen: true });
  const { user, supabase, channels } = useSupabase();
  

  if (!user) return null;

  const channel = channels.find((c) => c.id === activeChannel.id);

  if (!channel) return null;

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
          <ChannelRightBar channel={channel}/>
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
