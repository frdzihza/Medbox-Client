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
import { useState } from 'react';
import axiosInstance from '../../src/config/api';

function UpdateAddedStock(props) {
  const { isOpen, onClose, product_id, stock_opname_id, fetchStockOpname } =
    props;
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  const onPrevClick = () => {
    setQuantity(quantity - 1);
  };

  const onNextClick = () => {
    setQuantity(quantity + 1);
  };

  const updateAddedStock = async (product_id, stock_opname_id) => {
    try {
      const body = {
        productStock: quantity,
      };

      const res = await axiosInstance.patch(
        `/products/updateAddedStock/${product_id}/${stock_opname_id}`,
        body,
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
          <Text fontWeight={500} fontSize={17}>
            Ubah Tambahan Stok Produk
          </Text>
        </ModalHeader>
        <ModalCloseButton margin={5} />
        <ModalBody>
          <VStack>
            <HStack paddingTop={1}>
              <Button
                marginRight={2}
                onClick={onPrevClick}
                isDisabled={quantity == 1}
                colorScheme="messenger"
                variant="outline"
              >
                -
              </Button>
              <Text paddingRight={2}>{quantity}</Text>
              <Button
                onClick={onNextClick}
                colorScheme="messenger"
                variant="outline"
              >
                +
              </Button>
              <HStack paddingLeft={5}>
                <Button
                  colorScheme="messenger"
                  variant="solid"
                  fontSize={13}
                  fontWeight={500}
                  onClick={() => {
                    updateAddedStock(product_id, stock_opname_id), onClose();
                  }}
                >
                  Ubah
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default UpdateAddedStock;
