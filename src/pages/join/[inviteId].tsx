import { handleJoin } from "@/lib/helpers";
import { supabaseBeClient, useSupabase } from "@/lib/supabaseClient";
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
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GrGroup } from "react-icons/gr";
import { ResponseData } from "../api/channels/join/[inviteId]";

function Invite({ channel }: { channel: Channel }) {
  const { supabase, user, channels } = useSupabase();
  const router = useRouter();
  const toast = useToast();
  const title = !channel.name ? `Channel ${channel.id}` : channel.name;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={`Join the ${title} channel!`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`}
        />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={`Join the ${title} channel!`}
        />
        <meta property="og:image" content={channel.avatar_url ?? undefined} />

        {/* Twitter  */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`}
        />
        <meta property="twitter:title" content={title} />
        <meta
          property="twitter:description"
          content={`Join the ${title} channel!`}
        />
        <meta
          property="twitter:image"
          content={channel.avatar_url ?? undefined}
        />
      </Head>
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
          <Button
            colorScheme={"cyan"}
            w="100%"
            onClick={() =>
              handleJoin({
                router,
                user,
                toast,
                supabase,
                channel,
                channels,
              })
            }
          >
            {channel.is_private ? "Ask to join" : "Join"}
          </Button>
        </VStack>
      </Center>
    </>
  );
}

export default Invite;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const inviteId = context.params?.["inviteId"] as string;

  const { channel, error } = (await fetch(
    `http://${
      process.env.VERCEL_URL || "localhost:3000"
    }/api/channels/join/${inviteId}`
  ).then((res) => res.json())) as ResponseData;

  if (error || !channel) {
    return {
      notFound: true,
    };
  }

  return {
    props: { channel },
  };
};
