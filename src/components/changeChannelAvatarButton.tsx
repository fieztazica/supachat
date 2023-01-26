import { useSupabase } from "@/lib/supabaseClient";
import { Channel } from "@/types";
import { Button, Input, InputGroup, useToast } from "@chakra-ui/react";
import { ChangeEvent, useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

function ChangeChannelAvatarButton({ channel }: { channel: Channel }) {
  const [uploading, setUploading] = useState<boolean>(false);
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const { supabase, user } = useSupabase();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const upload = async () => {
      try {
        setUploading(true);

        if (!file || !user || !channel) {
          throw new Error("You must select an image to upload.");
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        let { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        if (uploadData) {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(uploadData.path);

          if (data) {
            let { error: updateChannelError } = await supabase
              .from("channels")
              .update({ avatar_url: data.publicUrl ?? null })
              .eq("id", channel.id);

            if (updateChannelError) {
              throw updateChannelError;
            }
          }
        }
      } catch (error: any) {
        console.log(error);
        toast({
          title: error.message,
          status: "error",
        });
      } finally {
        setUploading(false);
      }
    };
    if (!!file) upload();
  }, [file]);

  return (
    <InputGroup>
      <Input
        ref={fileRef}
        name={"channelAvatar"}
        type={"file"}
        accept={"image/*"}
        onChange={handleFileChange}
        hidden={true}
      ></Input>
      <Button
        w={"100%"}
        onClick={() => {
          fileRef.current?.click();
        }}
        isLoading={uploading}
      >
        Change channel avatar
      </Button>
    </InputGroup>
  );
}

export default ChangeChannelAvatarButton;
