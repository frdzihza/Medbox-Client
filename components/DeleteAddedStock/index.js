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

function DeleteAddedStock(props) {
  const { isOpen, onClose, product_id, fetchStockOpname, stock_opname_id } =
    props;

  const toast = useToast();

  const deleteAddedStock = async (product_id, stock_opname_id) => {
    try {
      const res = await axiosInstance.delete(
        `/products/deleteAddedStock/${product_id}/${stock_opname_id}`,
      );

      toast({
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchStockOpname();
    } catch (error) {
      console.log({ error });
      toast({
        title: 'Unexpected Fail!',
        description: error.response.data?.message
          ? error.response.data.message
          : error.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        backgroundColor="white"
        paddingTop={4}
        paddingBottom={9}
        paddingX={5}
        maxWidth={480}
      >
        <ModalHeader>
          <Text fontWeight={500} fontSize={18}>
            Hapus Tambahan Stock?
          </Text>
        </ModalHeader>
        <ModalCloseButton margin={5} />
        <ModalBody>
          <VStack>
            <HStack paddingTop={1}>
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
                    deleteAddedStock(product_id, stock_opname_id), onClose();
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

export default DeleteAddedStock;
