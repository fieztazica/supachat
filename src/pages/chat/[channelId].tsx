import ChatLayout from "@/components/layouts/chat/chatLayout";
import ProtectedRoute from "@/lib/auth/ProtectedRoute";
import { Box, Text } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

function Channel() {
  const router = useRouter();
  const { channelId } = router.query;
  return (
    <>
      <Head>
        <title>SupaChat | {channelId}</title>
      </Head>
      <Box>
        <Text>{channelId}</Text>
      </Box>
    </>
  );
}

export default Channel;

// Channel.defaultProps = {
//   meta: {
//     title: "SupaChat | Chat",
//   },
// };

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
  ) => ProtectedRoute({ context, redirectTo: "/login" });

Channel.getLayout = function getLayout(page: JSX.Element) {
  return <ChatLayout>{page}</ChatLayout>;
};
