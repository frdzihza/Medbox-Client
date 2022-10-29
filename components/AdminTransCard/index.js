import {
  Button,
  Box,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import Image from 'next/image';
import TransactionDetails from '../AdminDetailTrans';
import { api_origin } from '../../constraint';

export default function AdminTransCard(props) {
  const {
    key,
    trans_id,
    transaction_details,
    productName,
    totalPrice,
    status,
    productImage,
    courier,
    deliveryCost,
    createdAt,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const rawStatus = status.split('_');

  const grandTotal = deliveryCost + totalPrice;

  return (
    <Box>
      <Text fontWeight={600} marginBottom={1} marginLeft={'81'}>
        No. Invoice: {trans_id}
      </Text>
      <HStack
        bg={'gray.50'}
        height={125}
        spacing="120"
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
            Total Harga: Rp. {grandTotal.toLocaleString('id')}
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
              key={key}
              transaction_details={transaction_details}
              productName={productName}
              productImage={productImage}
              status={status}
              totalPrice={totalPrice}
              trans_id={trans_id}
              courier={courier}
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
      </HStack>
    </Box>
  );
}
