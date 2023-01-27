import { useSupabase } from "@/lib/supabaseClient";
import { Channel, Member, Profile } from "@/types";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import ChangeMemberNickname from "./changeMemberNickname";

function ManageNicknamesModal({ channel }: { channel: Channel }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { supabase, user } = useSupabase();
  const [members, setMembers] = useState<
    (Member & {
      profile: Profile | Profile[] | null;
    })[]
  >([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const hoverBg = useColorModeValue("gray.100", "gray.600");

  const memberList = members.filter(
    (m) =>
      m.nickname?.toLowerCase().includes(searchValue.toLowerCase()) ||
      (m.profile as Profile).full_name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      m.user_id.toLowerCase().includes(searchValue.toLowerCase())
  );

  const getChannelMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*, profile:profiles(*)")
      .eq("is_joined", true)
      .eq("channel_id", channel.id);

    if (error) {
      console.log(error);
    }

    if (!!data) {
      setMembers(data);
    }
  };

  useEffect(() => {
    (async () => {
      if (!isOpen) return;

      getChannelMembers();
    })();
  }, [isOpen, channel]);

  return (
    <>
      <Button onClick={onOpen} w={"100%"}>
        Manage nicknames
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
        size={["full", "xl"]}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="left">
              <Text mb={2}>Manage nicknames</Text>
              <InputGroup pr={1}>
                <InputLeftElement pointerEvents="none">🔍</InputLeftElement>
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search member"
                />
              </InputGroup>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box maxH={"xs"} overflow={"auto"}>
              {memberList.map((m) => (
                <Flex
                  key={m.id}
                  justifyContent={"space-between"}
                  align="center"
                  transition={"0.3s"}
                  rounded={"md"}
                  _hover={{ bg: hoverBg }}
                >
                  <ChangeMemberNickname channel={channel} member={m} />
                </Flex>
              ))}
            </Box>
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ManageNicknamesModal;
