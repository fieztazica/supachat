import Theme from "@chakra-ui/theme";
import { GetServerSideProps } from "next";
import { supabase, useSupabase } from "@/lib/supabaseClient";
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
import { useEffect, useState } from "react";
import { User, Session, AuthUser } from "@supabase/supabase-js";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";

const Chat = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push("/login");
    console.log(user, session);
  });

  if (!session) return null;

  return (
    <Container>
      <Button
        onClick={() => {
          (async () => {
            const { error } = await supabase.auth.signOut();
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
    </Container>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const supabase = createServerSupabaseClient(ctx);

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   console.log(session);

//   if (!session)
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };

//   return {
//     props: {
//       initialSession: session,
//       user: session.user,
//     } as Props,
//   };
// };

export default Chat;
