import {
  Button,
  Icon,
  Input,
  Flex,
  Box,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Link,
} from '@chakra-ui/react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { api_origin } from '../../constraint';

export default function TransactionCards(props) {
  const {
    trans_id,
    productName,
    transactions,
    totalPrice,
    status,
    productImage,
  } = props;

  const rawStatus = status.split('_');
  return (
    <div>
      <HStack
        bg={'gray.50'}
        h={100}
        spacing="95"
        my={'10'}
        ml={'20'}
        mr={'20'}
        px={6}
        rounded={6}
        boxShadow="lg"
      >
        <Image
          unoptimized
          alt="resep-logo"
          width={70}
          height={70}
          src={api_origin + productImage}
        />
        <Box w="180px" fontSize={'md'} fontWeight={'bold'}>
          {productName}
        </Box>
        <Box w="180px">Status: {rawStatus.join(' ')}</Box>
        <Box w="180px">Total Price: Rp. {totalPrice.toLocaleString('id')}</Box>
        <Link href={`/transactionDetail/${trans_id}`}>
          <Button color="linkedin.400" variant="link">
            Lihat Pesanan
          </Button>
        </Link>
      </HStack>
    </div>
  );
}
