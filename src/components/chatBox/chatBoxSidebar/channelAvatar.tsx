import { useSupabase } from "@/lib/supabaseClient";
import { Channel } from "@/types";
import { Avatar } from "@chakra-ui/react";
import { useState, useEffect } from "react";

function ChannelAvatar({ channel }: { channel: Channel }) {
  const { supabase } = useSupabase();
  const [avatarUrl, setAvatarUrl] = useState<Channel["avatar_url"]>(null);

  useEffect(() => {
    const isValidUrl = (urlString: string) => {
      try {
        return Boolean(new URL(urlString));
      } catch (e) {
        return false;
      }
    };
    (async () => {
      if (!channel.avatar_url) return;

      if (isValidUrl(channel.avatar_url)) return;

      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(channel.avatar_url);

        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    })();
  }, [channel]);

  return <Avatar src={avatarUrl ?? undefined} />;
}

export default ChannelAvatar;
