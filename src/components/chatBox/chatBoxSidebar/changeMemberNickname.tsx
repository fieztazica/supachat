import { useSupabase } from "@/lib/supabaseClient";
import { Channel, Member, Profile } from "@/types";
import {
  Input,
  useDisclosure,
  Text,
  Flex,
  IconButton,
  useToast,
  Button,
  Box,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";

function ChangeMemberNickname({
  channel,
  member,
}: {
  channel: Channel;
  member: Member & {
    profile: Profile | Profile[] | null;
  };
}) {
  const { supabase } = useSupabase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [value, setValue] = useState<string>(
    member.nickname ?? (member.profile as Profile).full_name ?? ""
  );

  const handleOnClose = (userId: string) => {
    onClose();
    (async () => {
      try {
        if (value === member.nickname) return;
        if (!value)
          setValue(
            member.nickname ?? (member.profile as Profile).full_name ?? ""
          );
        const { error } = await supabase
          .from("members")
          .update({
            nickname:
              !value || value === (member.profile as Profile).full_name
                ? null
                : value.trim(),
          })
          .eq("user_id", userId)
          .eq("channel_id", channel.id);

        if (error) {
          throw new Error(error as any);
        }
      } catch (error: any) {
        console.error(error);
        toast({ title: error.message, status: "error" });
      }
    })();
  };

  return (
    <>
      {isOpen ? (
        <HStack w="100%" p="1">
          <Avatar
            size="sm"
            src={(member.profile as Profile).avatar_url ?? undefined}
          />
          <Input
            autoFocus
            w="100%"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            mr={1}
          />
          <IconButton
            aria-label="Confirm change channel name button"
            ml={1}
            onClick={() => handleOnClose(member.user_id)}
            icon={<IoMdCheckmark />}
            variant="outline"
            colorScheme={"green"}
          />
        </HStack>
      ) : (
        <HStack w="100%" cursor={"pointer"} onClick={onOpen} p="1">
          <Avatar
            size="sm"
            src={(member.profile as Profile).avatar_url ?? undefined}
          />
          <Text>{value}</Text>
        </HStack>
      )}
    </>
  );
}

export default ChangeMemberNickname;
