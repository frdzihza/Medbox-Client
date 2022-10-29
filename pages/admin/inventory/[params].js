import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../../components/AdminNavbar';
import { useRouter } from 'next/router';
import {
  Button,
  Box,
  HStack,
  Text,
  Input,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import axiosInstance from '../../../src/config/api';
import Link from 'next/link';
import AddFormulaModal from '../../../components/AddFormulaModal';
import AddProductModal from '../../../components/AddProductModal';
import AdminProductDetails from '../../../components/adminProductDetails';
import EditProductModal from '../../../components/editProductModal';
import AddCategoryModal from '../../../components/AddCategoryModal';
import { getSession, useSession } from 'next-auth/react';
import { api_origin } from '../../../constraint/index';

function Inventory(props) {
  const router = useRouter();
  const { params } = router.query;
  const splitParams = params.split('=');
  const [selected, setSelected] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [productList, setProductList] = useState(props.products);
  const [currentPage, setCurrentPage] = useState(
    parseInt(splitParams[splitParams.length - 1]),
  );
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentProduct, setCurrentProduct] = useState(props.products[0]);
  const [addProductButton, setAddProductButton] = useState(false);
  const [openProductDetails, setOpenProductDetails] = useState(false);
  const [editProductButton, setEditProductButton] = useState(false);
  const [productsAll, setProductsAll] = useState(props.productsAll);
  const [addFormulaButton, setAddFormulaButton] = useState(false);

  useEffect(() => {
    setProductList(props.products);
    setProductsAll(props.productsAll);
    setSelected(params);
  });

  const session = useSession();
  const toast = useToast();

  if (session.data) {
    if (!session.data.user.user.isAdmin) {
      router.replace('/');
    }
  }


  function showCategoriesSwitch() {
    setShowCategories(!showCategories);
  }

  function categoriesMap() {
    return props.categoriesLists.categories.map((category) => {
      const selectedCategoryListsId = selected.split('=')[0];

      return (
        <div
          key={category.category_lists_id}
          onClick={() => {
            router.replace(
              `/admin/inventory/${category.category_lists_id}=category=1`,
            );
            setCurrentPage(1);
            setSearchKeyword('');
          }}
          className={
            selectedCategoryListsId == category.category_lists_id
              ? 'h-[7vh] pl-[1vw] flex items-center font-[400] text-[1.1rem] text-white cursor-pointer bg-[#008DEB]'
              : 'h-[7vh] pl-[1vw] flex items-center font-[400] text-[1.1rem] border-transparent hover:text-white hover:cursor-pointer hover:bg-[#008DEB] bg-white'
          }
        >
          {category.category.length <= 20
            ? category.category
            : `${category.category.slice(0, 20)}...`}
        </div>
      );
    });
  }

  function productMap() {
    return productList?.map((product, index) => {
      return (
        <div
          key={product.product_id}
          className="w-[90%] mb-[1%] h-[30%] flex-none flex flex-col items-end bg-white"
        >
          <div className="pl-[1.5vw] flex w-[100%] bg-[#008DEB] text-white">
            Product ID: {product.product_id}
          </div>

          <div className="w-[100%] h-[85%] flex-none flex justify-center items-center">
            <div
              onClick={() => {
                setCurrentProduct(product);
                setOpenProductDetails(true);
              }}
              className="w-[7vw] ml-[1.5vw] hover:cursor-pointer"
            >
              <Image
                unoptimized
                alt="resep-logo"
                layout="responsive"
                width={1}
                height={1}
                src={api_origin + product.productImage}
                loader={() => {
                  return api_origin + product.productImage;
                }}
              />
            </div>

            <div className="flex flex-col w-[70%] text-black h-[7vw] justify-center pl-[2vw] text-[#6E6E6E]">
              <p className="font-[500] text-[1.5rem]">
                {product.productName.length <= 40
                  ? product.productName
                  : `${product.productName.slice(0, 40)}...`}
              </p>
              <p className="text-[1.1rem] font-[400]">
                Rp.{product.productPrice.toLocaleString('id')}
              </p>
              <p className="text-[1.1rem] font-[400]">
                Stok {product.productStock}
              </p>
              <Link href={`/admin/adminDetailProduct/${product.product_id}`}>
                <Button
                  width={125}
                  bgColor="white"
                  _hover="white"
                  variant="solid"
                  color="blue.400"
                >
                  Riwayat Produk
                </Button>
              </Link>
            </div>

            <div className="grow" />

            <div className="w-[10%] flex flex-col h-[7vw] justify-evenly mr-[1.5vw]">
              <Button
                variant="outline"
                colorScheme="linkedin"
                onClick={() => {
                  setCurrentProduct(product);
                  setEditProductButton(true);
                }}
                sx={{ width: '100%', height: '5vh' }}
              >
                <p className="text-[12px]">Edit</p>
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={() => {
                  deleteProduct(product.product_id, index);
                }}
                sx={{ width: '100%', height: '5vh' }}
              >
                <p className="text-[12px]">Hapus</p>
              </Button>
            </div>
          </div>
        </div>
      );
    });
  }

  async function deleteProduct(product_id, index) {
    try {
      await axiosInstance.delete(`/products/${product_id}`);
      setProductList(props.products.splice(index, 1));
    } catch (error) {
      console.log({ error });
      toast({
        title: 'Unexpected Fail!',
        description: error.response?.data?.message
          ? error.response.data.message
          : error.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <div className="flex w-[100vw] h-[100vh]">
      <AdminNavbar path={router.pathname} />
      <div className="flex flex-col w-[85%] items-center">
        <div className="h-[10%] w-[90%] flex items-center font-[500] text-[3vh]">
          Inventory
        </div>
        <AddFormulaModal
          addFormulaButton={addFormulaButton}
          setAddFormulaButton={setAddFormulaButton}
          allProducts={props.productsAll.data.resGetAllProducts}
        />
        <AddProductModal
          addProductButton={addProductButton}
          setAddProductButton={setAddProductButton}
          categoriesLists={props.categoriesLists.categories}
        />
        <EditProductModal
          currentProduct={currentProduct}
          editProductButton={editProductButton}
          productList={productList}
          setProductList={setProductList}
          setEditProductButton={setEditProductButton}
          categoriesLists={props.categoriesLists.categories}
        />
        <AdminProductDetails
          currentProduct={currentProduct}
          openProductDetails={openProductDetails}
          setOpenProductDetails={setOpenProductDetails}
        />
        <div className="h-[90%] w-[90%]">
          <div className="flex flex-col w-[100%] bg-[#F5F6F6] h-[100%]">
            <div className="flex h-[10%] w-[100%]">
              <div
                onClick={() => {
                  router.replace(`/admin/inventory/byId=1`);
                  setCurrentPage(1);
                  setSearchKeyword('');
                }}
                className={
                  selected.includes('byId')
                    ? 'w-[20%] flex items-center justify-center bg-[#008DEB] text-white hover:cursor-pointer'
                    : 'w-[20%] flex items-center justify-center bg-[#F5F6F6] hover:cursor-pointer'
                }
              >
                By Id
              </div>
              <div
                onClick={() => {
                  router.replace(`/admin/inventory/sort=productName=ASC=1`);
                  setCurrentPage(1);
                  setSearchKeyword('');
                }}
                className={
                  selected.includes('sort=productName=ASC')
                    ? 'w-[20%] flex items-center justify-center bg-[#008DEB] text-white hover:cursor-pointer'
                    : 'w-[20%] flex items-center justify-center bg-[#F5F6F6] hover:cursor-pointer'
                }
              >
                Name Asc
              </div>
              <div
                onClick={() => {
                  router.replace(`/admin/inventory/sort=productName=DESC=1`);
                  setCurrentPage(1);
                  setSearchKeyword('');
                }}
                className={
                  selected.includes('sort=productName=DESC')
                    ? 'w-[20%] flex items-center justify-center bg-[#008DEB] text-white hover:cursor-pointer'
                    : 'w-[20%] flex items-center justify-center bg-[#F5F6F6] hover:cursor-pointer'
                }
              >
                Name Desc
              </div>
              <div
                onClick={() => {
                  router.replace(`/admin/inventory/sort=productPrice=ASC=1`);
                  setCurrentPage(1);
                  setSearchKeyword('');
                }}
                className={
                  selected.includes('sort=productPrice=ASC')
                    ? 'w-[20%] flex items-center justify-center bg-[#008DEB] text-white hover:cursor-pointer'
                    : 'w-[20%] flex items-center justify-center bg-[#F5F6F6] hover:cursor-pointer'
                }
              >
                Price Asc
              </div>
              <div
                onClick={() => {
                  router.replace(`/admin/inventory/sort=productPrice=DESC=1`);
                  setCurrentPage(1);
                  setSearchKeyword('');
                }}
                className={
                  selected.includes('sort=productPrice=DESC')
                    ? 'w-[20%] flex items-center justify-center bg-[#008DEB] text-white hover:cursor-pointer'
                    : 'w-[20%] flex items-center justify-center bg-[#F5F6F6] hover:cursor-pointer'
                }
              >
                Price Desc
              </div>
            </div>

            <div className="w-[100%] h-[7vh] flex justify-between my-[2vh] px-[3vw]">
              <div
                id="searchbar desktop"
                className="bg-white flex w-[35vw] h-[7vh] z-[2] left-[15vw] bottom-[88px] justify-end"
              >
                <Input
                  onChange={(event) => {
                    setSearchKeyword(event.target.value);
                  }}
                  value={searchKeyword}
                  variant="unstyled"
                  placeholder="Cari Obat"
                  sx={{ paddingLeft: '5%' }}
                />
                <div
                  onClick={() => {
                    router.replace(`/admin/inventory/${searchKeyword}=key=1`);
                    setCurrentPage(1);
                  }}
                  className="bg-[#008DEB] flex items-center justify-center w-[20%] hover:cursor-pointer"
                >
                  <Image
                    src="/landingpage/Search-desktop.png"
                    alt="arrow-logo"
                    layout="fixed"
                    width={24}
                    height={24}
                  />
                </div>
              </div>

              <div
                id="categories"
                className={
                  showCategories
                    ? 'w-[30%] h-[50vh] bg-white flex flex-col z-[3]'
                    : 'w-[30%] h-[100%] bg-white flex flex-col z-[3]'
                }
              >
                <div
                  onClick={showCategoriesSwitch}
                  className={
                    showCategories
                      ? 'text-[1.2rem] font-[500] flex hover:cursor-pointer justify-between w-[100%] h-[7vh] px-[1vw]'
                      : 'text-[1.2rem] font-[500] flex hover:cursor-pointer justify-between bg-white w-[100%] h-[7vh] px-[1vw]'
                  }
                >
                  <div className="flex items-center justify-center">
                    Kategori
                  </div>
                  <div
                    className={
                      showCategories
                        ? 'w-[4%] flex items-center justify-center rotate-90 transition duration-100'
                        : 'w-[4%] flex items-center justify-center transition duration-100'
                    }
                  >
                    <FontAwesomeIcon icon={faCaretRight} />
                  </div>
                </div>
                <div
                  className={
                    showCategories
                      ? 'overflow-auto scrollbar h-[43vh] bg-white'
                      : ''
                  }
                >
                  {showCategories ? categoriesMap() : ''}
                </div>
              </div>
            </div>

            <div className="h-[70%] w-[100%] flex flex-col items-center">
              {productMap()}
            </div>

            <div className="w-[100%] flex justify-between px-[3vw]">
              <div className="w-[10%] flex justify-between">
                <Button
                  size="lg"
                  borderRadius={'none'}
                  disabled={currentPage <= 1}
                  colorScheme="linkedin"
                  onClick={() => {
                    setCurrentPage(currentPage - 1);

                    const splitParams = router.query.params.split('=');

                    splitParams[splitParams.length - 1] =
                      parseInt(splitParams[splitParams.length - 1]) - 1;

                    const joinParams = splitParams.join('=');

                    router.replace(`/admin/inventory/${joinParams}`);
                  }}
                >
                  {'<'}
                </Button>
                <div className="h-[100%] w-[7vw] flex items-center justify-center">
                  {currentPage}
                </div>
                <Button
                  borderRadius={'none'}
                  onClick={() => {
                    setCurrentPage(currentPage + 1);

                    const splitParams = router.query.params.split('=');

                    splitParams[splitParams.length - 1] =
                      parseInt(splitParams[splitParams.length - 1]) + 1;

                    const joinParams = splitParams.join('=');

                    router.replace(`/admin/inventory/${joinParams}`);
                  }}
                  disabled={!props.hasMore}
                  size="lg"
                  colorScheme="linkedin"
                >
                  {'>'}
                </Button>
              </div>

              <div className="flex">
                <div
                  onClick={() => {
                    setAddFormulaButton(true);
                  }}
                  className="h-[100%] px-[2vw] bg-[#008DEB] text-white flex items-center hover:cursor-pointer mx-1"
                >
                  + Tambah Obat Racikan
                </div>

                <div
                  onClick={() => {
                    setAddProductButton(true);
                  }}
                  className="h-[100%] px-[2vw] bg-[#008DEB] text-white flex items-center hover:cursor-pointer mx-1"
                >
                  + Tambah Produk
                </div>
              </div>
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

    if (!session.user.user.isAdmin) {
      return { redirect: { destination: '/' } };
    }

    const resGetCategoriesLists = await axiosInstance.get('categories/getAll');

    let resGetProducts = '';

    if (context.params.params.includes('byId')) {
      const splitParams = context.params.params.split('=');

      const page = splitParams[1];

      resGetProducts = await axiosInstance.get('products/all', {
        params: { page, limit: 3 },
      });
    } else if (context.params.params.includes('sort')) {
      const splitParams = context.params.params.split('=');

      const page = splitParams[splitParams.length - 1];

      resGetProducts = await axiosInstance.get(
        `products/sort/${context.params.params}`,
        { params: { page, limit: 3 } },
      );
    } else if (context.params.params.includes('category')) {
      const splitParams = context.params.params.split('=');

      const page = splitParams[splitParams.length - 1];

      resGetProducts = await axiosInstance.get(
        `products/byCategory/${context.params.params}`,
        { params: { page, limit: 3 } },
      );
    } else if (context.params.params.includes('key')) {
      const splitParams = context.params.params.split('=');

      const page = splitParams[splitParams.length - 1];

      resGetProducts = await axiosInstance.get(
        `products/specifics/${splitParams[0]}`,
        {
          params: { page, limit: 3 },
        },
      );
    }
    const resGetAllProductsAll = await axiosInstance.get('products');

    return {
      props: {
        params: context.params,
        categoriesLists: resGetCategoriesLists.data,
        products: resGetProducts.data.products,
        hasMore: resGetProducts.data.hasMore,
        productsAll: resGetAllProductsAll.data,
      },
    };
  } catch (error) {
    console.log({ error });
    return { props: { error: error.message } };
  }
}

export default Inventory;
