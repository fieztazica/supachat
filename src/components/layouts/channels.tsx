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
  Image,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import NextLink from "next/link";
import { Profile } from "@/types";
import { GrGroup } from "react-icons/gr";

// CODE RAT DO

function Channels({ ...props }) {
  const { channels, profile } = useSupabase();

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
      {channels?.list?.map((c, i) => (
        <NextLink key={`Channel ${c.id}`} href={`/chat/${c.id}`}>
          <Card
            as={Button}
            maxH={"150px"}
            w="full"
            h="fit-content"
            rounded="md"
            mt={1}
            mb={1}
            p={2}
            justifyItems="left"
            justifyContent={"left"}
            align="left"
            direction={"row"}
            overflow="hidden"
          >
            <Avatar
              objectFit="cover"
              boxSize={"5rem"}
              rounded="full"
              icon={<GrGroup fontSize="3rem" />}
              src={
                c?.avatar_url ||
                (c.type === "dm" &&
                  channels.members[`${c.id}`]
                    .filter((m: any) =>
                      c.type === "dm" ? m.profiles.id !== profile?.id : true
                    )
                    .shift().profiles.avatar_url) ||
                undefined
              }
            />
            <Stack>
              <CardBody as={Box} align="left" p={0} ml={5} mt={1}>
                <Heading size="xs" noOfLines={1}>
                  {c?.name || channels.members[`${c.id}`].length < 4
                    ? channels.members[`${c.id}`]
                        .filter((m: any) =>
                          c.type === "dm" ? m.profiles.id !== profile?.id : true
                        )
                        .map((m: any) => {
                          const str = m.profiles.full_name
                            .split(" ")
                            .shift() as string;
                          return str.length > 5
                            ? str.substring(0, 5) + "..."
                            : str;
                        })
                        .join(", ")
                    : `${channels.members[`${c.id}`]
                        .splice(3)
                        .filter((m: any) =>
                          c.type === "dm" ? m.profiles.id !== profile?.id : true
                        )
                        .map((m: any) => {
                          const str = m.profiles.full_name
                            .split(" ")
                            .shift() as string;
                          return str.length > 5
                            ? str.substring(0, 5) + "..."
                            : str;
                        })
                        .join(", ")} and ${
                        channels.members[`${c.id}`].length - 3
                      } others`}
                </Heading>
              </CardBody>
              <CardFooter as={Box} p={0}>
                <Tag size="sm" ml={5}>
                  {c.type.toUpperCase()}
                </Tag>
              </CardFooter>
            </Stack>
          </Card>
        </NextLink>
      )) || <Text>There is no conversation.</Text>}
    </Box>
  );
}

export default Channels;
