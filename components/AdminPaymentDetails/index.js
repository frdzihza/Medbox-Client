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

function AdminPaymentDetails(props) {
  const {
    isOpen,
    onClose,
    key,
    paymentProof
  } = props;
 

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
          Bukti Pembayaran
        </ModalHeader>
        <ModalCloseButton margin={5} />
        <ModalBody>
          <VStack fontWeight={400} fontSize={15} paddingY={5}>
            <Image
              unoptimized
              alt="resep-logo"
              width={300}
              height={400}
              src={paymentProof}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AdminPaymentDetails;
