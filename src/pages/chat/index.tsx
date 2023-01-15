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
import { User, Session, AuthUser } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSupabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

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
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const supabase = await createServerSupabaseClient(ctx);

  const { data, error } = await supabase.auth.getSession();

  if (!data.session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: data.session,
      user: data.session.user,
    },
  };
};

export default Chat;
