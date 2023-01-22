import { useSupabase } from "@/lib/supabaseClient";
import { Channel, Message, Profile } from "@/types";
import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { isArray } from "@chakra-ui/utils";
import { useRef, useState, useEffect } from "react";

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

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    (async () => {
      const getMessages = async () => {
        let { data: messages, error } = await supabase
          .from("messages")
          .select(`*`)
          .eq("channel_id", channelId)
          .order("created_at");

        //   console.log(messages, error);
        if (error) setMessages([]);
        setMessages(messages || []);
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
          .channel("channelUsers")
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "profiles" },
            (payload) => {
              getChannelUsers();
            }
          )
          .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "profiles" },
            (payload) => {
              getChannelUsers();
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
            () => {}
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
    })();
  }, []);

  return (
    <>
      {!!messages &&
        messages.map((m: Message) => {
          const u = channelUsers?.find((o) => o.user_id === m.user_id);
          if (!u)
            <Box key={m.id} my={2} p={1}>
              Unknown User Message
            </Box>;
          return (
            <Stack
              key={m.id}
              align="center"
              direction={user && m.user_id === user.id ? "row-reverse" : "row"}
              my={2}
              p={1}
            >
              <Avatar size="sm" name={u?.display_name} src={u?.avatar_url} />
              <Flex
                direction={"column"}
                align={user && m.user_id === user.id ? "end" : "start"}
              >
                <Text mx={1}>{u?.display_name}</Text>
                <Text bg={"gray"} rounded={"full"} px={2} w="fit-content">
                  {m.content}
                </Text>
              </Flex>
            </Stack>
          );
        })}
    </>
  );
}

export default Messages;
