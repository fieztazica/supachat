import ChatLayout from "@/components/layouts/chat/chatLayout";
import ProtectedRoute from "@/lib/auth/ProtectedRoute";
import { Channel } from "@/types";
import { Database } from "@/types/supabase";
import { Box, Text } from "@chakra-ui/react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

function Channel({ channel, ...props }: { channel: Channel }) {
  // const router = useRouter();
  return (
    <>
      <Head>
        <title>SupaChat | {channel?.id}</title>
      </Head>
      <Box p={10}>
        <Text>You select channel {channel?.id}</Text>
      </Box>
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
