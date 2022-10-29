import { Button, Icon, Input, useToast } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import axiosInstance from '../../src/config/api';
import { DeleteIcon, AddIcon, WarningIcon } from '@chakra-ui/icons';
import { api_origin } from '../../constraint';

export default function CartCards(props) {
  const { product, quantity, totalPrice, fetchCarts } = props;
  const [quantityCart, setQuantityCart] = useState(quantity);
  const toast = useToast();

  totalPrice(quantityCart);

  const deleteProduct = async () => {
    try {
      const session = await getSession();

      const { user_token } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };

      const product_id = product.product_id;

      const res = await axiosInstance.delete(`carts/${product_id}`, config);
      window.location.reload();
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

  const onClickPlus = async () => {
    const { product_id } = product;
    try {
      setQuantityCart(quantityCart + 1);
      const session = await getSession();

      const { user_token } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };

      const body = { quantity: quantityCart + 1 };

      await axiosInstance.patch(`carts/patchCart/${product_id}`, body, config);
      fetchCarts();
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

  const onClickMinus = async () => {
    const { product_id } = product;
    try {
      setQuantityCart(quantityCart - 1);
      const session = await getSession();

      const { user_token } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };

      const body = { quantity: quantityCart - 1 };
      totalPrice(quantityCart - 1);
      await axiosInstance.patch(`carts/patchCart/${product_id}`, body, config);
      fetchCarts();
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
    <div className="w-[78vH] ml-[8vh] my-[4vh] columns-3  ">
      <Image
        unoptimized
        alt="resep-logo"
        width={80}
        height={80}
        src={api_origin + product.productImage}
      />
      <p className="text-[17px] font-[500]">{product.productName}</p>
      <div className=" text-[#6E6E6E] text-[14px] font-[500]">
        Harga: Rp. {product.productPrice.toLocaleString('id')}
      </div>
      <div className="flex justify-between font-semibold ">
        {quantity < 2 ? (
          <Button
            isDisabled
            width="50px"
            marginRight={2}
            onClick={() => {
              onClickMinus();
            }}
            colorScheme="linkedin"
          >
            -
          </Button>
        ) : (
          <Button
            width="50px"
            marginRight={2}
            onClick={() => {
              onClickMinus();
            }}
            colorScheme="linkedin"
          >
            -
          </Button>
        )}
        {/* <Button
          width="50px"
          marginRight={2}
          onClick={() => {
            onClickMinus();
          }}
          colorScheme="messenger"
        >
          -
        </Button> */}
        <Input
          htmlSize={4}
          width="70px"
          variant="outline"
          value={quantityCart}
        />

        <Button
          width="50px"
          marginLeft={2}
          onClick={() => {
            onClickPlus();
          }}
          colorScheme="messenger"
        >
          +
        </Button>

        <Button
          onClick={() => {
            deleteProduct();
          }}
          size={'xl'}
          variant={'ghost'}
          ml={3}
        >
          <DeleteIcon></DeleteIcon>
        </Button>
      </div>
    </div>
  );
}
