import { useSupabase } from "@/lib/supabaseClient";
import { Channel, Member, Profile } from "@/types";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  InputLeftElement,
  InputGroup,
  Icon,
  useColorModeValue,
  useToast,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
// import { TbDotsVertical } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import { GrUpgrade } from "react-icons/gr";
import { FcCheckmark } from "react-icons/fc";
import { FaCrown } from "react-icons/fa";

function ManageMembersModal({ channel }: { channel: Channel }) {
  const { supabase, user } = useSupabase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const tabs =
    user?.id === channel.owner_id
      ? ["Joined", "Requests", "Invited"]
      : ["Joined"];
  // const [tabIndex, setTabIndex] = useState(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const [members, setMembers] = useState<
    (Member & {
      profile: Profile | Profile[] | null;
    })[]
  >([]);
  const hoverBg = useColorModeValue("gray.100", "gray.600");

  const memberList = members.filter(
    (m) =>
      m.nickname?.toLowerCase().includes(searchValue.toLowerCase()) ||
      (m.profile as Profile).full_name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      m.user_id.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleKick = (userId: string) => {
    (async () => {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("user_id", userId)
        .eq("channel_id", channel.id);

      if (error) {
        console.log(error);
        toast({
          title: error.message,
          status: "error",
          description: error.details,
        });
      } else {
        toast({
          title: `Kicked ${userId}!`,
          status: "success",
        });
        setMembers((old) => old.filter((m) => m.user_id !== userId));
      }
    })();
  };

  const handleAccept = (userId: string) => {
    (async () => {
      const { data, error } = await supabase
        .from("members")
        .update({ is_joined: true })
        .eq("user_id", userId)
        .eq("channel_id", channel.id)
        .select("*, profile:profiles(*)")
        .single();

      if (error) {
        console.log(error);
        toast({
          title: error.message,
          status: "error",
          description: error.details,
        });
      }

      if (data) {
        toast({
          title: `Accepted ${(data.profile as Profile).full_name}!`,
          status: "success",
        });
        getChannelMembers();
      }
    })();
  };

  const getChannelMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*, profile:profiles(*)")
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
        Manage members
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
              <Text mb={2}>Manage members</Text>
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
          <Divider />
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted>
              <TabList>
                {tabs.map((t, i) => (
                  <Tab key={t}>{t}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {/* Joined Tab */}
                {tabs.includes("Joined") && (
                  <TabPanel>
                    <Box maxH={"xs"} overflow={"auto"}>
                      {memberList
                        .filter((m) => m.is_joined === true)
                        .map((m) => (
                          <Flex
                            key={m.id}
                            justifyContent={"space-between"}
                            align="center"
                            p="1"
                            transition={"0.3s"}
                            rounded={"md"}
                            _hover={{ bg: hoverBg }}
                          >
                            <HStack>
                              <Avatar
                                size="sm"
                                src={
                                  (m.profile as Profile).avatar_url ?? undefined
                                }
                              />
                              {channel.owner_id === m.user_id && (
                                <Icon color={"yellow"} as={FaCrown} />
                              )}
                              <Text>{(m.profile as Profile).full_name}</Text>
                              {m.nickname && <Text>({m.nickname})</Text>}
                            </HStack>

                            {user?.id === channel.owner_id &&
                              m.user_id !== user.id && (
                                <Popover placement="auto">
                                  <PopoverTrigger>
                                    <IconButton
                                      variant={"ghost"}
                                      colorScheme="red"
                                      icon={<RxCross1 />}
                                      aria-label="Kick action button"
                                      size="sm"
                                    />
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverBody>
                                      Are you sure you want to kick{" "}
                                      <Text as={"span"} fontWeight={"semibold"}>
                                        {(m.profile as Profile).full_name}?
                                      </Text>
                                    </PopoverBody>
                                    <PopoverFooter
                                      display={"flex"}
                                      justifyContent="space-evenly"
                                    >
                                      <Button
                                        size="sm"
                                        colorScheme={"green"}
                                        onClick={() => handleKick(m.user_id)}
                                      >
                                        Confirm
                                      </Button>
                                    </PopoverFooter>
                                  </PopoverContent>
                                </Popover>
                              )}
                          </Flex>
                        ))}
                    </Box>
                  </TabPanel>
                )}
                {/* Requests Tab */}
                {tabs.includes("Requests") && (
                  <TabPanel>
                    <Box maxH={"xs"} overflow={"auto"}>
                      {memberList
                        .filter(
                          (m) => m.is_joined === false && m.is_pending === false
                        )
                        .map((m) => (
                          <Flex
                            key={m.id}
                            justifyContent={"space-between"}
                            align="center"
                            p="1"
                            transition={"0.3s"}
                            rounded={"md"}
                            _hover={{ bg: hoverBg }}
                          >
                            <HStack>
                              <Avatar
                                size="sm"
                                src={
                                  (m.profile as Profile).avatar_url ?? undefined
                                }
                              />
                              {channel.owner_id === m.user_id && (
                                <Icon color={"yellow"} as={FaCrown} />
                              )}
                              <Text>{(m.profile as Profile).full_name}</Text>
                            </HStack>
                            <IconButton
                              variant={"ghost"}
                              colorScheme="green"
                              icon={<FcCheckmark />}
                              aria-label="Accept request action button"
                              size="sm"
                              mr={1}
                              onClick={() => handleAccept(m.user_id)}
                            />
                          </Flex>
                        ))}
                    </Box>
                  </TabPanel>
                )}
                {/* Invited Tab */}
                {tabs.includes("Invited") && (
                  <TabPanel>
                    <Box maxH={"xs"} overflow={"auto"}>
                      {memberList
                        .filter(
                          (m) => m.is_joined === false && m.is_pending === true
                        )
                        .map((m) => (
                          <Flex
                            key={m.id}
                            justifyContent={"space-between"}
                            align="center"
                            p="1"
                            transition={"0.3s"}
                            rounded={"md"}
                            _hover={{ bg: hoverBg }}
                          >
                            <HStack>
                              <Avatar
                                size="sm"
                                src={
                                  (m.profile as Profile).avatar_url ?? undefined
                                }
                              />
                              {channel.owner_id === m.user_id && (
                                <Icon color={"yellow"} as={FaCrown} />
                              )}
                              <Text>{(m.profile as Profile).full_name}</Text>
                            </HStack>
                          </Flex>
                        ))}
                    </Box>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ManageMembersModal;
