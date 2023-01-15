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
        {
          redirectTo: `http://localhost:3000/update-password`,
        }
      );

      if (error) {
        console.log(error);
        toast({ title: `${error.message}`, status: "error" });
      }

      if (data && !error) {
        toast({
          title: `An mail has been sent! Check your mailbox for next step!`,
          status: "success",
        });
        console.log(data)
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
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" isLoading={formik.isSubmitting}>
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
