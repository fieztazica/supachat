import Chat from "@/components/chat";
import ChatInput from "@/components/chatInput";
import ChatLayout from "@/components/layouts/chat/chatLayout";
import Messages from "@/components/messages";
import OnlineUsers from "@/components/onlineUsers";
import ProtectedRoute from "@/lib/auth/ProtectedRoute";
import { useSupabase } from "@/lib/supabaseClient";
import { Channel } from "@/types";
import { Database } from "@/types/supabase";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MdInfoOutline } from "react-icons/md";

function Channel({ channel, ...props }: { channel: Channel }) {
  const RightBarState = useDisclosure({ defaultIsOpen: true });
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
            <Text>
              {!channel.name ? `Channel ${channel.id}` : channel.name}
            </Text>
            <IconButton
              variant={"ghost"}
              fontSize="2xl"
              aria-label="Show Box Chat Info Button"
              icon={<MdInfoOutline />}
              onClick={RightBarState.onToggle}
            />
          </Flex>
          <Chat channel={channel} />
        </Flex>
        {RightBarState.isOpen && (
          <Box p={2} borderLeft={"1px"} w="xs" maxW="xs" overflow={"auto"}>
            <Avatar />
            {/* <OnlineUsers channelId={channel.id}/> */}
          </Box>
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

// Channel.defaultProps = {
//   meta: {
//     title: "SupaChat | Chat",
//   },
// };

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

  const { data: channel } = await supabase
    .from("channels")
    .select()
    .eq("id", context.params?.["channelId"])
    .limit(1)
    .single();

  if (!channel) {
    return {
      notFound: true,
    };
  }

  return {
    props: { channel },
  };
};

/**
 * ProtectedRoute({
    context,
    redirectTo: "/login",
    getPropsFunc: async ({ context, user, supabase }) => {
      if (context && supabase) {
        // const supabase = await createServerSupabaseClient<Database>(context);
        const { params } = context;
        const { data, error } = await supabase
          .from("channels")
          .select()
          .eq("id", params?.["channelId"])
          .limit(1)
          .single();

        if (error) return {};
        if (data) {
          return { channel: data };
        } else throw new Error("No Data");
      } else return {};
    },
  });
 */
