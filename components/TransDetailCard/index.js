import {
  Button,
  Icon,
  Input,
  Box,
  Flex,
  Center,
  Square,
  Text,
  VStack,
} from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { api_origin } from '../../constraint';

export default function TransDetailCard(props) {
  // console.log(props)
  const {
    product,
    quantity,
    productPrice,
    fetchCarts,
    productName,
    productImage,
    status,
    city_name,
  } = props;

  return (
    <div className="flex items-center h-[20vh] w-[100%] my-[3vh] rounded-[1vw] shadow-[0px_6px_20px_0px_rgba(0,28,47,0.05)]">
      <div className="h-[11vh] w-[11vh] bg-black ml-[2vw]">
        <Image
          unoptimized
          alt="resep-logo"
          width={1}
          height={1}
          layout="responsive"
          src={api_origin + productImage}
          loader={() => {
            return productImage;
          }}
        />
      </div>
      <div className="flex flex-col w-[40%] ml-[2vw]">
        <p>{productName}</p>
        <p>{quantity} Buah</p>
      </div>
      <div>
        <p>Rp. {productPrice.toLocaleString('id')}</p>
      </div>
    </div>
  );
}
