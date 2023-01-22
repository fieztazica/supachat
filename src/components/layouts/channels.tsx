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
import { Channel, Profile } from "@/types";
import { GrGroup } from "react-icons/gr";
import { VscAdd } from "react-icons/vsc";

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
    if (!user) return;

    const getUserChannels = async () => {
      const { data: userChannelsData } = await supabase
        .from("members")
        .select(`channel:channels(*)`)
        .eq("user_id", user.id);

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
            (payload: any) => {
              setChannels(payload.new);
            }
          )
          .subscribe();

        return setChannels(userChannels);
      } else {
        return setChannels([]);
      }
    };

    const fetchChannelOnEvent = async () => {
      await supabase
        .channel(`public:members:user_id=eq.${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "members",
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            (async () => {
              console.log(payload);
              // const channel = await fetchChannelFromChannelId(payload.new.channel_id)
              // if (channel)
              //   setChannels((old) => [...old, channel as Channel])

              getUserChannels();
            })();
          }
        )
        .subscribe();
    };

    getUserChannels();
    fetchChannelOnEvent();
  }, [user, supabase]);

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
