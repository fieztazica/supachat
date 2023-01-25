import { useSupabase } from "@/lib/supabaseClient";
import { Channel, Member, Message, Profile } from "@/types";
import {
  Avatar,
  Box,
  Button,
  Center,
  Code,
  Flex,
  Link,
  ListItem,
  OrderedList,
  Spinner,
  Stack,
  Tag,
  Text,
  Tooltip,
  UnorderedList,
  useBoolean,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { isArray } from "@chakra-ui/utils";
import moment from "moment";
import { useRef, useState, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import ChatInput from "./chatInput";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type MessageWithProfile = Message & {
  profile: Profile | Profile[] | null;
};

function Messages({ channelId }: { channelId: number }) {
  const { supabase, user } = useSupabase();
  const [channelUsers, setChannelUsers] = useState<
    | { user_id: string; display_name: string; avatar_url: string }[]
    | null
    | undefined
  >([]);

  const [timestampId, setTimestampId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useBoolean(true);
  const toast = useToast();
  const [newMessage, setNewMessage] = useBoolean(false);
  const scrollDummyRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue("gray.600", "gray.200");

  const isChatBoxScrolledToBottom =
    chatBoxRef.current &&
    chatBoxRef.current.scrollTop >=
      chatBoxRef.current.scrollHeight - chatBoxRef.current.offsetHeight;

  const isChatBoxScrolledToTop =
    chatBoxRef.current && chatBoxRef.current.scrollTop === 0;

  useEffect(() => {
    (async () => {
      const getMessages = async () => {
        setLoading.on();
        let { data: messages, error } = await supabase
          .from("messages")
          .select(`*`)
          .eq("channel_id", channelId)
          .order("created_at");

        //   console.log(messages, error);
        if (error) {
          setMessages([]);
          setLoading.off();
          toast({
            title: `There was an error occurred when fetching messages. Please reload the page!`,
            description: `${error.message}`,
            status: "error",
            duration: 10000,
            isClosable: true,
          });
        }
        if (messages) {
          setMessages(messages);
          setLoading.off();
        }
      };

      const getChannelUsers = async () => {
        const { data, error } = await supabase
          .from("members")
          .select("*, profile:profiles(full_name, avatar_url)")
          .eq("channel_id", channelId);

        if (!!data && data !== null) {
          setChannelUsers(
            data?.map((o) => {
              const p: { full_name: string; avatar_url: string } =
                o.profile as {
                  full_name: string;
                  avatar_url: string;
                };
              return {
                user_id: o.user_id,
                display_name: o.nickname ? o.nickname : p.full_name,
                avatar_url: p.avatar_url,
              };
            })
          );
        }
      };

      const subscribeChannelUsersUpdate = async () => {
        await supabase
          .channel(`channelUsers:${channelId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "members",
              filter: `channel_id=eq.${channelId}`,
            },
            () => {
              getChannelUsers();
            }
          )
          .subscribe();
      };

      const subscribeMessageInsert = async () => {
        await supabase
          .channel(`#${channelId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `channel_id=eq.${channelId}`,
            },
            (payload) => {
              setMessages((old) => [...old, payload.new as Message]);
            }
          )
          .subscribe();
      };

      await getChannelUsers();
      await getMessages();
      await subscribeMessageInsert();
      await subscribeChannelUsersUpdate();
      await scrollToBottom();
    })();
  }, [channelId]);

  useEffect(() => {
    if (isChatBoxScrolledToBottom) {
      scrollToBottom();
      setNewMessage.off();
    } else {
      setNewMessage.on();
    }
  }, [messages]);

  // if (chatBoxRef.current) {
  //   const target = chatBoxRef.current;
  //   if (target.scrollTop >= target.scrollHeight - target.offsetHeight) {
  //     console.log("bottom");
  //   }
  // }

  function scrollToBottomDummy() {
    if (scrollDummyRef.current) {
      scrollDummyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }

  function scrollToBottom() {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }

  return (
    <>
      <Box
        flex="1"
        overflowY={"auto"}
        p={2}
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;

          if (target.scrollTop >= target.scrollHeight - target.offsetHeight) {
            setNewMessage.off();
          }
        }}
        ref={chatBoxRef}
      >
        {loading && (
          <Center>
            <Spinner />
          </Center>
        )}
        {!!messages.length ? (
          messages.map((m: Message, i: number) => {
            const u = channelUsers?.find((o) => o.user_id === m.user_id);
            return (
              <Stack
                key={m.id}
                align="center"
                direction={
                  user && m.user_id === user.id ? "row-reverse" : "row"
                }
                my={2}
                p={1}
                rounded={"md"}
                // _hover={{ bg: bgColorHover }}
                onMouseOver={() => setTimestampId(m.id)}
                onMouseOut={() => setTimestampId(null)}
              >
                <Avatar size="sm" name={u?.display_name} src={u?.avatar_url} />
                <Flex
                  direction={"column"}
                  align={user && m.user_id === user.id ? "end" : "start"}
                >
                  <Flex
                    direction={
                      user && m.user_id === user.id ? "row-reverse" : "row"
                    }
                    align="center"
                  >
                    <Text mx={1} fontWeight="semibold">
                      {u?.display_name ?? m.user_id ?? "Unknown User"}
                    </Text>

                    {timestampId == m.id && (
                      <Tag size={"sm"}>
                        {moment(m.created_at as string).calendar()}
                      </Tag>
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
                    px={2}
                    w="fit-content"
                  >
                    {m.content}
                  </Text>
                </Flex>
              </Stack>
            );
          })
        ) : (
          <Center h="100%">No message</Center>
        )}
      </Box>
      {newMessage && (
        <Box
          onClick={() => {
            scrollToBottom();
            setNewMessage.off();
          }}
          pl={4}
          roundedTop="md"
          bg="ButtonFace"
        >
          There is a new message!
        </Box>
      )}
      {!!user && (
        <Box p={2} bg="ButtonFace" roundedTop={!newMessage ? "md" : undefined}>
          <ChatInput
            scrollToBottom={scrollToBottom}
            userId={user.id}
            channelId={channelId}
          />
        </Box>
      )}
    </>
  );
}

export default Messages;
