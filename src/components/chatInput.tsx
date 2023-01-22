import { useSupabase } from "@/lib/supabaseClient";
import { Channel } from "@/types";
import {
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";
import { MdSend } from "react-icons/md";

function ChatInput({
  channelId,
  userId,
}: {
  channelId: number;
  userId: string;
}) {
  const { supabase } = useSupabase();
  //   const { setMessages } = useMessages({ channel });

  return (
    <Formik
      initialValues={{ message: "" }}
      onSubmit={async (values, actions) => {
        const res = await supabase.from("messages").insert([
          {
            channel_id: channelId,
            user_id: userId,
            content: values.message,
          },
        ]);
        if (res.error) {
          actions.setErrors({ message: res.error.message });
        } else {
          actions.resetForm();
          actions.setSubmitting(false);
        }
      }}
    >
      {(props) => (
        <Form>
          <Field name="message">
            {({ field, form }: FieldProps<string, { message: string }>) => (
              <FormControl isInvalid={form.errors.message ? true : false}>
                <InputGroup>
                  <Input placeholder="Say s0m3th1ng" {...field} />
                  <InputRightElement>
                    <IconButton
                      icon={<MdSend />}
                      fontSize={"2xl"}
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
  );
}

export default ChatInput;
