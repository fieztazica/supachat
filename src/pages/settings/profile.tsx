import AppLayout from "@/components/layouts/appLayout";
import SettingsLayout from "@/components/layouts/settings/settingsLayout";
import ProtectedRoute from "@/lib/auth/ProtectedRoute";
import { useProfile } from "@/lib/supabaseClient";
import { Avatar, Box, Card, CardBody, Text } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

function Profile() {
  const profile = useProfile();
  return (
    <Box p={2}>
      <Card>
        <CardBody>
          <Avatar
            name={profile?.full_name!}
            src={profile?.avatar_url || undefined}
            size="2xl"
          />
          <Text>{profile?.full_name}</Text>
          <Text>{profile?.username}</Text>
          <Text>{profile?.id}</Text>
        </CardBody>
      </Card>
    </Box>
  );
}

export default Profile;

Profile.defaultProps = {
  meta: {
    title: "SupaChat | Profile",
  },
};

Profile.getLayout = function getLayout(page: JSX.Element) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => ProtectedRoute({ context, redirectTo: "/login" });
