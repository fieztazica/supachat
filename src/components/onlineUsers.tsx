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
  userId?: string;
  channelId?: string;
};

function OnlineUsers({ userId, channelId }: Props) {
  const { supabase, user } = useSupabase();
  const [onlineUsers, setOnlineUsers] = useState<Profile[] | null>();
  const toast = useToast();

  useEffect(() => {
    async function fetchOnlineUsers() {
      const online = await channel.presenceState();
      console.log("Online users: ", online);
      const onlineUserIds = Object.keys(online).filter((id) => id !== user?.id);
      const { data: onlineProfiles } = await getProfiles(onlineUserIds);
      setOnlineUsers(onlineProfiles);
    }

    const channel = supabase.channel("online");

    channel.on("presence", { event: "sync" }, () => fetchOnlineUsers());

    fetchOnlineUsers();
  }, []);

  return (
    <Box mt={4}>
      <Heading size="xs">Online</Heading>
      <Wrap p={2}>
        {onlineUsers?.map((onlineUser, index) => {
          return (
            <WrapItem key={onlineUser.id}>
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
