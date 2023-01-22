import { getProfile, getProfiles, useSupabase } from "@/lib/supabaseClient";
import { Profile } from "@/types";
import {
  Avatar,
  AvatarBadge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Tooltip,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { RealtimePresenceState } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Props = {
  channelId: number;
};

function OnlineUsers({ channelId }: Props) {
  const { supabase } = useSupabase();
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);
  const [channelUserIds, setChannelUserIds] = useState<string[]>([]);
  const toast = useToast();

  // console.log(channelUserIds);

  useEffect(() => {
    (async () => {
      const channel = supabase.channel(`online`);

      channel.on("presence", { event: "sync" }, () => fetchOnlineUsers());

      async function fetchOnlineUsers() {
        const online = await channel.presenceState();

        const onlineUserIds = Object.keys(online).filter(
          (id) =>
            // channelUserIds.includes(id)
            id
        );

        const { data: onlineProfiles } = await getProfiles(onlineUserIds);
        setOnlineUsers(onlineProfiles || []);
      }

      async function fetchChannelUsers() {
        const { data } = await supabase
          .from("members")
          .select("user_id")
          .eq("channel_id", channelId);

        if (!!data) {
          const userIds = await data.map((u) => u.user_id);
          setChannelUserIds(userIds);
        }
      }

      fetchChannelUsers();
      fetchOnlineUsers();
    })();
  }, []);

  return (
    <Box mt={4}>
      <Heading size="xs">
        {!onlineUsers.length ? "Offline" : `Online - ${onlineUsers.length}`}
      </Heading>
      <Wrap p={2}>
        {onlineUsers.map((onlineUser, index) => {
          return (
            <WrapItem key={`Online - ${onlineUser.id}`}>
              <Tooltip label={onlineUser.full_name || undefined}>
                <Avatar
                  name={onlineUser.full_name || undefined}
                  src={onlineUser.avatar_url || undefined}
                  size="xs"
                >
                  <AvatarBadge boxSize="1em" bg="green.500" />
                </Avatar>
              </Tooltip>
            </WrapItem>
          );
        })}
      </Wrap>
    </Box>
  );
}

export default OnlineUsers;
