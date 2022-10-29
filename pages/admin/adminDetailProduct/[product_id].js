import {
  Table,
  Thead,
  Tbody,
  Box,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import axiosInstance from '../../../src/config/api';
import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../../components/AdminNavbar';
import AddProductStock from '../../../components/AddProductStock';
import UpdateAddedStock from '../../../components/UpdateAddedStock';
import DeleteAddedStock from '../../../components/DeleteAddedStock';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DetailProduct(props) {
  const router = useRouter();
  const { product_id } = props;
  const [asc, setAsc] = useState(true);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedOpname, setSelectedOpname] = useState();
  const [stockOpname, setStockOpname] = useState(
    props.stockOpname?.resGetStockOpname,
  );
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    fetchStockOpname();
  }, [startDate, endDate]);

  async function fetchStockOpname() {
    try {
      let paramsStartDate;
      let paramsEndDate;
      if (startDate) {
        paramsStartDate = new Date(startDate);
        paramsStartDate.setHours(startDate.getHours() + 7);
      }

      if (endDate) {
        paramsEndDate = new Date(endDate);
        paramsEndDate.setHours(endDate.getHours() + 7);
      }

      const resGetStockOpname = await axiosInstance.get(
        `/stockOpname/${product_id}`,
        {
          params: { paramsStartDate, paramsEndDate },
        },
      );
      setStockOpname(resGetStockOpname.data.resGetStockOpname);
    } catch (error) {
      console.log({ error });
    }
  }

  function renderStockOpname() {
    let stockOpnames = [];
    if (stockOpname.length) {
      stockOpname.forEach((stockOp) => {
        stockOpnames.push({
          createdAt: stockOp.createdAt.slice(0, 10),
          productName: stockOp.product.productName,
          qty: stockOp.stock,
          activity: stockOp.activity,
          stock_opname_id: stockOp.stock_opname_id,
        });
      });
    }
    stockOpnames.sort((a, b) => {
      let x = a.createdAt;
      let y = b.createdAt;
      if (x < y) {
        return asc ? -1 : 1;
      } else if (x > y) {
        return asc ? 1 : -1;
      }
    });

    return stockOpnames.map((data, index) => {
      let date = new Date().toJSON();
      return (
        <Tr key={data.product_id}>
          <Td textAlign="center">{data.createdAt}</Td>
          <Td textAlign="center">{data.productName}</Td>
          <Td textAlign="center">{data.qty}</Td>
          <Td textAlign="center">
            {data.activity.toUpperCase().split('_').join(' ')}
          </Td>
          <Td>
            {data.activity == 'tambah_stok' &&
            data.createdAt.slice(0, 10) == date.slice(0, 10) ? (
              <HStack marginLeft={7}>
                <Button
                  height={4}
                  width={4}
                  colorScheme="white"
                  variant="solid"
                  size="xxs"
                  onClick={() => {
                    setModalEdit(true);
                    setSelectedOpname(data.stock_opname_id);
                  }}
                >
                  <EditIcon w={3.5} h={3.5} color="#004776" />
                </Button>
                <Button
                  height={4}
                  width={4}
                  colorScheme="white"
                  variant="solid"
                  size="xxs"
                  onClick={() => {
                    setModalDelete(true);
                    setSelectedOpname(data.stock_opname_id);
                  }}
                >
                  <DeleteIcon w={3.5} h={3.5} color="#004776" />
                </Button>
              </HStack>
            ) : null}
          </Td>
        </Tr>
      );
    });
  }

  return (
    <div className="flex w-[100vw] h-[100vh] overflow-auto ">
      <AdminNavbar path={router.pathname} />
      <VStack align={'start'}>
        <Box>
          <VStack align="start">
            <Text
              fontSize={24}
              fontWeight={500}
              marginTop={7}
              marginLeft={85}
              marginBottom={5}
            >
              Riwayat Produk
            </Text>
            <HStack paddingBottom={4}>
              <Button
                variant="outline"
                colorScheme="linkedin"
                marginLeft={155}
                onClick={() => {
                  setModalAdd(true);
                }}
              >
                <Text>Tambah Stok Produk</Text>
                <AddProductStock
                  isOpen={modalAdd}
                  product_id={product_id}
                  fetchStockOpname={fetchStockOpname}
                  onClick={() => {
                    onClose();
                  }}
                  onClose={() => setModalAdd(false)}
                />
              </Button>
            </HStack>
          </VStack>
          <HStack paddingLeft={155} paddingBottom={2}>
            <HStack>
              <DatePicker
                placeholderText="Start date"
                className="border-black border-solid border-[2px] rounded-[.3vw] pl-3 text-black"
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                }}
              />
            </HStack>
            <HStack>
              <DatePicker
                placeholderText="End date"
                className="border-black border-solid border-[2px] rounded-[.3vw] pl-3 text-black"
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                }}
              />
            </HStack>
            <HStack>
              <Button
                colorScheme={'linkedin'}
                variant="ghost"
                onClick={() => {
                  setStartDate();
                  setEndDate();
                }}
              >
                Reset Filter
              </Button>
            </HStack>
            <HStack paddingLeft={2}>
              <Button
                variant="outline"
                colorScheme="linkedin"
                onClick={() => {
                  setAsc(!asc);
                }}
              >
                Sort By Date : {asc ? 'Asc' : 'Desc'}
              </Button>
            </HStack>
          </HStack>
        </Box>
        <VStack className="overflow-auto scrollbar" paddingLeft={155}>
          <Table
            size="lg"
            height={'10vh'}
            variant="striped"
            border="2px"
            alignSelf="center"
          >
            <Thead>
              <Tr border="2px">
                <Th textAlign="center">Tanggal</Th>
                <Th textAlign="center">Nama Obat</Th>
                <Th textAlign="center">Quantity</Th>
                <Th textAlign="center">Aktivitas</Th>
                <Th textAlign="center">Pengaturan</Th>
              </Tr>
            </Thead>
            <UpdateAddedStock
              isOpen={modalEdit}
              product_id={product_id}
              stock_opname_id={selectedOpname}
              fetchStockOpname={fetchStockOpname}
              onClose={() => setModalEdit(false)}
            />
            <DeleteAddedStock
              isOpen={modalDelete}
              product_id={product_id}
              stock_opname_id={selectedOpname}
              fetchStockOpname={fetchStockOpname}
              onClose={() => setModalDelete(false)}
            />
            <Tbody>{renderStockOpname()}</Tbody>
          </Table>
        </VStack>
      </VStack>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const { product_id } = context.params;

    const resGetStockOpname = await axiosInstance.get(
      `/stockOpname/${product_id}`,
    );

    return {
      props: {
        product_id: product_id,
        stockOpname: resGetStockOpname.data,
      },
    };
  } catch (error) {
    console.log({ error });
    const { message } = error;
    return { props: { message } };
  }
}

export default DetailProduct;
