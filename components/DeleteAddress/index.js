import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  Button,
  useToast,
} from '@chakra-ui/react';
import axiosInstance from '../../src/config/api';

function DeleteAddress(props) {
  const { isOpen, onClose, address_id, RenderUserAddresses } = props;

  const toast = useToast();

  async function onDeleteClick() {
    try {
      const resDeleteAddress = await axiosInstance.delete(
        `/addresses/${address_id}`,
      );
      toast({
        description: resDeleteAddress.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      RenderUserAddresses();
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        backgroundColor="white"
        paddingTop={4}
        paddingBottom={9}
        paddingRight={5}
        maxWidth={350}
      >
        <ModalHeader>
          <Text fontWeight={600} fontSize={16} paddingLeft={9}>
            Hapus Alamat?
          </Text>
        </ModalHeader>
        <ModalCloseButton margin={5} />
        <ModalBody>
          <VStack>
            <HStack>
              <HStack paddingLeft={5}>
                <Button
                  colorScheme="red"
                  variant="outline"
                  fontSize={16}
                  fontWeight={500}
                  width={105}
                  marginRight={2}
                  onClick={() => {
                    onClose();
                  }}
                >
                  Tidak
                </Button>
                <Button
                  colorScheme="green"
                  variant="outline"
                  fontSize={16}
                  fontWeight={500}
                  width={105}
                  onClick={() => {
                    onDeleteClick(), onClose();
                  }}
                >
                  Ya
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default DeleteAddress;
