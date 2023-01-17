import { Profile } from "@/types";
import { Avatar, AvatarBadge } from "@chakra-ui/react";

function AvatarStatus({ profile, ...props }: { profile?: Profile }) {
  return (
    <Avatar
      size="sm"
      name={profile?.full_name!}
      src={profile?.avatar_url || undefined}
      {...props}
    >
      <AvatarBadge
        boxSize="3"
        bg="green.500"
        // border="1px"
        // borderColor={useColorModeValue("white", "gray.800")}
      />
    </Avatar>
  );
}

export default AvatarStatus;
