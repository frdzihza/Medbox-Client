import { getSession } from 'next-auth/react';
import React from 'react';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../src/config/api';
import {
  Text,
  VStack,
  Button,
  Box,
  ChakraProvider,
  useDisclosure,
  HStack,
  Checkbox,
  useToast,
  Link,
} from '@chakra-ui/react';
import Image from 'next/image';
import '@fontsource/poppins';
import { useState, useEffect } from 'react';
import CartCards from '../../components/CartCards';
import theme from '../../components/theme';
import SelectAddress from '../../components/SelectAddress';
import AddAddress from '../../components/AddAddress';
import { AddIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import GetDeliveryCost from '../../components/GetDeliveryCost';

function Cart(props) {
  const router = useRouter();
  const [carts, setCarts] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [userAllAddress, setUserAllAddress] = useState(props.userAllAddress);
  const [selectAddress, setSelectAddress] = useState(props.defaultAddress);
  const [selectedCourier, setSelectedCourier] = useState();
  const [selectedDeliveryCost, setSelectedDeliveryCost] = useState();
  const [modalSelectAddress, setModalSelectAddress] = useState(false);
  const [modalSelectCourier, setModalSelectCourier] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user_id } = props;
  const [cartsPrice, setCartsPrice] = useState([]);

  const toast = useToast();

  useEffect(() => {
    fetchCarts();
  }, []);

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

  const fetchCarts = async () => {
    try {
      const session = await getSession();
      const { user_id } = props;

      const { user_token } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };
      const res = await axiosInstance.get(`/carts/getCarts/${user_id}`, config);
      setCarts(res.data.data);
      if (!res.data.data.length) {
        setEmpty(true);
      }
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

  const countTotalPrice = (body) => {
    const result = carts.reduce(
      (acc, curr) => acc + curr.quantity * curr.product.productPrice,
      0,
    );
    return result;
  };

  const onCheckoutClick = async () => {
    try {
      setCartsPrice(countTotalPrice());
      const session = await getSession();
      const { user_id } = props;
      const { user_token } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };
      const deliveryCost = selectedDeliveryCost.split(',');
      const getDeliveryCost = parseInt(deliveryCost[1]);
      const body = {
        totalPrice: countTotalPrice(),
        address_id: selectAddress.address_id,
        courier: selectedCourier,
        deliveryCost: getDeliveryCost,
      };
      const res = await axiosInstance.post(
        `/transactions/createTransaction/`,
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
      setTimeout(() => {
        router.replace(`/transaction/${user_id}`);
      }, 1000);
    } catch (error) {
      console.log({ error });
      toast({
        description: 'Alamat dan Kurir Tidak Boleh Kosong',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  function mappedProducts() {
    return carts.map((cart, index) => {
      return (
        <CartCards
          key={cart.cart_id}
          product={cart.product}
          quantity={cart.quantity}
          fetchCarts={fetchCarts}
          totalPrice={countTotalPrice}
          props={props}
        />
      );
    });
  }

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
        minWidth={393}
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

  const renderTotalPrice = () => {
    const getTotalPrice = selectedDeliveryCost.split(',');
    const deliveryCost = parseInt(getTotalPrice[1]);
    let totalPrice = parseInt(countTotalPrice()) + deliveryCost;
    return <Text>Rp {totalPrice.toLocaleString('id')}</Text>;
  };

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      {empty ? (
        <VStack marginTop={105}>
          <Image src="/admin/Empty-Transaction.png" width={250} height={250} />
          <Text paddingTop={6} fontSize={18}>
            Wah! keranjang anda kosong!
          </Text>
        </VStack>
      ) : (
        <HStack>
          <VStack marginLeft={105} width="110vH" alignSelf="start">
            <Box
              width="110vH"
              boxShadow="md"
              marginTop={5}
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
            <Box width="110vH" boxShadow="md" rounded="md" padding={6}>
              <Text fontWeight={600}>Daftar Pesanan</Text>
              {mappedProducts()}
            </Box>
          </VStack>
          <VStack alignSelf="start">
            <Box
              width="57vH"
              boxShadow="md"
              rounded="md"
              padding={6}
              marginLeft={1}
              marginTop={5}
            >
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
              <HStack justifyContent="space-between" marginTop={6}>
                <Text fontWeight={500} fontSize={15} color="gray.600">
                  Sub Total
                </Text>
                <HStack fontWeight={550} fontSize={15} paddingRight={''}>
                  <Text>Rp {countTotalPrice().toLocaleString('id')}</Text>
                </HStack>
              </HStack>
              <HStack
                justifyContent="space-between"
                marginTop={4}
                marginBottom={2}
                w={'100%'}
              >
                <HStack w={'100%'}>
                  <Text>{selectedDeliveryCost && renderDeliveryCost()}</Text>
                </HStack>
              </HStack>
              <Image src="/profile/line.png" width={400} height={1.5} />
              <HStack justifyContent="space-between" marginTop={4}>
                <Text fontWeight={600} fontSize={15} color="gray.600">
                  Total
                </Text>
                <Text fontWeight={550} fontSize={15} color="#004776">
                  {selectedDeliveryCost && renderTotalPrice()}
                </Text>
              </HStack>
              <VStack align="start" marginTop="10">
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
                  onClick={onCheckoutClick}
                >
                  Lanjutkan Pembayaran
                </Button>
              </VStack>
            </Box>
          </VStack>
        </HStack>
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

    const { user_id } = context.params;

    const userAllAddress = await axiosInstance.get(
      `/addresses/useraddresslists`,
      config,
    );
    const defaultAddress = await axiosInstance.get(
      `/addresses/userdefaultaddress`,
      config,
    );

    return {
      props: {
        user_id,
        user_token,
        userAllAddress: userAllAddress.data.data,
        defaultAddress: defaultAddress.data.data,
        session,
      },
    };
  } catch (error) {
    console.log({ error });
    return { props: { error } };
  }
}

export default Cart;
