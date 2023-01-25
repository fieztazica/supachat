import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Tag,
  Text,
  Tooltip,
  useForceUpdate,
  useToast,
} from "@chakra-ui/react";
import { BiBell } from "react-icons/bi";
import { AiOutlineReload } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabaseClient";
import { Channel, Member } from "@/types";
import { useRouter } from "next/router";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { isEmpty } from "lodash";

function NotiPopover() {
  const [pending, setPending] = useState<Channel[]>([]);
  const { supabase, user } = useSupabase();
  const toast = useToast();
  const router = useRouter();

  const handleJoin = (channelId: number) => {
    (async () => {
      if (user) {
        const { error } = await supabase
          .from("members")
          .update({
            is_joined: true,
            joined_at: new Date().toISOString(),
          })
          .eq("channel_id", channelId)
          .eq("user_id", user.id);

        if (!!error)
          toast({
            title: "Join failed.",
            status: "error",
            description: `${error.message}`,
          });
      }
    })();
  };

  useEffect(() => {
    (async () => {
      if (user) {
        const getPendingChannels = async () => {
          const { data: pendingChannelsData } = await supabase
            .from("members")
            .select(`channel:channels(*)`)
            .eq("user_id", user.id)
            .eq("is_joined", false)
            .eq("is_pending", true);

          if (!!pendingChannelsData) {
            const pendingChannels = Array.isArray(pendingChannelsData)
              ? pendingChannelsData.map((d) => d.channel as Channel)
              : pendingChannelsData === null
              ? []
              : [pendingChannelsData];

            return pendingChannels;
          } else {
            return [];
          }
        };

        const fetchPendingEvent = async () => {
          await supabase
            .channel(`pending:public:members:user_id=eq.${user.id}`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "members",
                filter: `user_id=eq.${user.id}`,
              },
              (payload: RealtimePostgresChangesPayload<Member>) => {
                (async () => {
                  //   console.log(payload);

                  setPending(await getPendingChannels());

                  //   if (!!payload.eventType) {
                  //     const newPayload = payload.new as Member;
                  //     const oldPayload = payload.old as Member;

                  //     const { data, error } = await supabase
                  //       .from("channels")
                  //       .select()
                  //       .eq("id", newPayload.channel_id)
                  //       .single();

                  //     if (!!data) {
                  //       switch (payload.eventType) {
                  //         case "INSERT":
                  //           setPending((old) => [...old, data]);
                  //           break;
                  //         case "DELETE":
                  //           setPending((old) =>
                  //             old.filter((c) => c.id !== oldPayload.channel_id)
                  //           );
                  //           break;
                  //         case "UPDATE":
                  //           setPending(await getPendingChannels());
                  //           break;
                  //       }
                  //     }
                  //   }
                })();
              }
            )
            .subscribe();
        };

        const pendingChannels = await getPendingChannels();
        setPending(pendingChannels);
        fetchPendingEvent();
      }
    })();
  }, []);

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          variant={"ghost"}
          aria-label="Notifications button"
          icon={<BiBell />}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="md">Notification</Heading>
        </PopoverHeader>
        <PopoverBody>
          <Box overflow={"auto"}>
            <Stack>
              <Text>
                Pending{` ${!pending.length ? "" : pending.length}`} invitations
              </Text>
              <Divider />
              {pending.map((c) => (
                <Flex
                  key={`Invitation of channel ${c.id}`}
                  align="center"
                  justifyContent={"space-between"}
                >
                  <HStack>
                    <Tag
                      size="sm"
                      colorScheme={c.is_private ? "purple" : "cyan"}
                    >
                      {c.is_private ? "Private" : "Public"}
                    </Tag>
                    <Text fontWeight={"semibold"}>
                      {c.name ?? c.vanity_url ?? c.id}
                    </Text>
                  </HStack>
                  <Button
                    colorScheme={"cyan"}
                    size="xs"
                    onClick={() => {
                      handleJoin(c.id);
                    }}
                  >
                    Join
                  </Button>
                </Flex>
              ))}
            </Stack>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default NotiPopover;
