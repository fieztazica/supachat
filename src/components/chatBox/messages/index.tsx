import { useSupabase } from "@/lib/supabaseClient";
import { Channel, Member, Message, Profile } from "@/types";
import {
  Avatar,
  Box,
  Button,
  Center,
  Spinner,
  Stack,
  Tag,
  Text,
  Tooltip,
  UnorderedList,
  useBoolean,
  useColorModeValue,
  useDisclosure,
  useForceUpdate,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import ChatInput from "./chatInput";
import MessageComponent from "./message";

type Author = { user_id: string; display_name: string; avatar_url: string };

function Messages({ channelId }: { channelId: number }) {
  const { supabase, user } = useSupabase();
  const [channelUsers, setChannelUsers] = useState<Author[]>([]);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isTypingUsers, setIsTypingUsers] = useState<Author[]>([]);
  const [chatBoxPos, setChatBoxPos] = useState<"top" | "bottom" | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useBoolean(true);
  const [isAtTop, setIsAtTop] = useState<boolean>(false);
  const toast = useToast();
  const [newMessage, setNewMessage] = useBoolean(false);
  // const scrollDummyRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const hoverNewMessageBgColor = useColorModeValue("gray.100", "gray.900");
  const forceUpdate = useForceUpdate();

  const isChatBoxScrolledToBottom =
    chatBoxRef.current &&
    chatBoxRef.current.scrollTop >=
      chatBoxRef.current.scrollHeight - chatBoxRef.current.offsetHeight;

  // const isChatBoxScrolledToTop =
  //   chatBoxRef.current && chatBoxRef.current.scrollTop === 0;

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel(`#${channelId}`, {
      config: {
        presence: {
          key: `${user.id}`,
        },
      },
    });

    (async () => {
      const getMessages = async () => {
        try {
          setLoading.on();
          const { data, error } = await supabase
            .from("messages")
            .select(`*`)
            .eq("channel_id", channelId)
            .order("created_at", { ascending: false })
            .limit(50);

          if (error) throw error;

          if (data) setMessages(data);
        } catch (error: any) {
          console.error(error);
          setMessages([]);
          toast({
            title: `There was an error occurred when fetching messages. Please reload the page!`,
            description: `${error.message}`,
            status: "error",
            duration: 10000,
            isClosable: true,
          });
        } finally {
          setLoading.off();
          forceUpdate();
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

      const subscribeChannelEvent = async () => {
        await channel
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `channel_id=eq.${channelId}`,
            },
            (payload) => {
              setMessages((old) => [payload.new as Message, ...old]);
              forceUpdate();
            }
          )
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
              forceUpdate();
            }
          )
          .on("presence", { event: "sync" }, async () => {
            const state = await channel.presenceState();
            const userIds = await Object.keys(state);
            const isTypingUsersArray = await channelUsers.filter(
              (a) => a.user_id !== user.id && userIds.includes(a.user_id)
            );

            await setIsTypingUsers(isTypingUsersArray);

            console.log("synced state", state);
          })
          .subscribe();

        /**
           * async (status) => {
            if (status === "SUBSCRIBED") {
              await channel.track({ online_at: new Date().toISOString() });
            }
          }
          */
      };

      await getChannelUsers();
      await getMessages();
      await subscribeChannelEvent();
      await scrollToBottom();

      document.addEventListener("keypress", keyPressListener);
    })();
    return () => {
      channel.unsubscribe();
      document.removeEventListener("keypress", keyPressListener);
    };

    function keyPressListener(event: KeyboardEvent) {
      channel.track({ isTyping: Date.now() });
      setTimeout(() => {
        channel.untrack();
      }, 10_000);
    }
  }, [channelId, user]);

  useEffect(() => {
    forceUpdate();
    if (chatBoxPos === "bottom" || isChatBoxScrolledToBottom) {
      scrollToBottom();
      setNewMessage.off();
    } else {
      setNewMessage.on();
    }
  }, [messages]);

  useEffect(() => {
    forceUpdate();
    // console.log(chatBoxPos);
    if (chatBoxPos === "bottom") {
      setNewMessage.off();
    }

    if (chatBoxPos == "top" && !!messages.length && !isAtTop) {
      (async () => {
        try {
          setLoading.on();
          const { data, error } = await supabase
            .from("messages")
            .select(`*`)
            .eq("channel_id", channelId)
            .order("created_at", { ascending: false })
            .lt("created_at", messages[messages.length - 1].created_at)
            .limit(50);

          if (error) throw error;
          // console.log(data);

          if (data) setMessages((old) => [...old, ...data]);
          if (!error && !data.length) setIsAtTop(true);
        } catch (error: any) {
          console.error(error);
          toast({
            title: `There was an error occurred when fetching messages. Please reload the page!`,
            description: `${error.message}`,
            status: "error",
            duration: 10000,
            isClosable: true,
          });
        } finally {
          setLoading.off();
          forceUpdate();
        }
      })();
    }
  }, [chatBoxPos]);

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
        p={1}
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;

          const isScrolledToBottom =
            target &&
            target.scrollTop >= target.scrollHeight - target.offsetHeight;

          const isScrolledToTop = target && target.scrollTop === 0;

          if (isScrolledToBottom && !isScrolledToTop) setChatBoxPos("bottom");
          else if (!isScrolledToBottom && isScrolledToTop) setChatBoxPos("top");
          else if (!isScrolledToBottom && !isScrolledToTop) setChatBoxPos(null);
        }}
        ref={chatBoxRef}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {loading && (
          <Center py={4}>
            <Spinner />
          </Center>
        )}
        {!!messages.length ? (
          messages
            .slice()
            .reverse()
            .map((m: Message, i: number) => {
              const author = channelUsers?.find((o) => o.user_id === m.user_id);
              const prevMess = messages.slice().reverse()[i - 1] || undefined;
              return (
                <MessageComponent
                  key={m.id}
                  m={m}
                  author={author}
                  prevM={prevMess}
                />
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
          cursor="pointer"
          transition={"0.3s"}
          _hover={{ bg: hoverNewMessageBgColor }}
        >
          There is a new message!
        </Box>
      )}
      {!!isTypingUsers.length && (
        <Box pl={4}>
          <Text as="span" fontWeight={"semibold"}>
            {isTypingUsers.map((a) => a.display_name).join(", ")}
          </Text>{" "}
          is typing...
        </Box>
      )}

      {!!user && (
        <Box
          p={2}
          roundedTop={!newMessage ? "md" : undefined}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <ChatInput
            scrollToBottom={scrollToBottom}
            userId={user.id}
            channelId={channelId}
            isHover={isHover}
          />
        </Box>
      )}
    </>
  );
}

export default Messages;
