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
  userId: string;
  channelId?: string;
};

function OnlineUsers({ userId, channelId }: Props) {
  const { supabase, user } = useSupabase();
  const [onlineUsers, setOnlineUsers] = useState<Profile[] | null>();
  const toast = useToast();

  useEffect(() => {
    async function fetchOnlineUsers() {
      const online = await channel.presenceState();
      // console.log("Online users: ", online);
      const onlineUserIds = Object.keys(online).filter((id) => id !== userId);
      const { data: onlineProfiles } = await getProfiles(onlineUserIds);
      setOnlineUsers(onlineProfiles);
    }

    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: `${userId}`,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => fetchOnlineUsers());

    // channel.on("presence", { event: "join" }, async ({ newPresences, key }) => {
    //   console.log("New users have joined: ", newPresences, key);
    //   const { data: profile } = await getProfile(key);
    //   toast({
    //     title: `${profile?.full_name} has joined us!`,
    //   });
    // });

    // channel.on(
    //   "presence",
    //   { event: "leave" },
    //   async ({ leftPresences, key }) => {
    //     console.log("Users have left: ", leftPresences, key);
    //      const { data: profile } = await getProfile(key);
    //      toast({
    //        title: `${profile?.full_name} has left!`,
    //      });
    //   }
    // );

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const status = await channel.track({
          online_at: new Date().toISOString(),
        });
        fetchOnlineUsers();
        // console.log(status);
      }
    });

    fetchOnlineUsers();
  }, []);

  return (
    <Box mt={4}>
      <Card>
        <CardHeader>
          <Heading size="md">Online</Heading>
        </CardHeader>
        <CardBody>
          <Wrap p={2}>
            {onlineUsers?.map((onlineUser, index) => {
              return (
                <WrapItem key={onlineUser.id}>
                  <Tooltip label={onlineUser.full_name || undefined}>
                    <Avatar
                      name={onlineUser.full_name || undefined}
                      src={onlineUser.avatar_url || undefined}
                    >
                      <AvatarBadge boxSize="1em" bg="green.500" />
                    </Avatar>
                  </Tooltip>
                </WrapItem>
              );
            })}
          </Wrap>
        </CardBody>
      </Card>
    </Box>
  );
}

export default OnlineUsers;
