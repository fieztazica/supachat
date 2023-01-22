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

function CreateChannelButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isJoin, setIsJoin] = useBoolean();
  const { supabase } = useSupabase();
  const { user } = useSupabase();
  const toast = useToast();

  if (!user) return null;

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
                    name: values.name,
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
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" colorScheme="cyan" mr={3}>
                    Create
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateChannelButton;
