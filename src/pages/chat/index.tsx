import Theme from "@chakra-ui/theme";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
// import { supabase, useSupabase } from "@/lib/supabaseClient";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Text,
} from "@chakra-ui/react";
import {
  User,
  Session,
  AuthUser,
  RealtimePresenceState,
} from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSupabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import ProtectedRoute from "@/lib/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import OnlineUsers from "@/components/onlineUsers";
import AppLayout from "@/components/layouts/appLayout";
import ChatLayout from "@/components/layouts/chat/chatLayout";

const Chat = ({ user }: { user: User }) => {
  const { supabase } = useSupabase();
  const router = useRouter();

  return (
    <Center h="$100vh">
      <Text>Welcome, {user.user_metadata.full_name}!</Text>
    </Center>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => ProtectedRoute({ context, redirectTo: "/login" });

export default Chat;

Chat.defaultProps = {
  meta: {
    title: "SupaChat | App",
  },
};

Chat.getLayout = function getLayout(page: JSX.Element) {
  return <ChatLayout>{page}</ChatLayout>;
};
