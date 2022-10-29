import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import axiosInstance from '../../src/config/api';
import '@fontsource/poppins';
import Navbar from '../../components/Navbar';
import {
  Text,
  VStack,
  Button,
  Link,
  HStack,
  ChakraProvider,
  Box,
  useToast,
  useDisclosure,
  Checkbox,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image';
import { api_origin } from '../../constraint';
import theme from '../../components/theme';
import { useRouter } from 'next/router';
import { AddIcon } from '@chakra-ui/icons';
import AddAddress from '../../components/AddAddress';
import GetDeliveryCost from '../../components/GetDeliveryCost';
import SelectAddress from '../../components/SelectAddress';

function UploadPrescriptionImage(props) {
  const router = useRouter();
  const [prescriptionImage, setPrescriptionImage] = useState({});
  const [prescription, setPrescription] = useState(props.prescription);
  const [userAllAddress, setUserAllAddress] = useState(props.userAllAddress);
  const [selectAddress, setSelectAddress] = useState(props.defaultAddress);
  const [selectedCourier, setSelectedCourier] = useState();
  const [selectedDeliveryCost, setSelectedDeliveryCost] = useState();
  const [modalSelectAddress, setModalSelectAddress] = useState(false);
  const [modalSelectCourier, setModalSelectCourier] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [prescriptionPost, setPrescriptionPost] = useState({
    prescriptionImage: '',
  });
  const [imageName, setImageName] = useState('');
  const [imgSource, setimgSource] = useState(
    api_origin + `/public/prescriptionImage/default-prescription-image.png`,
  );

  const toast = useToast();

  useEffect(() => {
    RenderUserAddresses();
  }, []);

  const chooseAddress = (newAddress) => {
    setSelectAddress(newAddress);
  };

  const RenderUserAddresses = async () => {
    try {
      const session = await getSession();

      if (!session) return { redirect: { destination: '/login' } };

      const { user_token } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };

      const defaultAddress = await axiosInstance.get(
        `/addresses/userdefaultaddress`,
        config,
      );
      setSelectAddress(defaultAddress.data.data);
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

  const onFileChange = (event) => {
    setPrescriptionImage(event.target.files[0]);
    setimgSource(URL.createObjectURL(event.target.files[0]));
    setImageName(event.target.files[0].name);
  };

  const renderCourier = () => {
    const getCourier = selectedDeliveryCost.split(',');
    const getSelectedCourier = `${selectedCourier.toUpperCase()}`;

    return <Text>{getSelectedCourier}</Text>;
  };

  const renderDeliveryCost = () => {
    const deliveryCost = selectedDeliveryCost.split(',');
    const getDeliveryCost = parseInt(deliveryCost[1]).toLocaleString('id');
    return (
      <HStack
        fontWeight={500}
        fontSize={15}
        justify="space-between"
        minWidth={380}
      >
        <HStack color="gray.600">
          <Text>Biaya Pengiriman :</Text>;
          <Text>{selectedDeliveryCost && renderCourier()}</Text>;
        </HStack>
        <HStack fontWeight={600}>
          <Text>Rp {getDeliveryCost}</Text>
        </HStack>
      </HStack>
    );
  };

  const createPrescripTransaction = async () => {
    try {
      const session = await getSession();

      const { user_token } = session.user;

      const deliveryCost = selectedDeliveryCost.split(',');
      const getDeliveryCost = parseInt(deliveryCost[1]);
      const body = new FormData();
      const body2 = {
        address_id: selectAddress.address_id,
        courier: selectedCourier,
        deliveryCost: getDeliveryCost,
        imageName,
      };

      body.append('prescriptionImage', prescriptionImage);

      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };

      const resCreateTransaction = await axiosInstance.post(
        '/transactions/uploadPrescriptionImage',
        body2,
        config,
      );

      const imageNameInserted =
        resCreateTransaction.data.data.prescriptionImageName;

      const resPostPrescriptionImage = await axiosInstance.post(
        `/transactions/createPrescriptionTransaction/${imageNameInserted}`,
        body,
        config,
      );

      toast({
        description: resCreateTransaction.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        router.replace('/');
      }, 1000);
    } catch (error) {
      console.log({ Error });
      toast({
        description: 'Resep Dokter, Alamat, dan Kurir Tidak Boleh Kosong',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      {!prescription.resFetchTransactions[0] ? (
        <HStack>
          <Box
            width="120vH"
            boxShadow="md"
            marginTop={4}
            marginLeft={101}
            marginRight={2}
            rounded="md"
            padding={6}
          >
            <VStack>
              <HStack marginBottom={2} fontSize="15" alignSelf="start">
                <NextLink href="/">
                  <Link>
                    <Text color="#B7B7B7" paddingRight={3}>
                      Beranda
                    </Text>
                  </Link>
                </NextLink>
                <Image
                  src="/uploadPrescriptionImage/next.png"
                  width={5}
                  height={9}
                />
                <Text color="#008DEB" paddingLeft={0.5}>
                  Unggah Resep
                </Text>
              </HStack>
              <Text alignSelf="start" fontSize="17" fontWeight="600">
                Unggah Resep Dokter
              </Text>
              <VStack>
                <Image
                  src={imgSource}
                  loader={() => {
                    return imgSource;
                  }}
                  layout={'fixed'}
                  width={235}
                  height={235}
                />
                <VStack paddingLeft="89" paddingTop={1} fontSize={12.5} pb={1}>
                  <input type={'file'} onChange={onFileChange} />
                </VStack>
                <VStack>
                  <Text fontSize="16" fontWeight="500" marginTop={3}>
                    Cara Unggah Resep Dokter
                  </Text>
                </VStack>
                <HStack paddingTop={2}>
                  <VStack
                    width={220}
                    fontSize={12}
                    textAlign="center"
                    paddingRight={10}
                  >
                    <Image
                      src="/uploadPrescriptionImage/upload-prescription.png"
                      width={60}
                      height={60}
                    />
                    <VStack paddingTop={2}>
                      <Text fontWeight={600}>1. Unggah Resep</Text>
                      <Text>
                        Foto resep yang ditulis oleh dokter anda, kemudian
                        unggah pada form di atas.
                      </Text>
                    </VStack>
                  </VStack>
                  <VStack
                    width={180}
                    fontSize={12}
                    textAlign="center"
                    paddingTop={1.5}
                    paddingRight={5}
                  >
                    <Image
                      src="/uploadPrescriptionImage/waiting-for-validation.png"
                      width={52}
                      height={48}
                    />
                    <VStack paddingTop={3}>
                      <Text fontWeight={600}>2. Menunggu Validasi</Text>
                    </VStack>
                    <Text>
                      Tim kami akan mengecek ketersediaan obat sesuai resep.
                    </Text>
                  </VStack>
                  <VStack
                    width={220}
                    fontSize={12}
                    textAlign="center"
                    paddingLeft={5}
                  >
                    <Image
                      src="/uploadPrescriptionImage/delivery.png"
                      width={60}
                      height={60}
                    />
                    <VStack paddingTop={2}>
                      <Text fontWeight={600}>3. Lakukan Pembayaran</Text>
                      <Text>
                        Segera lakukan pembayaran agar kami dapat memproses obat
                        anda.
                      </Text>
                    </VStack>
                  </VStack>
                  <VStack
                    width={180}
                    fontSize={12}
                    textAlign="center"
                    paddingLeft={8}
                  >
                    <Image
                      src="/uploadPrescriptionImage/payment.png"
                      width={64}
                      height={64}
                    />
                    <VStack>
                      <Text fontWeight={600}>4. Obat Diantar</Text>
                      <Text>
                        Kami akan segera mengirimkan obat yang anda pesan.
                      </Text>
                    </VStack>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </Box>
          <VStack alignSelf="start">
            <Box
              width="60vH"
              boxShadow="md"
              marginTop={4}
              rounded="md"
              padding={6}
            >
              <Text fontWeight={600}>Alamat Pengiriman</Text>
              {selectAddress ? (
                <VStack align="start" marginTop={5}>
                  <Text fontWeight={500} fontSize={15} color="gray.600">
                    Penerima: {selectAddress.recipient}
                  </Text>
                  <Text fontWeight={500} fontSize={15} color="gray.600">
                    {selectAddress.addressDetail}
                  </Text>
                  <Text fontWeight={500} fontSize={15} color="gray.600">
                    {selectAddress.city_name}, {selectAddress.province},{' '}
                    {selectAddress.postalCode}
                  </Text>
                  {userAllAddress ? (
                    <VStack>
                      <Button
                        marginTop={3}
                        bgColor="white"
                        _hover="white"
                        size="xxl"
                        variant="solid"
                        color="#1068A3"
                        fontSize={13}
                        onClick={() => setModalSelectAddress(true)}
                      >
                        Pilih alamat lain
                        <SelectAddress
                          isOpen={modalSelectAddress}
                          onClose={() => setModalSelectAddress(false)}
                          userAllAddress={userAllAddress}
                          chooseAddress={chooseAddress}
                          RenderUserAddresses={RenderUserAddresses}
                        />
                      </Button>
                    </VStack>
                  ) : null}
                </VStack>
              ) : (
                <VStack align="start" marginTop={5}>
                  <Text fontWeight={500} fontSize={15} color="gray.600">
                    Belum ada alamat
                  </Text>
                  <VStack align="start" paddingTop={3}>
                    <Button
                      bgColor="white"
                      _hover="white"
                      size="xxl"
                      variant="solid"
                      color="#1068A3"
                      fontSize={13}
                      onClick={onOpen}
                    >
                      <AddIcon w={2.5} h={2.5} color="#004776" />
                      <Text paddingLeft={1.5} paddingTop={0.3}>
                        Tambahkan Alamat Baru
                      </Text>
                      <AddAddress
                        isOpen={isOpen}
                        onClose={onClose}
                        RenderUserAddresses={RenderUserAddresses}
                      />
                    </Button>
                  </VStack>
                </VStack>
              )}
            </Box>
            <Box width="60vH" boxShadow="md" rounded="md" padding={6}>
              <Text fontWeight={600}>Metode Pengiriman</Text>
              <HStack marginY={6}>
                <Button
                  bgColor="white"
                  _hover="white"
                  size="xxl"
                  variant="solid"
                  color="#1068A3"
                  fontSize={13}
                  onClick={() => setModalSelectCourier(true)}
                >
                  <Text paddingTop={0.3}>Pilih Metode Pengiriman</Text>
                  <GetDeliveryCost
                    isOpen={modalSelectCourier}
                    onClose={() => setModalSelectCourier(false)}
                    destination={selectAddress?.city_id}
                    setSelectedDeliveryCost={setSelectedDeliveryCost}
                    setSelectedCourier={setSelectedCourier}
                  />
                </Button>
              </HStack>
              <Text fontWeight={600}>Ringkasan Pembayaran</Text>
              <HStack
                justifyContent="space-between"
                marginTop={4}
                marginBottom={2}
              >
                <HStack>
                  <Text>{selectedDeliveryCost && renderDeliveryCost()}</Text>
                </HStack>
              </HStack>
              <Image src="/profile/line.png" width={400} height={1.5} />

              <VStack align="start" marginTop="5">
                <Text fontWeight={600} fontSize={15}>
                  Metode Pembayaran
                </Text>
              </VStack>
              <VStack align="start" marginTop="2">
                <Checkbox fontWeight={500} color="gray.600" size="sm">
                  Transfer Bank BCA
                </Checkbox>
              </VStack>
              <VStack marginTop={8}>
                <Button
                  fontSize={13}
                  color="white"
                  colorScheme="messenger"
                  fontWeight={500}
                  width={250}
                  onClick={createPrescripTransaction}
                >
                  Lanjutkan Pembayaran
                </Button>
              </VStack>
            </Box>
          </VStack>
        </HStack>
      ) : (
        <VStack marginTop="17vH">
          <Image
            src="/uploadPrescriptionImage/validation.png"
            width={250}
            height={250}
          />
          <VStack>
            <Text marginTop={4} fontSize={17} fontWeight={500}>
              Resep sedang divalidasi.
            </Text>
            <Text paddingTop={2} fontSize={17} fontWeight={500}>
              Resep yang berhasil divalidasi akan masuk ke riwayat pesanan.
            </Text>
          </VStack>
        </VStack>
      )}
    </ChakraProvider>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: '/login' } };

    const { user_token } = session.user;

    const config = {
      headers: { Authorization: `Bearer ${user_token}` },
    };

    const user_id = session.user.user.user_id;

    const userAllAddress = await axiosInstance.get(
      `/addresses/useraddresslists`,
      config,
    );
    const defaultAddress = await axiosInstance.get(
      `/addresses/userdefaultaddress`,
      config,
    );
    const prescription = await axiosInstance.get(
      `/transactions/userPrescription`,
      config,
    );

    return {
      props: {
        user_id,
        user_token,
        userAllAddress: userAllAddress.data.data,
        defaultAddress: defaultAddress.data.data,
        prescription: prescription.data.data,
        session,
      },
    };
  } catch (error) {
    console.log({ error });
    return { props: { error } };
  }
}

export default UploadPrescriptionImage;
