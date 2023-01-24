import { useSupabase } from "@/lib/supabaseClient";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  HStack,
  Image,
  Icon,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Channel, Member, Profile } from "@/types";
import { GrGroup } from "react-icons/gr";
import { VscAdd } from "react-icons/vsc";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

// CODE RAT DO

function Channels({ ...props }) {
  const { user, supabase } = useSupabase();
  const [channels, setChannels] = useState<Channel[]>([]);

  async function fetchChannelFromChannelId(channelId: number) {
    const res = await supabase
      .from("channels")
      .select()
      .eq("id", channelId)
      .single();
    return res.data;
  }

  useEffect(() => {
    (async () => {
      if (user) {
        const getUserChannels = async () => {
          const { data: userChannelsData } = await supabase
            .from("members")
            .select(`channel:channels(*)`)
            .eq("user_id", user.id)
            .eq("is_joined", true);

          if (!!userChannelsData) {
            const userChannels = Array.isArray(userChannelsData)
              ? userChannelsData.map((d) => d.channel as Channel)
              : userChannelsData === null
              ? []
              : [userChannelsData];

            await supabase
              .channel(`public:channels:id=in.${userChannels.map((c) => c.id)}`)
              .on(
                "postgres_changes",
                {
                  event: "*",
                  schema: "public",
                  table: "channels",
                  filter: `id=in.${userChannels.map((c) => c.id)}`,
                },
                (payload: RealtimePostgresChangesPayload<Channel[]>) => {
                  // console.log("channels", payload);
                  setChannels(payload.new as Channel[]);
                }
              )
              .subscribe();

            return userChannels;
          } else {
            return [];
          }
        };

        const fetchChannelOnEvent = async () => {
          await supabase
            .channel(`active:public:members:user_id=eq.${user.id}`)
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
                  // console.log("members", payload);

                  setChannels(await getUserChannels());

                  // if (!!payload.eventType) {
                  //   const newPayload = payload.new as Member;
                  //   const oldPayload = payload.old as Member;

                  //   const { data, error } = await supabase
                  //     .from("channels")
                  //     .select()
                  //     .eq("id", newPayload.channel_id)
                  //     .single();

                  //   if (!!data) {
                  //     switch (payload.eventType) {
                  //       case "INSERT":
                  //         setChannels((old) => [...old, data]);
                  //         break;
                  //       case "DELETE":
                  //         setChannels((old) =>
                  //           old.filter((c) => c.id !== oldPayload.channel_id)
                  //         );
                  //         break;
                  //       case "UPDATE":
                  //         setChannels(await getUserChannels());
                  //         break;
                  //     }
                  //   }
                  // }
                })();
              }
            )
            .subscribe();
        };

        setChannels(await getUserChannels());
        fetchChannelOnEvent();
      }
    })();
  }, []);

  return (
    <Box
      overflow={"auto"}
      maxH={"$100vh"}
      flex="1"
      rounded="md"
      css={{
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: `#718096`,
          borderRadius: "24px",
        },
      }}
      {...props}
    >
      {!!channels ? (
        channels?.map((c, i) => (
          <NextLink key={`Channel ${c.id}`} href={`/chat/${c.id}`}>
            <Card
              as={Button}
              maxH={"150px"}
              w="full"
              h="fit-content"
              rounded="md"
              mt={1}
              mb={1}
              justifyItems="left"
              justifyContent={"left"}
              align="left"
              direction={"row"}
              overflow="hidden"
            >
              <Avatar
                rounded="full"
                icon={<GrGroup />}
                src={c?.avatar_url || undefined}
              />
              <CardBody as={Box} align="left">
                <Text noOfLines={1} p={1}>
                  {c.name ? c.name : `Channel ${c.id}`}
                </Text>
              </CardBody>
              <CardFooter>
                <Tag colorScheme={c.is_private ? "black" : "cyan"}>
                  {c.is_private ? "Private" : "Public"}
                </Tag>
              </CardFooter>
            </Card>
          </NextLink>
        ))
      ) : (
        <Text>There is no conversation.</Text>
      )}
    </Box>
  );
}

export default Channels;
