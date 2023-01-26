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
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
// import { TbDotsVertical } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import { GrUpgrade, GrCheckmark } from "react-icons/gr";
import { FaCrown } from "react-icons/fa";

function ManageMembersModal({ channel }: { channel: Channel }) {
  const { supabase } = useSupabase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tabIndex, setTabIndex] = useState(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const [members, setMembers] = useState<
    (Member & {
      profile: Profile | Profile[] | null;
    })[]
  >([]);

  const memberList = members.filter(
    (m) =>
      m.nickname?.toLowerCase().includes(searchValue.toLowerCase()) ||
      (m.profile as Profile).full_name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      m.user_id.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    (async () => {
      if (!isOpen) return;

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
            <InputGroup pr={1}>
              <InputLeftElement pointerEvents="none">🔍</InputLeftElement>
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search member"
              />
            </InputGroup>
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Tabs isFitted onChange={(index) => setTabIndex(index)}>
              <TabList>
                <Tab>Joined</Tab>
                <Tab>Requests</Tab>
                <Tab>Invited</Tab>
              </TabList>
              <TabPanels>
                {/* Joined Tab */}
                <TabPanel>
                  <Box maxH={"xs"} overflow={"auto"}>
                    {memberList
                      .filter((m) => m.is_joined === true)
                      .map((m) => (
                        <Flex
                          key={m.id}
                          justifyContent={"space-between"}
                          align="center"
                          py="1"
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
                                <Button size="sm" colorScheme={"green"}>
                                  Confirm
                                </Button>
                              </PopoverFooter>
                            </PopoverContent>
                          </Popover>
                        </Flex>
                      ))}
                  </Box>
                </TabPanel>
                {/* Requests Tab */}
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
                          py="1"
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
                          <Flex align={"center"} justifyContent="space-between">
                            <IconButton
                              variant={"ghost"}
                              colorScheme="green"
                              icon={<GrCheckmark />}
                              aria-label="Accept request action button"
                              size="sm"
                              mr={1}
                            />
                            <IconButton
                              variant={"ghost"}
                              colorScheme="red"
                              icon={<RxCross1 />}
                              aria-label="Deny request action button"
                              size="sm"
                              ml={1}
                            />
                          </Flex>
                        </Flex>
                      ))}
                  </Box>
                </TabPanel>
                {/* Invited Tab */}
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
                          py="1"
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
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ManageMembersModal;
