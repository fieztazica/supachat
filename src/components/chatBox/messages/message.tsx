import { Message } from "@/types";
import {
  Avatar,
  Box,
  Code,
  Flex,
  Link,
  ListItem,
  OrderedList,
  Stack,
  Tag,
  Text,
  Tooltip,
  UnorderedList,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import Markdown from "markdown-to-jsx";
import { useSupabase } from "@/lib/supabaseClient";

function Message({
  m,
  author,
  prevM,
  ...props
}: {
  m: Message;
  author:
    | {
        user_id: string;
        display_name: string;
        avatar_url: string;
      }
    | undefined;
  prevM: Message | undefined | null;
}) {
  const { user } = useSupabase();
  const bgColor = useColorModeValue("gray.600", "gray.200");
  const mBgColor = useColorModeValue("gray.100", "gray.900");
  if (!user) return null;
  const shouldRenderMHeader = !!prevM ? prevM.user_id !== m.user_id : true;
  const isMyMessage = m.user_id === user.id;

  return (
    <Flex
      w="100%"
      direction={isMyMessage ? "row-reverse" : "row"}
      px={1}
      {...props}
    >
      <Tooltip label={moment(m.created_at as string).calendar()}>
        <Stack
          align="center"
          direction={isMyMessage ? "row-reverse" : "row"}
          mt={shouldRenderMHeader ? 1 : 0}
          rounded={"md"}
          transition={"0.3s"}
          _hover={{ bg: mBgColor }}
          ml={!!isMyMessage ? undefined : !shouldRenderMHeader ? 10 : undefined}
          mr={!isMyMessage ? undefined : !shouldRenderMHeader ? 10 : undefined}
          w={"fit-content"}
          px={2}
        >
          {shouldRenderMHeader && (
            <Avatar
              size="sm"
              name={author?.display_name}
              src={author?.avatar_url}
              boxSize="8"
              // cursor={"pointer"}
              as={Link}
              href={author?.avatar_url}
              isExternal
            />
          )}
          <Flex direction={"column"} align={isMyMessage ? "end" : "start"}>
            <Flex
              direction={isMyMessage ? "row-reverse" : "row"}
              align="center"
            >
              {shouldRenderMHeader && (
                <Text as={Link} fontWeight="semibold" cursor={"pointer"} title={m.user_id}>
                  {author?.display_name ?? m.user_id ?? "Unknown User"}
                </Text>
              )}
            </Flex>
            <Text
              options={{
                disableParsingRawHTML: true,
                forceBlock: true,
                overrides: {
                  a: Text,
                  code: Code,
                  li: ListItem,
                  ul: UnorderedList,
                  ol: OrderedList,
                  h1: Text,
                  h2: Text,
                  h3: Text,
                  h4: Text,
                  h5: Text,
                  h6: Text,
                  h7: Text,
                },
              }}
              as={Markdown}
              color={bgColor}
              rounded={"full"}
              w="fit-content"
              title={m.id}
            >
              {m.content}
            </Text>
          </Flex>
        </Stack>
      </Tooltip>
    </Flex>
  );
}

export default Message;
