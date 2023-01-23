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
  VStack,
} from "@chakra-ui/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MdInfoOutline } from "react-icons/md";
import { CgCornerUpLeft } from "react-icons/cg";

function Channel({ channel, ...props }: { channel: Channel }) {
  const RightBarState = useDisclosure({ defaultIsOpen: true });
  const { user } = useSupabase();
  if (!user) return null;

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
          <Box p={2}>
            <ChatInput userId={user.id} channelId={channel.id} />
          </Box>
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
                <Avatar />
                <Text>{channel.name || channel.id}</Text>
                <Tag colorScheme={channel.is_private ? "purple" : "cyan"}>
                  {channel.is_private ? `Private` : `Public`}
                </Tag>
                <Divider />
                <Button w="100%">Change channel avatar</Button>
                <Button w="100%">Change user&#39;s nickname</Button>
                <Button w="100%">
                  {channel.is_private
                    ? "Open channel to public"
                    : "Make channel private"}
                </Button>
                <Divider />
                <Button
                  leftIcon={<CgCornerUpLeft />}
                  colorScheme={"red"}
                  w="100%"
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

  const channelId = context.params?.["channelId"];

  const { data, error } = await supabase
    .from("channels")
    .select(`*`)
    .eq("id", channelId)
    .limit(1)
    .single();

  if (error || !data) {
    return {
      notFound: true,
    };
  }

  const channel = data as Channel;

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
