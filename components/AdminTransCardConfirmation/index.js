import {
  Button,
  Box,
  HStack,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Image from 'next/image';
import axiosInstance from '../../src/config/api';
import TransactionDetails from '../AdminDetailTrans';
import { api_origin } from '../../constraint';

export default function AdminTransCardConfirmation(props) {
  const {
    trans_id,
    productName,
    totalPrice,
    status,
    productImage,
    courier,
    deliveryCost,
    transaction_details,
    createdAt,
    fetchTransactions,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const deliverOrder = async () => {
    try {
      const res = await axiosInstance.patch(
        `/transactions/adminConfirmDeliver/${trans_id}`,
      );
      fetchTransactions();
      toast({
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log({ Error });
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

  const cancelOrder = async () => {
    try {
      const res = await axiosInstance.patch(
        `/transactions/adminCancelOrder/${trans_id}`,
      );
      fetchTransactions();
      toast({
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log({ Error });
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

  const rawStatus = status.split('_');
  return (
    <Box>
      <Text fontWeight={600} marginBottom={1} marginLeft={'81'}>
        No. Invoice: {trans_id}
      </Text>
      <HStack
        bg={'gray.50'}
        height={125}
        spacing="50"
        marginBottom={3}
        ml={'70'}
        px={8}
        rounded={6}
        boxShadow="md"
      >
        <Image
          unoptimized
          alt="resep-logo"
          width={70}
          height={70}
          src={api_origin + productImage}
        />
        <VStack>
          <Text w="200px" fontSize={16} fontWeight={600}>
            {productName}
          </Text>
          <Text w="200px" fontSize={14} fontWeight={450}>
            Total Harga: Rp. {totalPrice.toLocaleString('id')}
          </Text>
          <Button
            color="linkedin.500"
            variant="link"
            paddingRight={95}
            fontSize={13}
            fontWeight={500}
            onClick={onOpen}
          >
            Detail Transaksi
            <TransactionDetails
              isOpen={isOpen}
              onClose={onClose}
              key={trans_id}
              productName={productName}
              productImage={productImage}
              status={status}
              totalPrice={totalPrice}
              trans_id={trans_id}
              courier={courier}
              transaction_details={transaction_details}
              deliveryCost={deliveryCost}
              createdAt={createdAt}
              props={props}
            />
          </Button>
        </VStack>
        <Box w="200px" fontSize="15" fontWeight={500}>
          Status: {rawStatus.join(' ')}
        </Box>
        <VStack textAlign="center" fontWeight={500}>
          <Text w="160px" fontSize="14">
            Tanggal Pemesanan:
          </Text>
          <Text w="150px" fontSize="13">
            {createdAt.slice(0, 10)}
          </Text>
        </VStack>
        <VStack textAlign="center" fontWeight={500}>
          <Button
            variant="outline"
            colorScheme="green"
            width={180}
            fontSize={14}
            onClick={deliverOrder}
          >
            Konfirmasi Pesanan
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            width={180}
            fontSize={14}
            onClick={cancelOrder}
          >
            Batalkan Pesanan
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
}
