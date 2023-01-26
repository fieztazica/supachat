import { Message } from "@/types";
import {
  Avatar,
  Box,
  Code,
  Flex,
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
  if (!user) return null;
  const shouldRenderMHeader = !!prevM ? prevM.user_id !== m.user_id : true;
  const isMyMessage = m.user_id === user.id;

  return (
    <Tooltip label={moment(m.created_at as string).calendar()} {...props}>
      <Stack
        align="center"
        direction={isMyMessage ? "row-reverse" : "row"}
        mt={shouldRenderMHeader ? 2 : undefined}
        rounded={"md"}
      >
        {shouldRenderMHeader && (
          <Avatar
            size="sm"
            name={author?.display_name}
            src={author?.avatar_url}
            boxSize="8"
          />
        )}
        <Flex direction={"column"} align={isMyMessage ? "end" : "start"}>
          <Flex direction={isMyMessage ? "row-reverse" : "row"} align="center">
            {shouldRenderMHeader && (
              <Text fontWeight="semibold">
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
            ml={
              !!isMyMessage ? undefined : !shouldRenderMHeader ? 10 : undefined
            }
            mr={
              !isMyMessage ? undefined : !shouldRenderMHeader ? 10 : undefined
            }
          >
            {m.content}
          </Text>
        </Flex>
      </Stack>
    </Tooltip>
  );
}

export default Message;
