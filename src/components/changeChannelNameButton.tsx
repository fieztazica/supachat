import { useSupabase } from "@/lib/supabaseClient";
import { Channel } from "@/types";
import {
  Button,
  Flex,
  IconButton,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";

function ChangeChannelNameButton({ channel }: { channel: Channel }) {
  const { user, supabase, channels } = useSupabase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState<string>(channel.name ?? "");
  const toast = useToast();

  if (!user) return null;

  const handleOnClose = () => {
    onClose();
    if (!!channel.name && value === channel.name) return;
    (async () => {
      const { error } = await supabase
        .from("channels")
        .update({ name: value })
        .eq("id", channel.id);

      if (error) {
        console.error(error);
        toast({ title: error.message, status: "error" });
      }
    })();
  };

  return (
    <>
      {isOpen ? (
        <Flex justifyContent={"space-between"} w="100%">
          <Input
            autoFocus
            w="100%"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            mr={1}
          />
          <IconButton
            aria-label="Confirm change channel name button"
            ml={1}
            onClick={handleOnClose}
            icon={<IoMdCheckmark />}
          />
        </Flex>
      ) : (
        <Button w="100%" onClick={onOpen}>
          Change channel name
        </Button>
      )}
    </>
  );
}

export default ChangeChannelNameButton;
