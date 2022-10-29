import {
  AddIcon,
  Flex,
  Box,
  HStack,
  Button,
  ButtonGroup,
  IconButton,
  Input,
} from '@chakra-ui/react';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../src/config/api';
import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { useToast } from '@chakra-ui/react';
import { api_origin } from '../../constraint/index';

function DetailPage(props) {
  const { products } = props;
  const [loading, setLoading] = useState(false);
  const { product_id } = products;
  const [quantity, setQuantity] = useState(1);

  const toast = useToast();

  const onAddClick = async () => {
    setLoading(true);
    try {
      const body = {
        quantity,
        product_id,
        user_id: props.user_id,
      };

      const session = await getSession();

      const { user_token } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };

      const res = await axiosInstance.post(
        `carts/addToCart/${product_id}`,
        body,
        config,
      );
      toast({
        title: 'Add To Cart',
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="flex-col">
          <div className="w-[65%] ml-[1vw] my-[3vh] columns-2">
            <Image
              unoptimized
              alt="resep-logo"
              layout="responsive"
              width={50}
              height={50}
              src={api_origin + products.productImage}
              loader={() => {
                return api_origin + products.productImage;
              }}
            />
            <div className="flex-row font-semibold">
              <p className="text-[25px]">{products.productName}</p>
              <br />
              <div className="flex bg-white w-[100%] items-center text-[#6E6E6E]">
                <p className="text-[20px] font-[400]">{products.packageType}</p>
                <p className="text-[20px] font-[400] mx-[1vw]">-</p>
                <p className="text-[20px] font-[400]">
                  Stok {products.productStock}
                </p>
              </div>
              <br />
              <div className="flex bg-white w-[100%] items-center text-[#6E6E6E]">
                <p className="text-[20px] font-[400]">
                  Price: Rp. {products.productPrice.toLocaleString('id')}
                </p>
              </div>
              <br />
              <div className="flex bg-white w-[100%] items-center">
                <p className="text-[16.3px] font-[400]">
                  Desription
                  <br />
                  {products.description}
                </p>
              </div>
              <br />
              {loading ? (
                <Button onClick={onAddClick} isLoading colorScheme="linkedin">
                  Add To Cart
                </Button>
              ) : (
                <>
                  {quantity == 0 ? (
                    <Button
                      isDisabled
                      width="50px"
                      onClick={() => {
                        setQuantity(quantity - 1);
                      }}
                      colorScheme="linkedin"
                      mx={3}
                    >
                      -
                    </Button>
                  ) : (
                    <Button
                      width="50px"
                      onClick={() => {
                        setQuantity(quantity - 1);
                      }}
                      colorScheme="linkedin"
                      mx={3}
                    >
                      -
                    </Button>
                  )}

                  <Input
                    htmlSize={4}
                    width="50px"
                    variant="outline"
                    placeholder="0"
                    value={quantity}
                  />
                  <Button
                    width="50px"
                    onClick={() => {
                      setQuantity(quantity + 1);
                    }}
                    colorScheme="linkedin"
                    mx={3}
                  >
                    +
                  </Button>
                  <Button mx={3} onClick={onAddClick} colorScheme="teal">
                    Add To Cart
                  </Button>
                </>
              )}
              {/* <Button colorScheme="linkedin">Add To Cart</Button> */}
              <br />
            </div>
          </div>
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
    const { product_id } = context.params;

    const resGetProduct = await axiosInstance.get(
      `/products/byId/${product_id}`,
      config,
    );

    if (!resGetProduct) return { redirect: { destination: '/' } };

    return {
      props: {
        products: resGetProduct.data.data,
        user_id,
      },
    };
  } catch (error) {
    console.log({ error });
    const { message } = error;
    return { props: { message } };
  }
}

export default DetailPage;
