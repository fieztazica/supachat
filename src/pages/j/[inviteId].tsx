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
  VStack,
} from "@chakra-ui/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useEffect } from "react";
import { GrGroup } from "react-icons/gr";

function Invite({ channel }: { channel: Channel }) {
  const { supabase, user } = useSupabase();
  const handleJoin = () => {};

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
          <Text fontWeight="bold">{channel.name || channel.id}</Text>
        </HStack>
        <Divider />
        <Button colorScheme={"cyan"} w="100%">
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

  const sUser = await supabase.auth.getUser();

  if (!sUser.data.user) {
    return {
      redirect: {
        destination: "/chat",
        permanent: false,
      },
    };
  }

  const inviteId = context.params?.["inviteId"] as string;

  const { data, error } = await supabase
    .from("channels")
    .select()
    .eq(`vanity_url`, inviteId)
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

  const membersData = await supabase
    .from("members")
    .select()
    .eq("channel_id", channel.id)
    .eq("user_id", sUser.data.user.id)
    .limit(1)
    .single();

  if (membersData.data) {
    return {
      redirect: {
        destination: `/chat/${channel.id}`,
        permanent: false,
      },
    };
  }

  return {
    props: { channel },
  };
};
