import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useFormik } from "formik";
import { FaDiscord } from "react-icons/fa";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import NextLink from "next/link";
import HCaptcha from "@hcaptcha/react-hcaptcha";
// import { supabase } from "@/lib/supabaseClient";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSupabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import ForgotPwd from "@/components/forgotPwd";
import { GuestRoute } from "@/lib/auth/ProtectedRoute";

function Login() {
  const { session, supabase } = useSupabase();
  // const supabase = useSupabaseClient()
  // const session = useSession()
  const router = useRouter();
  const pwd = useDisclosure();
  const toast = useToast();
  // const [captchaToken, setCaptchaToken] = useState<string>();
  // const captcha = useRef();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${values.email}`,
        password: `${values.password}`,
        // options: {
        //   captchaToken,
        // },
      });

      if (error) {
        console.log(error);
        toast({ title: `${error.message}`, status: "error" });
      }

      if (data.user && data.session) {
        toast({ title: `Successfully logged you in!`, status: "success" });
      }
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
            Sign in to your account
          </Heading>
          <Text fontSize={{ base: "xs", md: "lg" }} color={"gray.600"}>
            to connect{" "}
            <Link as={NextLink} color={"cyan"} href="/">
              people
            </Link>{" "}
            around the world 🌐
          </Text>
        </Stack>
        <Card minW={["full", "md"]}>
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  placeholder="Your email"
                  type={"email"}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </FormControl>
              <FormControl isRequired>
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
              <Stack direction="row" align={"start"} justify={"space-between"}>
                <Link as={NextLink} href="/register">
                  <Text fontSize={["sm", "md"]}>
                    Don&#39;t have an account?
                  </Text>
                </Link>
                <ForgotPwd>
                  <Text fontSize={["sm", "md"]}>Forgot password?</Text>
                </ForgotPwd>
              </Stack>
              {/* <HCaptcha
                ref={captcha}
                sitekey="e4634c31-63bc-4995-b7ad-0a826d9e9bf0"
                onVerify={(token: string) => {
                  setCaptchaToken(token);
                }}
              /> */}
              <Button
                type="submit"
                mt={4}
                width={"full"}
                colorScheme={"cyan"}
                isLoading={formik.isSubmitting}
              >
                Sign in
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

export default Login;

Login.defaultProps = {
  meta: {
    title: 'SupaChat | Sign In'
  }
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => GuestRoute({ context, redirectTo: "/chat" });
