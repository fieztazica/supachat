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
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Channel, Member, Profile } from "@/types";
import { GrGroup } from "react-icons/gr";
import { VscAdd } from "react-icons/vsc";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import CreateChannelButton from "./createChannelButton";

// CODE RAT DO

function Channels({ ...props }) {
  const { user, supabase, channels } = useSupabase();
  const [searchValue, setSearchValue] = useState<string>("");

  const channelList = channels.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.id.toString().toLowerCase().includes(searchValue.toLowerCase())
  );

  if (!user) return null;

  return (
    <>
      <InputGroup pr={1}>
        <InputLeftElement pointerEvents="none">🔍</InputLeftElement>
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search channel"
        />
      </InputGroup>
      <HStack align={"center"}>
        <Heading size={["md", "sm"]}>Channels</Heading>
        <CreateChannelButton />
      </HStack>
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
        {!!channelList.length ? (
          channelList?.map((c, i) => (
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
          <Text>No channel found.</Text>
        )}
      </Box>
    </>
  );
}

export default Channels;
