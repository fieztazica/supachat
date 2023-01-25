import { useSupabase } from "@/lib/supabaseClient";
import { Channel } from "@/types";
import { Database } from "@/types/supabase";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GrGroup } from "react-icons/gr";

function Invite({ channel }: { channel: Channel }) {
  const { supabase, user, channels } = useSupabase();

  const router = useRouter();
  const toast = useToast();

  const handleJoin = () => {
    (async () => {
      if (!user || !supabase) return router.push("/chat");
      if (!!channels.includes(channel))
        return router.push(`/chat/${channel.id}`);

      const { data: isExist, error: existError } = await supabase
        .from("members")
        .select()
        .eq("channel_id", channel.id)
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (existError || !isExist) {
        const { error: insertError } = await supabase.from("members").insert([
          {
            channel_id: channel.id,
            user_id: user.id,
            is_joined: channel.is_private ? false : true,
            joined_at: channel.is_private ? null : new Date().toISOString(),
          },
        ]);

        if (insertError) {
          console.error(insertError);
          toast({
            title: `${insertError.message}`,
            status: "error",
            description: `${insertError.details}`,
          });
        } else {
          if (channel.is_private) {
            toast({
              title: `Asked!`,
              status: "success",
            });
          } else {
            router.push(`/chat/${channel.id}`);
          }
        }
      }

      if (isExist) {
        if (isExist.is_joined) {
          router.push(`/chat/${channel.id}`);
        } else {
          toast({
            title: `You have already asked!`,
            status: "error",
          });
        }
      }
    })();
  };

  return (
    <Center h="100vh">
      <VStack>
        <Avatar
          size={"2xl"}
          rounded="full"
          icon={<GrGroup />}
          src={channel.avatar_url || undefined}
        />
        <HStack spacing={1}>
          <Text>You are about to join</Text>
          <Text fontWeight="bold">{channel.name ?? channel.id}</Text>
        </HStack>
        <Divider />
        <Button colorScheme={"cyan"} w="100%" onClick={handleJoin}>
          {channel.is_private ? "Ask to join" : "Join"}
        </Button>
      </VStack>
    </Center>
  );
}

export default Invite;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const supabase = await createServerSupabaseClient<Database>(context);

  // const sUser = await supabase.auth.getUser();

  // if (!sUser.data.user) {
  //   return {
  //     redirect: {
  //       destination: "/chat",
  //       permanent: false,
  //     },
  //   };
  // }

  const inviteId = context.params?.["inviteId"] as string;

  const { data: channel, error } = await supabase
    .from("channels")
    .select()
    .eq(`vanity_url`, inviteId)
    .limit(1)
    .single();

  if (error || !channel) {
    return {
      notFound: true,
    };
  }

  return {
    props: { channel },
  };
};
