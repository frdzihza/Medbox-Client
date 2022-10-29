import { Button, Input, Link } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../src/config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { api_origin } from '../../constraint/index';

function ProductCatalog(props) {
  const [selected, setSelected] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [productList, setProductList] = useState(props.products);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  const router = useRouter();
  const { session } = props;

  useEffect(() => {
    const { params } = router.query;
    setSelected(params);
    setProductList(props.products);
  });

  useEffect(() => {
    const { params } = router.query;
    if (params.includes('key')) {
      const splitParams = params.split('=');
      setSearchKeyword(splitParams[0]);
    }
  }, []);

  function showCategoriesSwitch() {
    setShowCategories(!showCategories);
  }

  function showSortSwitch() {
    setShowSort(!showSort);
  }

  function productMap() {
    return productList?.map((product) => {
      return (
        <div
          key={product.product_id}
          className="w-[13%] mx-[2vw] mb-[-2vh] h-[35vh] flex-none flex flex-col items-center shadow-[0px_6px_20px_0px_rgba(0,28,47,0.05)]"
        >
          <div className="w-[100%] my-[3vh] hover:cursor-pointer">
            <Image
              unoptimized
              alt="resep-logo"
              layout="responsive"
              width={100}
              height={70}
              src={api_origin + product.productImage}
              loader={() => {
                return api_origin + product.productImage;
              }}
            />
          </div>
          <p className="text-[12px] w-[100%]">
            {product.productName.length <= 25
              ? product.productName
              : `${product.productName.slice(0, 20)}...`}
          </p>
          <div className="flex bg-white w-[100%] items-center text-[#6E6E6E]">
            <p className="text-[10px] font-[400]">{product.packageType}</p>
            <p className="text-[10px] font-[400] mx-[1vw]">-</p>
            <p className="text-[10px] font-[400]">
              Stok {product.productStock}
            </p>
          </div>
          <p className="font-[500] text-[12px] w-[100%]">
            Rp.{product.productPrice.toLocaleString('id')}
          </p>
          <div className="grow" />
          <div className="w-[100%]">
            <Button
              variant="outline"
              onClick={() => {
                if (session?.user.user.isVerified) {
                  router.replace(`/detailPage/${product.product_id}`);
                } else {
                  router.replace('/login');
                }
              }}
              colorScheme="linkedin"
              sx={{ width: '100%', height: '5vh' }}
              disabled={!session?.user.user.isVerified}
            >
              <p className="text-[12px]">Tambah</p>
            </Button>
            {/* <Button
                variant="outline"
                colorScheme="linkedin"
                sx={{ width: '100%', height: '5vh' }}
                disabled={!props.session?.user.user.isVerified}
              >
                <p className="text-[12px]">Tambah</p>
              </Button> */}
          </div>
        </div>
      );
    });
  }

  function categoriesMap() {
    return props.categoriesLists?.categories.map((category) => {
      const selectedCategoryListsId = selected.split('=')[0];

      return (
        <div
          key={category.category_lists_id}
          onClick={() => {
            router.replace(
              `/productCatalog/${category.category_lists_id}=category=1`,
            );
            setCurrentPage(1);
            setSearchKeyword('');
          }}
          className={
            selectedCategoryListsId == category.category_lists_id
              ? 'p-[1vh] my-[1vh] font-[400] text-[1.1rem] rounded-[2vw] border-solid border-[1px] border-[#008DEB] cursor-pointer bg-cyan-100'
              : 'p-[1vh] my-[1vh] font-[400] text-[1.1rem] rounded-[2vw] border-solid border-[1px] border-transparent hover:border-[#008DEB] hover:cursor-pointer hover:bg-cyan-100'
          }
        >
          {category.category.length <= 15
            ? category.category
            : `${category.category.slice(0, 15)}...`}
        </div>
      );
    });
  }

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex w-[100%] h-[92%] items-end justify-center">
        <div className="flex w-[92%] h-[96%]">
          <div className="bg-cya-500 bg-white w-[14%] h-[100%] flex flex-col pr-[.5vw]">
            <div className="border-b-[.1px] border-black p-[1vh]">
              <p
                onClick={() => {
                  router.replace(`/productCatalog/semuaObat=1`);
                  setCurrentPage(1);
                  setSearchKeyword('');
                }}
                className={
                  selected.includes('semuaObat')
                    ? 'text-[1.2rem] font-[500] py-[1vh] px-[2vh] rounded-[2vw] border-solid border-[1px] rounded-[2vw] border-[#008DEB] cursor-pointer bg-cyan-100'
                    : 'text-[1.2rem] font-[500] py-[1vh] px-[2vh] rounded-[2vw] border-solid border-[1px] border-transparent hover:border-[#008DEB] hover:cursor-pointer hover:bg-cyan-100'
                }
              >
                Semua Obat
              </p>
            </div>
            <div
              id="categories"
              className="border-b-[.1px] border-black p-[1vh]"
            >
              <div
                onClick={showCategoriesSwitch}
                className="text-[1.2rem] font-[500] flex hover:cursor-pointer justify-between"
              >
                <p>Kategori</p>
                <div
                  className={
                    showCategories
                      ? 'w-[5%] flex items-center justify-center rotate-90 transition duration-100'
                      : 'w-[5%] flex items-center justify-center transition duration-100'
                  }
                >
                  <FontAwesomeIcon icon={faCaretRight} />
                </div>
              </div>
              <div
                className={
                  showCategories ? 'overflow-auto scrollbar h-[35vh]' : ''
                }
              >
                {showCategories ? categoriesMap() : ''}
              </div>
            </div>
            <div id="sort" className="border-b-[.1px] border-black p-[1vh]">
              <div
                onClick={showSortSwitch}
                className="text-[1.2rem] font-[500] flex hover:cursor-pointer justify-between"
              >
                <p className="text-[1.2rem] font-[500]">Sort By</p>
                <div
                  className={
                    showSort
                      ? 'w-[5%] flex items-center justify-center rotate-90 transition duration-100'
                      : 'w-[5%] flex items-center justify-center transition duration-100'
                  }
                >
                  <FontAwesomeIcon icon={faCaretRight} />
                </div>
              </div>
              <div className={showSort ? 'flex flex-col mt-[2vh]' : 'hidden'}>
                <div
                  onClick={() => {
                    router.replace(`/productCatalog/sort=productPrice=ASC=1`);
                    setCurrentPage(1);
                    setSearchKeyword('');
                  }}
                  className={
                    selected.includes('sort=productPrice=ASC')
                      ? 'p-[1vh] my-[1vh] font-[400] text-[1.1rem] rounded-[2vw] border-solid border-[1px] border-[#008DEB] cursor-pointer bg-cyan-100'
                      : 'p-[1vh] my-[1vh] font-[400] text-[1.1rem] rounded-[2vw] border-solid border-[1px] border-transparent hover:border-[#008DEB] hover:cursor-pointer hover:bg-cyan-100'
                  }
                >
                  Price Asc
                </div>
                <div
                  onClick={() => {
                    router.replace(`/productCatalog/sort=productPrice=DESC=1`);
                    setCurrentPage(1);
                    setSearchKeyword('');
                  }}
                  className={
                    selected.includes('sort=productPrice=DESC')
                      ? 'p-[1vh] my-[1vh] font-[400] text-[1.1rem] rounded-[2vw] border-solid border-[1px] border-[#008DEB] cursor-pointer bg-cyan-100'
                      : 'p-[1vh] my-[1vh] font-[400] text-[1.1rem] rounded-[2vw] border-solid border-[1px] border-transparent hover:border-[#008DEB] hover:cursor-pointer hover:bg-cyan-100'
                  }
                >
                  Price Desc
                </div>
                <div
                  onClick={() => {
                    router.replace(`/productCatalog/sort=productName=ASC=1`);
                    setCurrentPage(1);
                    setSearchKeyword('');
                  }}
                  className={
                    selected.includes('sort=productName=ASC')
                      ? 'p-[1vh] my-[1vh] font-[400] text-[1.1rem] rounded-[2vw] border-solid border-[1px] border-[#008DEB] cursor-pointer bg-cyan-100'
                      : 'p-[1vh] my-[1vh] font-[400] text-[1.1rem] rounded-[2vw] border-solid border-[1px] border-transparent hover:border-[#008DEB] hover:cursor-pointer hover:bg-cyan-100'
                  }
                >
                  Name Asc
                </div>
                <div
                  onClick={() => {
                    router.replace(`/productCatalog/sort=productName=DESC=1`);
                    setCurrentPage(1);
                    setSearchKeyword('');
                  }}
                  className={
                    selected.includes('sort=productName=DESC')
                      ? 'p-[1vh] my-[1vh] font-[400] text-[1.1rem] rounded-[2vw] border-solid border-[1px] border-[#008DEB] cursor-pointer bg-cyan-100'
                      : 'p-[1vh] my-[1vh] font-[400] text-[1.1rem] rounded-[2vw] border-solid border-[1px] border-transparent hover:border-[#008DEB] hover:cursor-pointer hover:bg-cyan-100'
                  }
                >
                  Name Desc
                </div>
              </div>
            </div>
          </div>

          <div className="w-[86%] h-[100%] flex flex-col">
            <div className="flex w-[80%] justify-between">
              <div
                id="searchbar desktop"
                className="bg-[#F5F6F6] flex w-[35vw] h-[7vh] z-[2] left-[15vw] bottom-[88px] justify-end ml-[5vw]"
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
                    router.replace(`/productCatalog/${searchKeyword}=key=1`);
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
            </div>

            <div className="h-[85%] flex flex-wrap overflow-auto scrollbar">
              {productMap()}
            </div>

            <div className="w-[100%] flex justify-end">
              <div className="w-[10%] flex justify-between">
                <Button
                  size="lg"
                  disabled={currentPage <= 1}
                  colorScheme="linkedin"
                  onClick={() => {
                    setCurrentPage(currentPage - 1);

                    const splitParams = router.query.params.split('=');

                    splitParams[splitParams.length - 1] =
                      parseInt(splitParams[splitParams.length - 1]) - 1;

                    const joinParams = splitParams.join('=');

                    router.replace(`/productCatalog/${joinParams}`);
                  }}
                >
                  {'<'}
                </Button>
                <div className="h-[100%] w-[7vw] flex items-center justify-center">
                  {currentPage}
                </div>
                <Button
                  onClick={() => {
                    setCurrentPage(currentPage + 1);

                    const splitParams = router.query.params.split('=');

                    splitParams[splitParams.length - 1] =
                      parseInt(splitParams[splitParams.length - 1]) + 1;

                    const joinParams = splitParams.join('=');

                    router.replace(`/productCatalog/${joinParams}`);
                  }}
                  disabled={!props.hasMore}
                  size="lg"
                  colorScheme="linkedin"
                >
                  {'>'}
                </Button>
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
    const resGetCategoriesLists = await axiosInstance.get('categories/getAll');

    let resGetProducts = '';

    if (context.params.params.includes('semuaObat')) {
      const splitParams = context.params.params.split('=');

      const page = splitParams[1];

      resGetProducts = await axiosInstance.get('products/all', {
        params: { page, limit: 10 },
      });
    } else if (context.params.params.includes('sort')) {
      const splitParams = context.params.params.split('=');

      const page = splitParams[splitParams.length - 1];

      resGetProducts = await axiosInstance.get(
        `products/sort/${context.params.params}`,
        { params: { page, limit: 10 } },
      );
    } else if (context.params.params.includes('category')) {
      const splitParams = context.params.params.split('=');

      const page = splitParams[splitParams.length - 1];

      resGetProducts = await axiosInstance.get(
        `products/byCategory/${context.params.params}`,
        { params: { page, limit: 10 } },
      );
    } else if (context.params.params.includes('key')) {
      const splitParams = context.params.params.split('=');

      const page = splitParams[splitParams.length - 1];

      resGetProducts = await axiosInstance.get(
        `products/specifics/${splitParams[0]}`,
        {
          params: { page, limit: 10 },
        },
      );
    }
    const { user_id } = context.params;

    const res = await axiosInstance.get(`/users/${user_id}`);

    return {
      props: {
        params: context.params,
        categoriesLists: resGetCategoriesLists.data,
        products: resGetProducts.data.products,
        hasMore: resGetProducts.data.hasMore,
        users: res.data,
        session,
      },
    };
  } catch (error) {
    console.log({ error });
    return { props: { Error: error.message } };
  }
}

export default ProductCatalog;
