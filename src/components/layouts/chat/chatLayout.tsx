import { useColorModeValue } from "@chakra-ui/react";
import AppLayout from "../appLayout";
import ChatSideBar from "./chatSidebar";

function ChatLayout({ children }: { children: JSX.Element }) {
  return (
    <AppLayout
      sidebar={
        <ChatSideBar
          h="$100vh"
          p="2"
          borderRight={"1px"}
          borderColor={useColorModeValue("gray.800", "white")}
        />
      }
    >
      {children}
    </AppLayout>
  );
}

export default ChatLayout;
