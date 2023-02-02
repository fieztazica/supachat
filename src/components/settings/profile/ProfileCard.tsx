import { useProfile } from "@/lib/supabaseClient";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Icon,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import * as React from "react";

function ProfileCard() {
  const profile = useProfile();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const Form = () => {
    return (
      <form>
        <VStack align="left">
          <Box
            display={"inline-block"}
            position="relative"
            cursor={"pointer"}
            w="fit-content"
            border="1px"
            rounded={"full"}
            css={{
              "&": {
                "#editIcon": {
                  display: "none",
                  position: "absolute",
                  zIndex: "99",
                  top: 0,
                  left: 0
                },
              },
              "&:hover": {
                "#editIcon": {
                  display: "inline",
                },
                "#AvatarIcon": {
                  filter: "contrast(200%)",
                },
              },
            }}
          >
            <Avatar
              name={profile?.full_name!}
              src={profile?.avatar_url || undefined}
              size="2xl"
              id="AvatarIcon"
            />
            <Icon as={FiEdit} id="editIcon" />
          </Box>
          <Input defaultValue={profile?.full_name!} />

          <Input defaultValue={profile?.username!} />

          <Divider />
          <Button colorScheme={"cyan"} w="100%" onClick={onClose}>
            Save
          </Button>
        </VStack>
      </form>
    );
  };

  return (
    <>
      <Card title={profile?.id} minW="xs">
        <CardHeader>
          <Heading size="md">Details</Heading>
        </CardHeader>
        <CardBody>
          {isOpen ? (
            <Form />
          ) : (
            <VStack align="left">
              <Avatar
                name={profile?.full_name!}
                src={profile?.avatar_url || undefined}
                size="2xl"
              />
              <Text
                as="h1"
                fontSize={"2xl"}
                fontWeight="semibold"
                noOfLines={1}
              >
                {profile?.full_name}
              </Text>
              <Text as="i" fontSize={"md"} fontWeight="hairline">
                @{profile?.username}
              </Text>
              <Divider />
              <Button w="100%" onClick={onOpen}>
                Edit
              </Button>
            </VStack>
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default ProfileCard;
