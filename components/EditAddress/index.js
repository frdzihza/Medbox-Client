import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import axiosInstance from '../../src/config/api';

function EditAddress(props) {
  const {
    isOpen,
    onClose,
    address_id,
    RenderUserAddresses,
    editAddressDetail,
    editRecipient,
    editPostalCode,
  } = props;
  const [userAddress, setUserAddress] = useState('');
  const [getProvince, setGetProvince] = useState([]);
  const [getCity, setGetCity] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const splitProvince = selectedProvince.split(',');
  const province_id = splitProvince[0];
  const province = splitProvince[1];

  const splitCity = selectedCity.split(',');
  const city_id = splitCity[0];
  const city_name = splitCity[1];

  const toast = useToast();

  const {
    recipient = editRecipient,
    addressDetail = editAddressDetail,
    postalCode = editPostalCode,
  } = userAddress;

  useEffect(() => {
    fetchProvince();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchCity();
    }
  }, [selectedProvince]);

  const onEditAddress = async () => {
    try {
      const session = await getSession();

      const { user_token } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };

      const body = {
        recipient,
        province_id,
        province,
        city_id,
        city_name,
        addressDetail,
        postalCode,
      };

      const res = await axiosInstance.patch(
        `/addresses/update/${address_id}`,
        body,
        config,
      );

      toast({
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      RenderUserAddresses();
    } catch (error) {
      console.log({ error });
      toast({
        description: 'Semua Field Harus Terisi',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onHandleChange = (e) => {
    setUserAddress({ ...userAddress, [e.target.name]: e.target.value });
  };

  const onHandleChangeProvince = (e) => {
    setSelectedProvince(e.target.value);
  };

  const onHandleChangeCity = (e) => {
    setSelectedCity(e.target.value);
  };

  const renderProvince = () => {
    return getProvince.map((province) => (
      <option
        key={province.province_id}
        value={`${province.province_id},${province.province}`}
      >
        {province.province}
      </option>
    ));
  };

  const renderCity = () => {
    return getCity.map((city) => (
      <option key={city.city_id} value={`${city.city_id},${city.city_name}`}>
        {city.city_name}
      </option>
    ));
  };

  const fetchProvince = async () => {
    try {
      const resGetProvince = await axiosInstance.get('/rajaongkir/provinsi');
      setGetProvince(resGetProvince.data.rajaongkir.results);
    } catch (error) {
      console.log({ error });
    }
  };

  const fetchCity = async () => {
    try {
      const resGetCity = await axiosInstance.get(
        `/rajaongkir/kota/${selectedProvince}`,
      );
      setGetCity(resGetCity.data.rajaongkir.results);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        backgroundColor="white"
        padding={{ md: '4' }}
        paddingY={{ base: '3' }}
        marginX={{ base: '4' }}
      >
        <ModalHeader fontWeight={600} fontSize={{ base: '16', md: '19' }}>
          Ubah Alamat
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            align="start"
            fontSize={{ base: '14', md: '15' }}
            fontWeight={500}
          >
            <Text paddingTop={2}>Penerima</Text>
            <Input
              _focusVisible
              name="recipient"
              type="text"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              value={recipient}
              variant="filled"
              mb={3}
              onChange={onHandleChange}
            />
            <Text>Provinsi</Text>
            <Select
              _focusVisible
              name="province_id"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              placeholder="Pilih Provinsi"
              variant="filled"
              onChange={onHandleChangeProvince}
            >
              {renderProvince()}
            </Select>
            <Text paddingTop={2}>Kota</Text>
            {getCity && (
              <Select
                _focusVisible
                name="city_id"
                fontSize={{ base: '13', md: '14' }}
                fontWeight={400}
                placeholder="Pilih Kota"
                variant="filled"
                onChange={onHandleChangeCity}
                mb={3}
              >
                {renderCity()}
              </Select>
            )}
            <Text paddingTop={2}>Detail Alamat</Text>
            <Input
              _focusVisible
              name="addressDetail"
              type="text"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              value={addressDetail}
              variant="filled"
              mb={3}
              onChange={onHandleChange}
            />
            <Text paddingTop={2}>Kode Pos</Text>
            <Input
              _focusVisible
              name="postalCode"
              type="number"
              fontSize={{ base: '13', md: '14' }}
              fontWeight={400}
              value={postalCode}
              variant="filled"
              mb={3}
              onChange={onHandleChange}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            height={9}
            fontSize={15}
            fontWeight={500}
            colorScheme="messenger"
            onClick={() => {
              onEditAddress(userAddress), onClose();
            }}
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditAddress;
