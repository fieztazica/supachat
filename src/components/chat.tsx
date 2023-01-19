import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { MdSend } from "react-icons/md";
import { Field, FieldProps, Form, Formik } from "formik";
import { useSupabase } from "@/lib/supabaseClient";
import { Channel, Message } from "@/types";
import { useRouter } from "next/router";

interface FormValues {
  message: string;
}

function Chat({ channel, ...props }:{channel: Channel}) {
  const { profile } = useSupabase();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  // const router = useRouter();
  // const { channelId } = router.query
  // console.log(messages);
  return (
    <Flex direction="column" h={"$100vh"} {...props}>
      <Box px={2} h={"$100vh"} overflow="auto">
        {messages.map((m: Message, i: number) => (
          <Stack key={i} align="center" direction={"row-reverse"} my={2} p={1}>
            <Avatar size="sm" />
            <Flex direction={"column"} align="end">
              <Text mx={1}>{profile?.full_name}</Text>
              <Text bg={"gray"} rounded={"full"} px={2} w="fit-content">
                {m.content}
              </Text>
            </Flex>
          </Stack>
        ))}
      </Box>
      <Box mb={4} mx={4}>
        <Formik
          initialValues={{ message: "" }}
          onSubmit={(values, actions) => {
            setMessages((old) => [
              ...old,
              {
                channel_id: channel.id,
                content: values.message,
                created_at: null,
                id: "",
                user_id: profile?.id!,
                type: null,
                reactions: null,reply_to_message_id: null
              },
            ]);
            actions.resetForm();
            actions.setSubmitting(false);
            setTimeout(() => {
              
            }, 500);
          }}
        >
          {(props) => (
            <Form>
              <Field name="message">
                {({ field, form }: FieldProps<string, { message: string }>) => (
                  <FormControl>
                    {/* <FormLabel>First name</FormLabel> */}
                    <InputGroup>
                      <Input placeholder="Say s0m3th1ng" {...field} />
                      <InputRightElement>
                        <IconButton
                          icon={<MdSend />}
                          variant="ghost"
                          isLoading={props.isSubmitting}
                          aria-label="Send message button"
                          type="submit"
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{form.errors.message}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
}

export default Chat;
