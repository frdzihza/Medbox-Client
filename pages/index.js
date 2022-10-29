import Image from 'next/image';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
  VStack,
} from '@chakra-ui/react';
import { getSession } from 'next-auth/react';
import axiosInstance from '../src/config/api';
import { useRouter } from 'next/router';
import { api_origin } from '../constraint/index';

export default function Home(props) {
  const [hasMore, setHasMore] = useState();
  const [products, setProducts] = useState();
  const [productsPage, setProductsPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { session, fetchedCategories } = props;
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [productsPage]);

  function categoriesMap() {
    if (!fetchedCategories) {
      return 'Empty Categories';
    }

    return fetchedCategories.map((category) => {
      return (
        <div
          key={category.category_lists_id}
          onClick={() => {
            router.replace(
              `/productCatalog/${category.category_lists_id}=category=1`,
            );
          }}
          className="flex flex-col hover:cursor-pointer flex-none items-center justify-start w-[25%] desktop:flex-row desktop:h-[9vh] desktop:w-[31%] desktop:bg-white desktop:shadow-[0px_6px_20px_0px_rgba(0,28,47,0.05)]"
        >
          <div className="w-[35px] h-[35px] desktop:w-[3.5vw] desktop:h-[3.5vw] desktop:mx-[1vw]">
            <Image
              unoptimized
              alt="resep-logo"
              layout="responsive"
              width={35}
              height={35}
              src={api_origin + category.categoryImage}
              loader={() => {
                return api_origin + category.categoryImage;
              }}
            />
          </div>
          <p className="text-[12px] desktop:text-[14px] desktop:font-[500] desktop:font-[#262626]">
            {category.category}
          </p>
        </div>
      );
    });
  }

  function productsMap() {
    if (!products) {
      const skeleton = [1, 2, 3, 4];

      return skeleton.map((skeletonNumber) => {
        return (
          <div
            key={skeletonNumber}
            className="w-[35vw] mx-[3vw] h-[100%] flex-none flex flex-col items-center desktop:w-[10vw]"
          >
            <Skeleton height={'60%'} width={'100%'} marginY={'1vh'} />
            <Skeleton height={'10%'} width={'100%'} marginY={'1vh'} />
            <Skeleton height={'15%'} width={'100%'} marginY={'1vh'} />
          </div>
        );
      });
    }

    return products.map((product) => {
      return (
        <div
          key={product.product_id}
          className="w-[35vw] mx-[3vw] h-[100%] flex-none flex flex-col items-center desktop:w-[10vw]"
        >
          <div className="w-[100%] my-[3vh] hover:cursor-pointer">
            <Image
              unoptimized
              alt="resep-logo"
              layout="responsive"
              width={102}
              height={66}
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
              onClick={() => {
                router.replace(`/detailPage/${product.product_id}`);
              }}
              variant="outline"
              colorScheme="linkedin"
              disabled={!props.session?.user.user.isVerified}
              sx={{ width: '100%', height: '5vh', marginBottom: '6vh' }}
            >
              <p className="text-[12px]">Tambah</p>
            </Button>
          </div>
        </div>
      );
    });
  }

  async function fetchProducts() {
    try {
      const newProducts = await axiosInstance.get('/products/landingPage', {
        params: { limit: 4, productsPage },
      });

      setProducts(newProducts.data.landingPageProducts);
      setHasMore(newProducts.data.hasMore);
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <div className="bg-white w-[100%] h-[100vh] relative z-[1] desktop:scrollbar">
      <Navbar />
      <div id="box biru" className="bg-[#1068A3] h-[53px] desktop:hidden" />
      <div id="hero-desktop" className="relative hidden desktop:inline">
        <p className="absolute z-[2] text-white font-[400] text-[4vw] left-[15vw] bottom-[200px]">
          Your Pharmacy, <br /> Everywhere
        </p>
        <Link href={'/productCatalog'}>
          <p className="absolute z-[2] text-white font-[500] text-[14px] bottom-[55px] left-[15vw] underline underline-offset-4 decoration-white hover:cursor-pointer">
            Lihat Semua Obat
          </p>
        </Link>
        <div
          id="searchbar desktop"
          className="bg-[#F5F6F6] flex absolute w-[40vw] h-[8vh] z-[2] left-[15vw] bottom-[10vh] justify-end"
        >
          <Input
            variant="unstyled"
            placeholder="Cari Obat"
            sx={{ paddingLeft: '5%' }}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
          />
          <div
            onClick={() => {
              router.replace(`/productCatalog/${searchQuery}=key=1`);
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
        <Image
          src="/landingpage/Hero-desktop.svg"
          alt="arrow-logo"
          layout="responsive"
          width={1440}
          height={408}
        />
      </div>
      <div className="w-[100%] desktop:flex desktop:flex-col desktop:items-center">
        <div id="resep doktor" className="desktop:w-[70%]">
          <p className="font-[500] text-[22px] hidden desktop:flex desktop:mt-[5vh]">
            Punya Resep dari Dokter?
          </p>
          <div className="flex bg-[#F2F8FC] items-center w-[94vw] h-[10vh] mt-[7vh] ml-[3vw] desktop:w-[100%] desktop:mt-0 desktop:ml-0">
            <div className="mx-[25px] mt-[10px]">
              <Image
                src="/landingpage/Punya-resep.png"
                alt="resep-logo"
                layout="fixed"
                width={35}
                height={35}
              />
            </div>
            <div className="mr-[80px]">
              <p className="font-[500] text-[14px] desktop:hidden">
                Punya Resep Dokter?
              </p>
              <p className="font-[500] text-[14px] desktop:inline hidden">
                Unggah Resep
              </p>
              <p className="font-[400] w-[150px] desktop:w-[50vw] text-[12px] text-[#6E6E6E]">
                klik disini untuk kirim foto resep dokter
              </p>
            </div>
            <div className="w-[18px] h-[14px] desktop:hidden">
              <Image
                src="/landingpage/Arrow.png"
                alt="arrow-logo"
                layout="responsive"
                width={18}
                height={14}
              />
            </div>
            <div className="hidden desktop:inline">
              <Link href={session ? '/upload-prescription-image' : '/login'}>
                <Button
                  variant="outline"
                  colorScheme="linkedin"
                  sx={{ width: '8vw', height: '6vh' }}
                >
                  <p className="font-[500] text-[.9rem]">Unggah Resep</p>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div id="kategori obat" className="mt-[4 vh] desktop:w-[70%]">
          <p className="flex pl-[4vw] mt-[3vh] mb-[2vh] font-[500] text-[16px] desktop:text-[22px] w-[100%] desktop:pl-0">
            Jelajahi Kategori Obat
          </p>
          <div className="w-[100%] h-[30vh] items-center flex flex-wrap justify-evenly">
            {categoriesMap()}
          </div>
        </div>
        <div
          id="Rekomendasi Obat & Vitamin"
          className="mt-[4 vh] desktop:w-[70%]"
        >
          <p className="flex pl-[4vw] font-[500] text-[16px] desktop:text-[22px] w-[100%] desktop:pl-0">
            Rekomendasi Obat & Vitamin
          </p>
          <div className="w-[100%] h-[40vh] flex items-center justify-between">
            <Button
              disabled={productsPage == 1}
              onClick={() => {
                setProductsPage(productsPage - 1);
              }}
              width={'5vh'}
              height={'5vh'}
              rounded={'50%'}
            >
              {'<<'}
            </Button>
            <div className="flex w-[100%]">{productsMap()}</div>
            <Button
              disabled={productsPage == 3}
              onClick={() => {
                setProductsPage(productsPage + 1);
              }}
              width={'5vh'}
              height={'5vh'}
              rounded={'50%'}
            >
              {'>>'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    const fetchedCategories = await axiosInstance.get(
      'categories/getLandingCategories',
    );

    return {
      props: {
        session,
        fetchedCategories: fetchedCategories.data.resGetCategories,
      },
    };
  } catch (error) {
    console.log({ error });
    return { props: {} };
  }
}
