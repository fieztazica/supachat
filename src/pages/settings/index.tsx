import AppLayout from "@/components/layouts/appLayout";
import SettingsLayout from "@/components/layouts/settings/settingsLayout";
import ProtectedRoute from "@/lib/auth/ProtectedRoute";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Text,
  useColorMode,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { MdDarkMode, MdLightMode } from "react-icons/md";

function Settings() {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <Wrap p={10}>
      <WrapItem>
        <Card>
          <CardHeader>
            <Center>
              <Heading size={"md"}>Color Mode</Heading>
            </Center>
          </CardHeader>
          <CardBody>
            <Button
              onClick={toggleColorMode}
              leftIcon={
                colorMode === "light" ? <MdDarkMode /> : <MdLightMode />
              }
              w="full"
              colorScheme={colorMode === "light" ? "purple" : "cyan"}
              justifyContent={"left"}
            >
              Switch to {colorMode === "light" ? "dark" : "light"} theme
            </Button>
          </CardBody>
        </Card>
      </WrapItem>
    </Wrap>
  );
}

export default Settings;

Settings.defaultProps = {
  meta: {
    title: "SupaChat | Settings",
  },
};

Settings.getLayout = function getLayout(page: JSX.Element) {
  return <SettingsLayout>{page}</SettingsLayout>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => ProtectedRoute({ context, redirectTo: "/login" });
