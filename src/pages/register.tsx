import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  InputGroup,
  InputRightElement,
  Stack,
  IconButton,
  useDisclosure,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  SupabaseClient,
  useSession,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
// import { supabase } from "@/lib/supabaseClient";
import { useFormik } from "formik";
import { FaDiscord } from "react-icons/fa";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next/types";
import { useRouter } from "next/router";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import NextLink from "next/link";
import { useSupabase } from "@/lib/supabaseClient";
import { GuestRoute } from "@/lib/auth/ProtectedRoute";

function Register() {
  const { session, supabase } = useSupabase();
  const router = useRouter();
  const pwd = useDisclosure();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      password_repeat: "",
      full_name: "",
      username: "",
    },
    onSubmit: async (values) => {
      const { data, error } = await supabase.auth.signUp({
        email: `${values.email}`,
        password: `${values.password}`,
        options: {
          data: {
            full_name: `${values.full_name}`,
            username: `${values.username}`,
          },
        },
      });

      if (error) {
        console.log(error);
        toast({ title: `${error.message}`, status: "error" });
      }

      console.log(data, error);

      if (data.user) {
        toast({
          title: `Successfully signed you up.`,
          description: `A confirmation mail should be sent soon!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    validate(values) {
      const errors: any = {};

      if (
        values.password != values.password_repeat &&
        values.password_repeat != ""
      ) {
        errors.password_repeat = "Passwords are not the same";
      }

      return errors;
    },
  });

  async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
    });

    if (error) {
      console.log(error);
      toast({ title: `${error.message}`, status: "error" });
    }
  }

  useEffect(() => {
    if (session !== null) router.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <Flex minH="100vh" align={"center"} justify={"center"}>
      <Stack
        spacing={{ base: "4", md: "8" }}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
      >
        <Stack align={"center"}>
          <Heading fontSize={{ base: "2xl", md: "4xl" }}>
            Let&#39;s join us!
          </Heading>
          <Text fontSize={{ base: "xs", md: "lg" }} color={"gray.600"}>
            then chat with{" "}
            <Link as={NextLink} color={"cyan"} href="/">
              people
            </Link>{" "}
            around the world 🌐
          </Text>
        </Stack>
        <Card minW={{ base: "full", md: "md" }}>
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              <Stack direction={["column", "row"]}>
                <FormControl isRequired>
                  <FormLabel htmlFor="full_name">Full Name</FormLabel>
                  <Input
                    name="full_name"
                    id="full_name"
                    placeholder="Your full name"
                    type={"text"}
                    onChange={formik.handleChange}
                    value={formik.values.full_name}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Your beautiful username"
                    type={"text"}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                  />
                </FormControl>
              </Stack>

              <FormControl isRequired>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  name="email"
                  placeholder="Your email"
                  type={"email"}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </FormControl>
              <FormControl
                isRequired
                isInvalid={formik.errors.password_repeat ? true : false}
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    placeholder="Your password"
                    type={pwd.isOpen ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  <InputRightElement>
                    <IconButton
                      icon={pwd.isOpen ? <IoMdEye /> : <IoMdEyeOff />}
                      onClick={pwd.onToggle}
                      aria-label="Toggle show password"
                      variant={"ghost"}
                      isRound
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={formik.errors.password_repeat ? true : false}
              >
                <FormLabel>Repeat Your Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password_repeat"
                    placeholder="Repeat your password"
                    type={pwd.isOpen ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.password_repeat}
                  />
                  <InputRightElement>
                    <IconButton
                      icon={pwd.isOpen ? <IoMdEye /> : <IoMdEyeOff />}
                      onClick={pwd.onToggle}
                      aria-label="Toggle show password"
                      variant={"ghost"}
                      isRound
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {formik.errors.password_repeat}
                </FormErrorMessage>
              </FormControl>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Link as={NextLink} href="/login">
                  Already have an account?
                </Link>
              </Stack>
              <Button type="submit" mt={4} width={"full"} colorScheme={"cyan"}>
                Sign up
              </Button>
            </form>
            <Divider mt={4} />
            <Button
              variant={"outline"}
              leftIcon={<FaDiscord />}
              onClick={signInWithDiscord}
              width="full"
              mt={4}
            >
              Continue with Discord
            </Button>
          </CardBody>
        </Card>
      </Stack>
    </Flex>
  );
}

export default Register;

Register.defaultProps = {
  meta: {
    title: "SupaChat | Sign Up",
  },
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => GuestRoute({ context, redirectTo: "/chat" });
