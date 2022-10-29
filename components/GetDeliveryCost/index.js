import { useEffect, useState } from 'react';
import axiosInstance from '../../src/config/api';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  FormLabel,
  FormControl,
  VStack,
  useToast,
} from '@chakra-ui/react';

function GetDeliveryCost(props) {
  const { isOpen, onClose, setSelectedDeliveryCost, setSelectedCourier } =
    props;
  const [choosedCourier, setChoosedCourier] = useState('');
  const [choosedService, setChoosedService] = useState('');
  const [deliveryCost, setDeliveryCost] = useState([]);

  const toast = useToast();

  useEffect(() => {
    if (choosedCourier) {
      getDeliveryCost();
    }
  }, [choosedCourier]);

  const onHandleChangeCourier = (e) => {
    setChoosedCourier(e.target.value);
  };

  const onHandleChangeService = (e) => {
    setChoosedService(e.target.value);
  };

  const getDeliveryCost = async () => {
    try {
      const origin = '153';
      const destination = props.destination;
      const weight = 1000;
      const courier = choosedCourier;

      const resGetDeliveryCost = await axiosInstance.get(
        `rajaongkir/ongkos/${origin}/${destination}/${weight}/${courier}`,
      );
      setDeliveryCost(resGetDeliveryCost.data.rajaongkir.results[0].costs);
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderDeliveryCost = () => {
    return deliveryCost.map((deliveryCost) => (
      <option
        key={deliveryCost.service}
        value={`${deliveryCost.service},${deliveryCost.cost[0].value}`}
      >
        {`${deliveryCost.description} (${deliveryCost.service}), Biaya Pengiriman: ${deliveryCost.cost[0].value}`}
      </option>
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="white" padding={5} maxWidth={600}>
        <ModalHeader fontWeight={600} fontSize={19}>
          Pilih Jenis Pengiriman
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" fontSize={15} fontWeight={500}>
            <VStack>
              <FormControl>
                <FormLabel fontSize={'sm'}>Kurir Pengiriman</FormLabel>
                <Select
                  _focusVisible
                  name="courier"
                  fontSize={{ base: '13', md: '14' }}
                  fontWeight={400}
                  placeholder="Pilih Kurir"
                  variant="filled"
                  width={510}
                  onChange={onHandleChangeCourier}
                >
                  <option value="jne">JNE</option>
                  <option value="tiki">TIKI</option>
                  <option value="pos">POS Indonesia</option>
                </Select>
              </FormControl>
            </VStack>
            <VStack paddingTop={3}>
              <FormControl>
                <FormLabel fontSize={'sm'}>Jenis Pengiriman</FormLabel>
                <Select
                  _focusVisible
                  name="deliveryCost"
                  fontSize={14}
                  fontWeight={400}
                  placeholder="Pilih Jenis Pengiriman"
                  variant="filled"
                  width={510}
                  onChange={onHandleChangeService}
                >
                  {renderDeliveryCost()}
                </Select>
              </FormControl>
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            height={9}
            fontSize={15}
            fontWeight={500}
            colorScheme="messenger"
            onClick={() => {
              setSelectedCourier(choosedCourier);
              setSelectedDeliveryCost(choosedService);
              toast({
                description: 'Select Delivery Method Success',
                position: 'top',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
              onClose();
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default GetDeliveryCost;
