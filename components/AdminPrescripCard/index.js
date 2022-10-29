import {
  Box,
  HStack,
  Text,
  VStack,
  Button,
  Icon,
  Select,
} from '@chakra-ui/react';
import { CheckIcon, SmallCloseIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import Link from 'next/link';
import { api_origin } from '../../constraint';
import { useState, useEffect } from 'react';
import axiosInstance from '../../src/config/api';
import { useToast } from '@chakra-ui/react';

export default function AdminPrescripCard(props) {
  const {
    trans_id,
    deliveryCost,
    prescriptionImage,
    createdAt,
    products,
    userId,
  } = props;
  const [show, setShow] = useState(false);
  const [option, setOption] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const toast = useToast();

  useEffect(() => {
    onCheckClick;
  }, [saved]);

  function productNameMap() {
    return products.map((product) => {
      if (product.formula) {
        return (
          <option key={product.product_id} value={`${product.product_id}`}>
            {product.productName}
          </option>
        );
      }
    });
  }

  const onHandleOptionChange = (e) => {
    setOption(e.target.value);
  };

  async function onCheckClick() {
    try {
      setLoading(true);
      const parsedProduct_id = parseInt(option);
      const body = {
        product_id: parsedProduct_id,
        transaction_id: trans_id,
        user_id: userId,
        // totalPrice: products.productPrice,
      };
      const res = await axiosInstance.patch('/transactions/adminConfirm', body);
      if (res) {
        toast({
          title: 'Prescription Confirmed!',
          description: res.data.message,
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        setOption('');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
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
      setLoading(false);
      setOption('');
    }
  }

  return (
    <Box marginTop={3}>
      <Text fontWeight={600} marginBottom={1} marginLeft={'81'}>
        No. Invoice: {trans_id}
      </Text>
      <HStack
        bg={'gray.50'}
        height={125}
        spacing="5vH"
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
          src={api_origin + prescriptionImage}
        />
        <VStack>
          <Text w="25vH" fontSize={16} fontWeight={600}>
            Resep Dokter
          </Text>
        </VStack>
        <Text w="30vH" fontSize="15" fontWeight={500}>
          Biaya Pengiriman: Rp {deliveryCost.toLocaleString('id')}
        </Text>
        <VStack textAlign="center" fontWeight={500}>
          <Text w="35vH" fontSize="14">
            Tanggal Pemesanan:
          </Text>
          <Text w="37vH" fontSize="13">
            {createdAt.slice(0, 10)}
          </Text>
        </VStack>
        {show ? (
          <HStack>
            <Select
              fontSize={'md'}
              placeholder="pilih obat racik"
              variant={'flushed'}
              onChange={onHandleOptionChange}
            >
              {productNameMap()}
            </Select>
            {option ? (
              <Button
                color="green.300"
                variant="ghost"
                fontSize={13}
                fontWeight={500}
                onClick={onCheckClick}
              >
                <CheckIcon></CheckIcon>
              </Button>
            ) : (
              <></>
            )}
            <Button
              color="red.300"
              variant="ghost"
              fontSize={13}
              fontWeight={500}
              onClick={() => {
                setShow(false), setOption('');
              }}
            >
              <SmallCloseIcon></SmallCloseIcon>
            </Button>
          </HStack>
        ) : (
          <Button
            color="linkedin.500"
            variant="link"
            paddingRight={95}
            fontSize={13}
            fontWeight={500}
            onClick={() => {
              setShow(true), setOption('');
            }}
          >
            <Text w="11vH" fontSize="16" fontWeight={600}>
              Tambah Obat
            </Text>
          </Button>
        )}
      </HStack>
    </Box>
  );
}
