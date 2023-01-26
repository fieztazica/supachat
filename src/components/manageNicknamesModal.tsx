import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

function ManageNicknamesModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();


  return (
    <>
      <Button onClick={onOpen} w={"100%"}>
        Manage nicknames
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage nicknames</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            nickname
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ManageNicknamesModal;
