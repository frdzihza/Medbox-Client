import {
  AddIcon,
  Flex,
  Box,
  HStack,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  VStack,
} from '@chakra-ui/react';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../src/config/api';
import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import { useToast } from '@chakra-ui/react';
import Image from 'next/image';
import TransDetailCard from '../../components/TransDetailCard';
import { useRouter } from 'next/router';

function TransactionDetails(props) {
  const router = useRouter();
  const { transaction_details, transactions, user_id } = props;
  const [transac, setTransac] = useState(
    transaction_details.resFetchTransactionDetails,
  );
  const [trans, setTrans] = useState(transactions.resFetchTransactions);
  const [transByAddress, setTransByAddress] = useState(
    transactions.resFetchAddress,
  );
  const [payment, setPayment] = useState({});
  const onFileChange = (event) => {
    setPayment(event.target.files[0]);
  };

  const toast = useToast();

  let penerima;
  let jalan;
  let kodePos;
  let provinsi;
  let kota;

  transByAddress.forEach(async (data) => {
    penerima = data.recipient;
    jalan = data.addressDetail;
    kodePos = data.postalCode;
    provinsi = data.province;
    kota = data.city_name;
  });

  const onSavePayment = async () => {
    try {
      const session = await getSession();

      const { user_token } = session.user;

      const body = new FormData();

      body.append('paymentProof', payment);

      const transaction_id = trans.transaction_id;

      const bods = {
        transStatus: 'awaiting_payment_confirmation',
        trans,
      };

      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };

      const res = await axiosInstance.patch(
        `/transactions/paymentProof/${transaction_id}`,
        body,
        config,
      );

      const res2 = await axiosInstance.patch(
        '/transactions/patchTransaction',
        bods,
        config,
      );

      setTrans({ ...trans, status: 'awaiting_payment_confirmation' });

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
        description: 'Bukti Pembayaran Belum Dipilih',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const onCancelClick = async () => {
    try {
      const transaction_id = trans.transaction_id;
      const res = await axiosInstance.patch(
        `/transactions/cancelTransaction/${transaction_id}`,
      );
      setTrans({ ...trans, status: 'order_cancelled' });

      toast({
        title: 'Success!',
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log({ Error });
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

  const onConfirmClick = async () => {
    try {
      const transaction_id = trans.transaction_id;
      const res = await axiosInstance.patch(
        `/transactions/confirmTransaction/${transaction_id}`,
      );
      setTrans({ ...trans, status: 'order_confirmed' });

      toast({
        title: 'Confirmed!',
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log({ Error });
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

  function mappedTransactionDetails() {
    return transac.map((transaction, index) => {
      return (
        <TransDetailCard
          key={transaction.transaction_details_id}
          productName={transaction.product.productName}
          productImage={transaction.product.productImage}
          productPrice={transaction.product.productPrice}
          quantity={transaction.quantity}
          props={props}
        />
      );
    });
  }

  const grandTotal = trans.totalPrice + trans.deliveryCost;

  const rawStatus = trans.status.split('_');
  const rawStatusJoin = rawStatus.join(' ');

  return (
    <div className="w-[100vw] h-[100vh]">
      <Navbar />
      <div className="w-[100%] h-[100%] flex">
        <div className="w-[50%]">
          <div>
            <p className="text-[1rem] font-[500] ml-3">Alamat Lengkap</p>
            <br />
            <div className="flex flex-col ml-3">
              <p>Nama Pembeli : {penerima}</p>
              <p>Alamat Pembeli : {jalan}</p>
              <p>Provinsi : {provinsi}</p>
              <p>Kota: {kota}</p>
              <p>Kode Pos : {kodePos}</p>
            </div>
            <br />
            <p className="text-[1rem] font-[500] ml-3">Daftar Pesanan</p>
            <div>{mappedTransactionDetails()}</div>
          </div>
        </div>
        <div className="border-l-[1px] mt-[2vh] border-solid border-gray h-[100%]" />
        <div className="w-[50%] ">
          <p className="w-[30%] ml-3 mt-3 text-[1rem] font-[500]">
            Ringkasan Pembayaran
          </p>
          <p className="mt-[5vh] ml-[10%] text-[1rem] font-[500]">
            Metode Pengiriman: {trans.courier}
          </p>
          <p className="mt-[5vh] ml-[10%] text-[1rem] font-[500]">
            Sub Total: Rp. {trans.totalPrice.toLocaleString('id')}
          </p>
          <p className="mt-[5vh] ml-[10%] text-[1rem] font-[500]">
            Delivery Cost: Rp. {trans.deliveryCost.toLocaleString('id')}
          </p>
          <p className="mt-[5vh] ml-[10%] text-[1rem] font-[500]">
            Total Harga: Rp. {grandTotal.toLocaleString('id')}
          </p>
          <p className="mt-[5vh] ml-[10%] text-[1rem] font-[500]">
            Metode Pembayaran: Transfer Bank BCA
          </p>
          <p className="mt-[5vh] ml-[10%] text-[1rem] font-[500]">
            Status Pembayaran: {rawStatusJoin}
          </p>
          {rawStatusJoin === 'awaiting payment' ? (
            <div className="mt-[5vh] ml-[10%]">
              {' '}
              <input type={'file'} onChange={onFileChange} />
            </div>
          ) : (
            <></>
          )}
          {rawStatusJoin === 'awaiting payment' ? (
            <Button
              variant={'outline'}
              onClick={onSavePayment}
              colorScheme={'linkedin'}
              className="mt-[5vh] ml-[10%]"
            >
              Unggah Bukti Pembayaran
            </Button>
          ) : (
            <></>
          )}

          <VStack className="mt-[5vh] mr-[50%]">
            {rawStatusJoin === 'awaiting payment confirmation' ||
            rawStatusJoin != 'delivering order' ? (
              <Button
                variant={'ghost'}
                colorScheme={'green'}
                onClick={onConfirmClick}
                isDisabled
              >
                Konfirmasi Penerimaan
              </Button>
            ) : (
              <Button
                variant={'ghost'}
                colorScheme={'green'}
                onClick={onConfirmClick}
              >
                Konfirmasi Penerimaan
              </Button>
            )}
            {rawStatusJoin === 'awaiting payment confirmation' ||
            rawStatusJoin === 'delivering order' ||
            rawStatusJoin === 'processing order' ||
            rawStatusJoin === 'order confirmed' ||
            rawStatusJoin === 'order cancelled' ? (
              <Button
                variant={'ghost'}
                colorScheme={'red'}
                onClick={onCancelClick}
                isDisabled
              >
                Batalkan Pesanan
              </Button>
            ) : (
              <Button
                variant={'ghost'}
                colorScheme={'red'}
                onClick={onCancelClick}
              >
                Batalkan Pesanan
              </Button>
            )}
          </VStack>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: '/login' } };
    const { user_token } = session.user;
    const { user_id } = session.user.user;

    const config = {
      headers: { Authorization: `Bearer ${user_token}` },
    };
    const { transaction_id } = context.params;

    const resGetTransactionDetail = await axiosInstance.get(
      `/transactions/getDetails/${transaction_id}`,
      config,
    );
    const resgetTransactionById = await axiosInstance.get(
      `/transactions/transById/${transaction_id}`,
      config,
    );

    return {
      props: {
        user_id,
        transaction_details: resGetTransactionDetail.data.data,
        transactions: resgetTransactionById.data.data,
      },
    };
  } catch (error) {
    console.log({ error });
    const { message } = error;
    return { props: { message } };
  }
}

export default TransactionDetails;
