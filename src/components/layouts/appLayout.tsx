import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { useContext, useState, createContext } from "react";

export const LeftSidebarContext = createContext<any>(null);
export const RightSidebarContext = createContext<any>(null);

function AppLayout({
  children,
  leftSidebar,
  rightSidebar,
}: {
  children: JSX.Element;
  leftSidebar?: JSX.Element;
  rightSidebar?: JSX.Element;
}) {
  const leftSidebarState = useDisclosure();
  const rightSidebarState = useDisclosure();

  return (
    <Flex h="100vh" w="100vw" maxH="100vh">
      {leftSidebar && (
        <LeftSidebarContext.Provider value={leftSidebarState}>
          <Box>{leftSidebar}</Box>
        </LeftSidebarContext.Provider>
      )}
      <Box as={"main"} flex="1">
        {children}
      </Box>
      {rightSidebar && (
        <RightSidebarContext.Provider value={rightSidebarState}>
          <Box>{rightSidebar}</Box>
        </RightSidebarContext.Provider>
      )}
    </Flex>
  );
}

export default AppLayout;
