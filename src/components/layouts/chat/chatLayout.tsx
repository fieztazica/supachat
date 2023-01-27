import { useColorModeValue } from "@chakra-ui/react";
import AppLayout from "../appLayout";
import ChatSideBar from "./chatSidebar";

function ChatLayout({ children }: { children: JSX.Element }) {
  return (
    <AppLayout
      leftSidebar={
        <ChatSideBar
          h="$100vh"
          p="2"
          borderRight={"1px"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
        />
      }
    >
      {children}
    </AppLayout>
  );
}

export default ChatLayout;
