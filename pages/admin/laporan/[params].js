import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../../components/AdminNavbar';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import axiosInstance from '../../../src/config/api';
import {
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

function Laporan(props) {
  const router = useRouter();
  const session = useSession();
  const { params } = router.query;
  const [selected, setSelected] = useState(params);
  const [mainAsc, setMainAsc] = useState(true);
  const [asc, setAsc] = useState(true);
  const [sortOption, setSortOption] = useState('date');
  const [transactions, setTransactions] = useState(
    props.byProduct?.allTransaction,
  );
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    setSelected(params);
    setMainAsc(true);
    fetchNewWithFilter();
  }, [params, startDate, endDate]);

  const pageTabs = ['Product', 'Transaction', 'User'];

  if (session.data) {
    if (!session.data.user.user.isAdmin) {
      router.replace('/');
    }
  }

  async function fetchNewWithFilter() {
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

      const fetchNewProduct = await axiosInstance.get(
        'transactions/all/products',
        {
          params: { paramsStartDate, paramsEndDate },
        },
      );

      setTransactions(fetchNewProduct.data.allTransaction);
    } catch (error) {
      console.log({ error });
    }
  }

  function tableSort() {
    let saleObjArray = [];

    if (transactions.length) {
      transactions?.forEach((transaction) => {
        transaction.transaction_details.forEach((details) => {
          saleObjArray.push({
            createdAt: details.createdAt.slice(0, 10),
            transaction_id: transaction.transaction_id,
            transaction_details_id: details.transaction_details_id,
            userName: transaction.user.name,
            user_id: transaction.user.user_id,
            productName: details.product.productName,
            qty: details.quantity,
            totalPrice: `Rp. ${(
              details.product.productPrice * details.quantity
            ).toLocaleString('id')}`,
          });
        });
      });
    }

    switch (selected) {
      case 'product':
        saleObjArray = saleObjArray.sort((a, b) => {
          let x = a.productName.toLowerCase();
          let y = b.productName.toLowerCase();
          let xCreatedDate = a.createdAt;
          let yCreatedDate = b.createdAt;
          let xTotalPrice = parseInt(a.totalPrice.slice(4).split('.').join(''));
          let yTotalPrice = parseInt(b.totalPrice.slice(4).split('.').join(''));
          if (x < y) {
            return mainAsc ? -1 : 1;
          } else if (x > y) {
            return mainAsc ? 1 : -1;
          } else if (x == y) {
            if (sortOption == 'date') {
              if (asc) {
                if (xCreatedDate < yCreatedDate) {
                  return -1;
                } else if (xCreatedDate > yCreatedDate) {
                  return 1;
                } else if (xCreatedDate == yCreatedDate) {
                  return 0;
                }
              } else if (!asc) {
                if (xCreatedDate < yCreatedDate) {
                  return 1;
                } else if (xCreatedDate > yCreatedDate) {
                  return -1;
                } else if (xCreatedDate == yCreatedDate) {
                  return 0;
                }
              }
            } else if (sortOption == 'totalPrice') {
              if (asc) {
                if (xTotalPrice < yTotalPrice) {
                  return -1;
                } else if (xTotalPrice > yTotalPrice) {
                  return 1;
                } else if (xTotalPrice == yTotalPrice) {
                  return 0;
                }
              } else if (!asc) {
                if (xTotalPrice < yTotalPrice) {
                  return 1;
                } else if (xTotalPrice > yTotalPrice) {
                  return -1;
                } else if (xTotalPrice == yTotalPrice) {
                  return 0;
                }
              }
            }
          }
        });

        break;
      case 'transaction':
        saleObjArray = saleObjArray.sort((a, b) => {
          let xCreatedDate = a.createdAt;
          let yCreatedDate = b.createdAt;
          let xTotalPrice = parseInt(a.totalPrice.slice(4).split('.').join(''));
          let yTotalPrice = parseInt(b.totalPrice.slice(4).split('.').join(''));
          if (a.transaction_id - b.transaction_id == 0) {
            if (sortOption == 'date') {
              if (asc) {
                if (xCreatedDate < yCreatedDate) {
                  return -1;
                } else if (xCreatedDate > yCreatedDate) {
                  return 1;
                } else if (xCreatedDate == yCreatedDate) {
                  return 0;
                }
              } else if (!asc) {
                if (xCreatedDate < yCreatedDate) {
                  return 1;
                } else if (xCreatedDate > yCreatedDate) {
                  return -1;
                } else if (xCreatedDate == yCreatedDate) {
                  return 0;
                }
              }
            } else if (sortOption == 'totalPrice') {
              if (asc) {
                if (xTotalPrice < yTotalPrice) {
                  return -1;
                } else if (xTotalPrice > yTotalPrice) {
                  return 1;
                } else if (xTotalPrice == yTotalPrice) {
                  return 0;
                }
              } else if (!asc) {
                if (xTotalPrice < yTotalPrice) {
                  return 1;
                } else if (xTotalPrice > yTotalPrice) {
                  return -1;
                } else if (xTotalPrice == yTotalPrice) {
                  return 0;
                }
              }
            }
          }
          return mainAsc
            ? a.transaction_id - b.transaction_id
            : b.transaction_id - a.transaction_id;
        });

        break;
      case 'user':
        saleObjArray = saleObjArray.sort((a, b) => {
          let x = a.userName.toLowerCase();
          let y = b.userName.toLowerCase();
          let xCreatedDate = a.createdAt;
          let yCreatedDate = b.createdAt;
          let xTotalPrice = parseInt(a.totalPrice.slice(4).split('.').join(''));
          let yTotalPrice = parseInt(b.totalPrice.slice(4).split('.').join(''));
          if (x < y) {
            return mainAsc ? -1 : 1;
          } else if (x > y) {
            return mainAsc ? 1 : -1;
          } else if (x == y) {
            if (sortOption == 'date') {
              if (asc) {
                if (xCreatedDate < yCreatedDate) {
                  return -1;
                } else if (xCreatedDate > yCreatedDate) {
                  return 1;
                } else if (xCreatedDate == yCreatedDate) {
                  return 0;
                }
              } else if (!asc) {
                if (xCreatedDate < yCreatedDate) {
                  return 1;
                } else if (xCreatedDate > yCreatedDate) {
                  return -1;
                } else if (xCreatedDate == yCreatedDate) {
                  return 0;
                }
              }
            } else if (sortOption == 'totalPrice') {
              if (asc) {
                if (xTotalPrice < yTotalPrice) {
                  return -1;
                } else if (xTotalPrice > yTotalPrice) {
                  return 1;
                } else if (xTotalPrice == yTotalPrice) {
                  return 0;
                }
              } else if (!asc) {
                if (xTotalPrice < yTotalPrice) {
                  return 1;
                } else if (xTotalPrice > yTotalPrice) {
                  return -1;
                } else if (xTotalPrice == yTotalPrice) {
                  return 0;
                }
              }
            }
          }
        });

        break;
    }

    return saleObjArray.map((obj) => {
      return (
        <Tr key={obj.transaction_details_id}>
          <Td>{obj.createdAt}</Td>
          <Td>{obj.transaction_id}</Td>
          <Td>{obj.userName}</Td>
          <Td>{obj.user_id}</Td>
          <Td>{obj.productName}</Td>
          <Td>{obj.qty}</Td>
          <Td>{obj.totalPrice}</Td>
        </Tr>
      );
    });
  }

  function tabsMap() {
    return pageTabs.map((content) => {
      return (
        <div
          key={content}
          onClick={() => {
            router.replace(`/admin/laporan/${content.toLowerCase()}`);
            setMainAsc(!mainAsc);
          }}
          className={
            selected.includes(content.toLowerCase())
              ? 'w-[33.3%] flex justify-center items-center bg-[#008DEB] text-white'
              : 'w-[33.3%] flex justify-center items-center '
          }
        >
          Per {content}
        </div>
      );
    });
  }

  const path = router.pathname;

  return (
    <div className="flex w-[100vw] h-[100vh]">
      <AdminNavbar path={path} />
      <div className="w-[85%] h-[100%] flex justify-center">
        <div className="w-[90%] h-[100%]">
          <div className="h-[10%] flex items-center">
            <p className="text-[2rem] mr-[3vw]">Laporan penjualan</p>
          </div>
          <div className="flex items-center h-[10%] w-[100%]">
            <div className="w-[40%] h-[70%] flex flex-col justify-end pb-[.5vh] text-white text-[1rem] bg-[#008DEB] px-[.5vw] rounded-[.5vw]">
              <div>Filter by Date</div>
              <div className="flex w-[100%]">
                <DatePicker
                  placeholderText="Start date"
                  className="border-black w-[14vw] border-solid border-[2px] rounded-[.3vw] pl-3 text-black"
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                  }}
                />
                <DatePicker
                  placeholderText="End date"
                  className="border-black w-[14vw] border-solid border-[2px] rounded-[.3vw] pl-3 text-black"
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                  }}
                />
              </div>
            </div>

            <Button
              colorScheme={'linkedin'}
              variant="ghost"
              className="mx-[3vw]"
              onClick={() => {
                setStartDate();
                setEndDate();
              }}
            >
              Reset Filter
            </Button>

            <div className="flex w-[30%] justify-between">
              <Button
                width="15%"
                onClick={() => {
                  setAsc(!asc);
                }}
              >
                {asc ? 'Asc' : 'Desc'}
              </Button>
              <Button
                colorScheme={sortOption == 'totalPrice' ? 'linkedin' : 'gray'}
                onClick={() => {
                  setSortOption('totalPrice');
                }}
              >
                By Total Price
              </Button>
              <Button
                colorScheme={sortOption == 'date' ? 'linkedin' : 'gray'}
                onClick={() => {
                  setSortOption('date');
                }}
              >
                By Date
              </Button>
            </div>
          </div>
          <div className="h-[80%] bg-gray-200 flex flex-col">
            <div className="h-[10%] flex text-[1.3rem] hover:cursor-pointer">
              {tabsMap()}
            </div>
            <div className="h-[90%] flex items-center justify-center ">
              {props.byProduct?.allTransaction.length ? (
                <div className="w-[100%] h-[100%] overflow-auto scrollbar">
                  <TableContainer>
                    <Table variant={'striped'} colorScheme="blue">
                      <Thead>
                        <Tr>
                          <Th>Tanggal</Th>
                          <Th>Transaction ID</Th>
                          <Th>User</Th>
                          <Th>User ID</Th>
                          <Th>Product</Th>
                          <Th>Quantity</Th>
                          <Th>Total</Th>
                        </Tr>
                      </Thead>
                      <Tbody>{tableSort()}</Tbody>
                    </Table>
                  </TableContainer>
                </div>
              ) : (
                <div className="text-[1.5rem]">No Transactions yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Laporan;

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: '/login' } };

    if (!session.user.user.isAdmin) {
      return { redirect: { destination: '/' } };
    }

    const byProduct = await axiosInstance.get('transactions/all/products');

    return { props: { byProduct: byProduct.data } };
  } catch (error) {
    console.log({ error });
    return { props: { error: error.message } };
  }
}
