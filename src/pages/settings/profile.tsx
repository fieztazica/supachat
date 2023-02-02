import AppLayout from "@/components/layouts/appLayout";
import SettingsLayout from "@/components/layouts/settings/settingsLayout";
import ProfileCard from "@/components/settings/profile/ProfileCard";
import ProtectedRoute from "@/lib/auth/ProtectedRoute";
import { useProfile } from "@/lib/supabaseClient";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";


function Profile() {
  const profile = useProfile();

  return (
    <Wrap p={2} justify="center">
      <WrapItem>
        <ProfileCard />
      </WrapItem>
      <WrapItem>
        <Card title={profile?.id} minW="xs">
          <CardHeader>
            <Heading size="md">Password</Heading>
          </CardHeader>
          <CardBody>
            <HStack>
              <Text
                as="h1"
                fontSize={"2xl"}
                fontWeight="semibold"
                noOfLines={1}
              >
                {profile?.full_name}
              </Text>
              <IconButton
                aria-label="Edit full name button"
                size="sm"
                variant="ghost"
                icon={<FiEdit />}
              />
            </HStack>
            <HStack>
              <Text as="i" fontSize={"md"} fontWeight="hairline">
                @{profile?.username}
              </Text>
              <IconButton
                aria-label="Edit username button"
                size="sm"
                variant="ghost"
                icon={<FiEdit />}
              />
            </HStack>
          </CardBody>
        </Card>
      </WrapItem>
      <WrapItem>
        <Card title={profile?.id} minW="xs">
          <CardHeader>
            <Heading size="md">Additional Information</Heading>
          </CardHeader>
          <CardBody>
            <Avatar
              name={profile?.full_name!}
              src={profile?.avatar_url || undefined}
              size="2xl"
            />
            <HStack>
              <Text
                as="h1"
                fontSize={"2xl"}
                fontWeight="semibold"
                noOfLines={1}
              >
                {profile?.full_name}
              </Text>
              <IconButton
                aria-label="Edit full name button"
                size="sm"
                variant="ghost"
                icon={<FiEdit />}
              />
            </HStack>
            <HStack>
              <Text as="i" fontSize={"md"} fontWeight="hairline">
                @{profile?.username}
              </Text>
              <IconButton
                aria-label="Edit username button"
                size="sm"
                variant="ghost"
                icon={<FiEdit />}
              />
            </HStack>
          </CardBody>
        </Card>
      </WrapItem>
    </Wrap>
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
