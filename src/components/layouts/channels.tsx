import { Box, Flex, Heading, Text } from "@chakra-ui/react";

function Channels({ ...props }) {
  return (
    <Flex direction="column" w={"xs"} {...props}>
      <Heading size={["sm", "md"]}>Channels</Heading>
      <Box overflow={"auto"} maxH={"$100vh"} mt={2} rounded="md" pr={1}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, i) => (
          <Box
            key={i}
            height={"50px"}
            bg="papayawhip"
            rounded="md"
            mt={1}
            mb={1}
            p={2}
            justifyItems="center"
            justifyContent={"center"}
          >
            <Text color={"black"}>{i}</Text>
          </Box>
        ))}
      </Box>
    </Flex>
  );
}

export default Channels;
