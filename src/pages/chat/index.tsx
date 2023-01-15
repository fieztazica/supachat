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

const Chat = ({ user }: { user: User }) => {
  const { supabase } = useSupabase();
  const router = useRouter();

  return (
    <Container>
      <Button
        onClick={() => {
          (async () => {
            const { error } = await supabase.auth.signOut();
            if (!error) router.reload();
          })();
        }}
      >
        Logout
      </Button>
      <Card>
        <CardBody>
          <Avatar
            name={user?.user_metadata.full_name}
            src={user?.user_metadata.avatar_url}
          >
            <AvatarBadge boxSize="1em" bg="green.500" />
          </Avatar>
          <Text>{user?.id}</Text>
          <Text>{user?.user_metadata.full_name}</Text>
        </CardBody>
      </Card>
      <OnlineUsers userId={user.id}/>
    </Container>
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
