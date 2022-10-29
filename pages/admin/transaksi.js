import AdminNavbar from '../../components/AdminNavbar';
import { useRouter } from 'next/router';
import {
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  VStack,
  Button,
  HStack,
  Image,
  ChakraProvider,
  Input,
  Box,
  Select,
  useToast,
} from '@chakra-ui/react';
import { getSession, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import AdminTransCard from '../../components/AdminTransCard';
import AdminTransCardConfirmation from '../../components/AdminTransCardConfirmation';
import AdminPaymentConfirm from '../../components/AdminPaymentConfirm';
import axiosInstance from '../../src/config/api';
import theme from '../../components/theme';

function Transaksi(props) {
  const [transac, setTransac] = useState([]);
  const [selected, setSelected] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [formState, setFormState] = useState({ InvoiceID: '' });

  const router = useRouter();
  const session = useSession();
  const toast = useToast();

  if (session.data) {
    if (!session.data.user.user.isAdmin) {
      router.replace('/');
    }
  }

  const path = router.pathname;

  useEffect(() => {
    fetchTransactions();
  }, [selected, page]);

  const onPrevClick = () => {
    setPage(page - 1);
  };

  const onNextClick = () => {
    setPage(page + 1);
  };

  const onHandleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  const btnSearchHandler = () => {
    let invoice_id = formState.invoiceID;
    if (formState.invoiceID == '') {
      invoice_id = 'undefined';
    }
    fetchTransactions('transaction_id', 'DESC', invoice_id);
  };

  const selectSortHandler = (event) => {
    const sortBy = event.target.value;
    switch (sortBy) {
      case 'ascInvoice':
        order_by = 'transaction_id';
        ordered_method = 'ASC';
        fetchTransactions(order_by, ordered_method);
        break;
      case 'descInvoice':
        order_by = 'transaction_id';
        ordered_method = 'DESC';
        fetchTransactions(order_by, ordered_method);
        break;
      case 'ascDate':
        order_by = 'createdAt';
        ordered_method = 'ASC';
        fetchTransactions(order_by, ordered_method);
        break;
      case 'descDate':
        order_by = 'createdAt';
        ordered_method = 'DESC';
        fetchTransactions(order_by, ordered_method);
        break;
    }
  };

  let order_by = 'transaction_id';
  let ordered_method = 'ASC';

  const fetchTransactions = async (
    order_by,
    ordered_method,
    transaction_id,
  ) => {
    try {
      const session = await getSession();

      const { user_token } = session.user;

      const config = {
        params: { page, pageSize },
        headers: { Authorization: `Bearer ${user_token}` },
      };
      const res = await axiosInstance.get(
        `/transactions/admin/transactionsByIndex/${selected}?order_by=${order_by}&ordered_method=${ordered_method}&transaction=${transaction_id}`,
        config,
      );
      setTransac(res.data.data.resFetchTransactions);
      setFilteredTransactions(res.data.data.resFetchTransactions);
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

  function mappedTransactions() {
    return filteredTransactions?.map((transaction) => {
      return (
        <AdminTransCard
          key={transaction.transaction_id}
          productName={transaction.transaction_details[0].product.productName}
          productImage={transaction.transaction_details[0].product.productImage}
          transaction_details={transaction.transaction_details}
          status={transaction.status}
          totalPrice={transaction.totalPrice}
          trans_id={transaction.transaction_id}
          courier={transaction.courier}
          deliveryCost={transaction.deliveryCost}
          createdAt={transaction.createdAt}
          transac={transac}
          props={props}
        />
      );
    });
  }

  function mappedTransactionsPayment() {
    return filteredTransactions?.map((transaction) => {
      return (
        <AdminPaymentConfirm
          key={transaction.transaction_id}
          productName={transaction.transaction_details[0].product.productName}
          productImage={transaction.transaction_details[0].product.productImage}
          transaction_details={transaction.transaction_details}
          paymentProof={transaction.transaction_details[0].paymentProof}
          status={transaction.status}
          totalPrice={transaction.totalPrice}
          trans_id={transaction.transaction_id}
          courier={transaction.courier}
          deliveryCost={transaction.deliveryCost}
          createdAt={transaction.createdAt}
          transac={transac}
          fetchTransactions={fetchTransactions}
          props={props}
        />
      );
    });
  }

  function mappedTransactionsConfirmation() {
    return filteredTransactions?.map((transaction) => {
      return (
        <AdminTransCardConfirmation
          key={transaction.transaction_id}
          productName={transaction.transaction_details[0].product.productName}
          productImage={transaction.transaction_details[0].product.productImage}
          transaction_details={transaction.transaction_details}
          status={transaction.status}
          totalPrice={transaction.totalPrice}
          trans_id={transaction.transaction_id}
          courier={transaction.courier}
          deliveryCost={transaction.deliveryCost}
          createdAt={transaction.createdAt}
          transac={transac}
          fetchTransactions={fetchTransactions}
          props={props}
        />
      );
    });
  }

  return (
    <ChakraProvider theme={theme}>
      <div className="flex w-[100vw] h-[100vh]">
        <AdminNavbar path={path} />
        <VStack align="start">
          <Box>
            <HStack>
              <Text
                fontSize={21}
                fontWeight={500}
                marginTop={3}
                marginLeft={16}
                marginRight={310}
              >
                Riwayat Transaksi
              </Text>
              <HStack paddingTop={6} paddingRight={70} fontSize={15}>
                <Text>Urutkan</Text>
                <Select
                  name="sortBy"
                  width={180}
                  marginTop={4}
                  onChange={selectSortHandler}
                  fontSize={14}
                >
                  <option value="ascInvoice">No. Invoice Terlama</option>
                  <option value="descInvoice">No. Invoice Terbaru</option>
                  <option value="ascDate">Transaksi Terlama</option>
                  <option value="descDate">Transaksi Terbaru</option>
                </Select>
              </HStack>
              <HStack paddingTop={4}>
                <Input
                  marginTop={2}
                  name="invoiceID"
                  type="text"
                  placeholder="No. Invoice"
                  fontSize={14}
                  fontWeight={400}
                  onChange={onHandleChange}
                  width={200}
                />
                <HStack paddingTop={2}>
                  <Button
                    fontSize={14}
                    colorScheme="messenger"
                    onClick={btnSearchHandler}
                  >
                    Cari
                  </Button>
                </HStack>
              </HStack>
            </HStack>
          </Box>
          <Tabs
            onChange={(index) => {
              setSelected(index), setPage(1);
            }}
          >
            <TabList marginLeft={16} marginTop={2}>
              <Tab>Semua</Tab>
              <Tab>Diproses</Tab>
              <Tab>Sedang Dikirim</Tab>
              <Tab>Berhasil</Tab>
              <Tab>Tidak Berhasil</Tab>
              <Tab>Menunggu Pembayaran</Tab>
              <Tab>Menunggu Konfirmasi Pembayaran</Tab>
            </TabList>
            {transac.length ? (
              <TabPanels>
                <TabPanel>
                  <div>{mappedTransactions()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{mappedTransactionsConfirmation()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{mappedTransactions()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{mappedTransactions()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{mappedTransactions()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{mappedTransactions()}</div>
                </TabPanel>
                <TabPanel>
                  <div>{mappedTransactionsPayment()}</div>
                </TabPanel>
              </TabPanels>
            ) : (
              <VStack marginTop={105}>
                <Image
                  src="/admin/Empty-Transaction.png"
                  width={250}
                  height={250}
                  alt={''}
                />
                <Text paddingTop={6} fontSize={18}>
                  Tidak Ada Transaksi
                </Text>
              </VStack>
            )}
          </Tabs>
          {transac.length ? (
            <HStack paddingLeft={510}>
              <Button
                marginRight={2}
                onClick={onPrevClick}
                isDisabled={page == 1}
                colorScheme="messenger"
              >
                Prev
              </Button>
              <Text paddingRight={2}>{page}</Text>
              <Button
                onClick={onNextClick}
                isDisabled={page >= transac.length}
                colorScheme="messenger"
              >
                Next
              </Button>
            </HStack>
          ) : null}
        </VStack>
      </div>
    </ChakraProvider>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: '/login' } };

    if (!session.user.user.isAdmin) {
      return { redirect: { destination: '/' } };
    }

    const { user_token } = session.user;

    const config = {
      headers: { Authorization: `Bearer ${user_token}` },
    };

    return {
      props: { user_token },
    };
  } catch (error) {
    console.log({ error });
    return { props: {} };
  }
}

export default Transaksi;
