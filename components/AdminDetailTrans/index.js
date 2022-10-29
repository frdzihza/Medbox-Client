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
} from '@chakra-ui/react';
import Image from 'next/image';
import { api_origin } from '../../constraint';

function TransactionDetails(props) {
  const {
    isOpen,
    onClose,
    key,
    trans_id,
    transaction_details,
    totalPrice,
    status,
    courier,
    deliveryCost,
    createdAt,
  } = props;
  const rawStatus = status.split('_');

  const grandTotal = deliveryCost + totalPrice;

  function mappedProducts() {
    return transaction_details?.map((transaction, index) => {
      let totalProductPrice =
        transaction.quantity * transaction.product.productPrice;

      return (
        <VStack align="start" key={key}>
          <HStack>
            <VStack marginLeft={7} marginRight={8} marginBottom={4}>
              <Image
                unoptimized
                alt="resep-logo"
                width={70}
                height={70}
                src={api_origin + transaction.product.productImage}
              />
            </VStack>
            <VStack align="start" paddingBottom={5} fontSize={13}>
              <Text> {transaction.product.productName}</Text>
              <HStack>
                <Text>{transaction.quantity}</Text>
                <Text>x</Text>
                <Text>
                  Rp {transaction.product.productPrice.toLocaleString('id')}
                </Text>
                <Text>= </Text>
                <Text>Rp {totalProductPrice.toLocaleString('id')}</Text>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      );
    });
  }

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
        <ModalHeader fontWeight={600} fontSize={20}>
          Detail Transaksi
        </ModalHeader>
        <ModalCloseButton margin={5} />
        <ModalBody>
          <VStack align="start" fontWeight={400} fontSize={15}>
            <Text>Status : {rawStatus.join(' ')}</Text>
            <Text>No. Invoice : {trans_id}</Text>
            <Text>Kurir : {courier.toUpperCase()}</Text>
            <Text paddingBottom={4}>
              Tanggal Pemesanan : {createdAt.slice(0, 10)}
            </Text>
            <Text paddingBottom={4} fontWeight={500}>
              Detail Produk
            </Text>
            {mappedProducts()}
            <Text fontWeight={500} paddingTop={4} paddingBottom={2}>
              Rincian Pembayaran :
            </Text>
            <Text>Sub Total: Rp {totalPrice.toLocaleString('id')}</Text>
            <Text>
              Biaya Pengiriman: Rp {deliveryCost.toLocaleString('id')}
            </Text>
            <Text fontWeight={500} paddingTop={2}>
              Total: Rp {grandTotal.toLocaleString('id')}
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default TransactionDetails;
