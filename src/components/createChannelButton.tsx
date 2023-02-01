import { useSupabase } from "@/lib/supabaseClient";
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useBoolean,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { VscAdd } from "react-icons/vsc";
import { useState } from "react";
import { Field, FieldProps, Form, Formik } from "formik";
import { ResponseData } from "@/pages/api/channels/join/[inviteId]";
import { handleJoin } from "@/lib/helpers";
import { useRouter } from "next/router";

function CreateChannelButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isJoin, setIsJoin] = useBoolean();
  const { supabase, channels, user } = useSupabase();
  const toast = useToast();
  const router = useRouter();
  if (!user) return null;

  const CreateModal = () => {
    return (
      <Formik
        initialValues={{
          name: null,
          avatar_url: null,
          is_public: false,
        }}
        onSubmit={async (values, actions) => {
          const res = await supabase
            .from("channels")
            .insert([
              {
                owner_id: user.id,
                name: !!values.name
                  ? (values.name as unknown as string).trim()
                  : null,
                avatar_url: values.avatar_url,
                is_private: !values.is_public,
              },
            ])
            .select()
            .single();

          if (res.error) {
            toast({ title: `${res.error.message}`, status: "error" });
          }

          if (!!res.data) {
            const membersRes = await supabase.from("members").insert([
              {
                channel_id: res.data.id,
                user_id: user.id,
                is_joined: true,
                joined_at: `${new Date().toISOString()}`,
              },
            ]);

            if (membersRes.error) {
              toast({
                title: `${membersRes.error.message}`,
                status: "error",
              });
            } else {
              actions.resetForm();
              actions.setSubmitting(false);
              onClose();
              toast({
                title: `Successfully added a channel!`,
                status: "success",
                duration: 10000,
                isClosable: true,
              });
            }
          }
        }}
      >
        {(props) => (
          <Form>
            <ModalBody>
              <VStack align={"flex-start"}>
                <FormControl isRequired>
                  <FormLabel>Channel Name</FormLabel>
                  <Field
                    as={Input}
                    autoFocus
                    id="name"
                    name="name"
                    variant="filled"
                    type="text"
                    value={undefined}
                  />
                  {/* <FormErrorMessage>{errors.password}</FormErrorMessage> */}
                </FormControl>
                <Field
                  as={Checkbox}
                  id="is_public"
                  name="is_public"
                  colorScheme="cyan"
                >
                  Public?
                </Field>

                <Link onClick={() => setIsJoin.on()}>Join a channel?</Link>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button w="100%" type="submit" colorScheme="cyan">
                Create
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    );
  };

  const JoinModal = () => {
    return (
      <Formik
        initialValues={{
          vanity_url: "",
        }}
        onSubmit={async (values, actions) => {
          const res = (await fetch(
            `http://${
              process.env.VERCEL_URL || "localhost:3000"
            }/api/channels/join/${values.vanity_url}`
          ).then((res) => res.json())) as ResponseData;

          if (res.error) {
            toast({ title: `${res.error.message}`, status: "error" });
          }

          if (!!res.channel) {
            handleJoin({
              router,
              user,
              toast,
              supabase,
              channels,
              channel: res.channel,
            });
            onClose();
          }
        }}
      >
        {(props) => (
          <Form>
            <ModalBody>
              <VStack align={"flex-start"}>
                <FormControl isRequired>
                  <FormLabel>Vanity URL</FormLabel>
                  <Field
                    as={Input}
                    autoFocus
                    id="vanity_url"
                    name="vanity_url"
                    variant="filled"
                    type="text"
                    value={undefined}
                  />
                </FormControl>
                <Link onClick={() => setIsJoin.off()}>Create a channel?</Link>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" w="100%" colorScheme="cyan">
                Join
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <>
      <Menu isLazy>
        <Tooltip hasArrow placement="right" label="Add a channel">
          <MenuButton
            as={IconButton}
            aria-label="Add Channel Button"
            icon={<VscAdd />}
            fontSize="lg"
            size="xs"
            variant="outline"
            isRound
          />
        </Tooltip>
        <MenuList>
          <MenuItem
            onClick={() => {
              setIsJoin.off();
              onOpen();
            }}
          >
            Create
          </MenuItem>
          <MenuItem
            onClick={() => {
              setIsJoin.on();
              onOpen();
            }}
          >
            Join
          </MenuItem>
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isJoin ? "Join a channel" : "Create a channel"}
          </ModalHeader>
          <ModalCloseButton />
          {isJoin ? <JoinModal /> : <CreateModal />}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateChannelButton;
