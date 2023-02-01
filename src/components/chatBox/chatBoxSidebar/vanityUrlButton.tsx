import { useSupabase } from "@/lib/supabaseClient";
import { Channel } from "@/types";
import {
  Button,
  Flex,
  IconButton,
  Input,
  useDisclosure,
  useForceUpdate,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { IoMdCheckmark, IoMdLink } from "react-icons/io";

function VanityUrlButton({ channel }: { channel: Channel }) {
  const { user, supabase, channels } = useSupabase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState<string>();
  const toast = useToast();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    setValue(channel.vanity_url ?? "");
  }, [channel, channels]);

  const handleOnClose = () => {
    onClose();
    if (!!channel.vanity_url && value === channel.vanity_url) return;
    (async () => {
      const { error } = await supabase
        .from("channels")
        .update({ vanity_url: value })
        .eq("id", channel.id);

      if (error) {
        console.error(error);
        toast({ title: error.message, status: "error" });
      }
      forceUpdate();
    })();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/j/${channel.vanity_url}`
    );
    toast({
      title: `Copied!`,
    });
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
        <Flex justifyContent={"space-between"} w="100%">
          <Button w="100%" onClick={onOpen}>
            {channel.vanity_url
              ? `j/${channel.vanity_url}`
              : "Set a vanity URL"}
          </Button>
          {channel.vanity_url && (
            <IconButton
              aria-label="Copy vanity URL Button"
              ml={1}
              onClick={handleCopy}
              icon={<IoMdLink />}
            />
          )}
        </Flex>
      )}
    </>
  );
}

export default VanityUrlButton;
