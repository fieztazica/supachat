import { Button, Center, Divider, Tag, Text, VStack } from "@chakra-ui/react";
import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";

interface Props {
  statusCode?: number;
}

const Error: NextPage<Props> = ({ statusCode }) => {
  const router = useRouter();
  return (
    <Center h="100vh">
      <VStack>
        {statusCode ? (
          <Text>
            An error <Tag>{statusCode}</Tag> occurred on server
          </Text>
        ) : (
          <Text>An error occurred on client</Text>
        )}
        <Divider />
        <Button onClick={() => router.push("/chat")} colorScheme={"cyan"}>
          Home
        </Button>
      </VStack>
    </Center>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
