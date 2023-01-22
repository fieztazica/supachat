import {
  Avatar,
  Box,
  Button,
  Center,
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
import Messages from "./messages";
import ChatInput from "./chatInput";

interface FormValues {
  message: string;
}

function Chat({ channel, ...props }: { channel: Channel }) {
  const { user } = useSupabase();

  if (!user)
    return (
      <Center flex="1">
        <Text>There is nothing here.</Text>
      </Center>
    );

  return (
    <>
      <Box flex="1" overflow={"auto"} p={2}>
        <Messages channelId={channel.id} />
      </Box>
      <Box p={2}>
        <ChatInput userId={user.id} channelId={channel.id} />
      </Box>
    </>
  );
}

export default Chat;
