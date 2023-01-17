import AppLayout from "@/components/layouts/appLayout";
import SettingsLayout from "@/components/layouts/settings/settingsLayout";
import ProtectedRoute from "@/lib/auth/ProtectedRoute";
import { Box, Button, Text, useColorMode } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { MdDarkMode, MdLightMode } from "react-icons/md";

function Settings() {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <Box>
      
    </Box>
  );
}

export default Settings;

Settings.defaultProps = {
  meta: {
    title: "SupaChat | Settings",
  },
};

Settings.getLayout = function getLayout(page: JSX.Element) {
  return (
      <SettingsLayout>{page}</SettingsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => ProtectedRoute({ context, redirectTo: "/login" });
