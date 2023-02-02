import { useSupabase } from "@/lib/supabaseClient";
import {
  Button,
  Card,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";

function ForgotPwd({ children }: { children: JSX.Element }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { supabase } = useSupabase();
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        `${values.email}`,
        // {
        //   redirectTo: `${window.location.origin}/reset`,
        // }
      );

      if (error) {
        console.log(error);
        toast({ title: `${error.message}`, status: "error" });
      }

      if (data && !error) {
        toast({
          title: `An email has been sent!`,
          description: ` Check your mailbox for next step!`,
          status: "success",
        });
      }
    },
  });

  return (
    <>
      <Link onClick={onOpen}>{children}</Link>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader>Send Password Reset Request</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  placeholder="Your email"
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  autoFocus
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme={"cyan"}
                isLoading={formik.isSubmitting}
              >
                Send
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ForgotPwd;
