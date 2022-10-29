import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/AdminNavbar';
import { useRouter } from 'next/router';
import axiosInstance from '../../../src/config/api';
import Image from 'next/image';
import EditCategoryModal from '../../../components/editCategoryModal';
import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { api_origin } from '../../../constraint/index';
import AddCategoryModal from '../../../components/AddCategoryModal';

function Category(props) {
  const [categoryList, setCategoryList] = useState(props.categoriesLists);
  const [addCategoryButton, setAddCategoryButton] = useState(false);
  const [page, setPage] = useState(1);
  const [editCategoryButton, setEditCategoryButton] = useState(false);
  const [selected, setSelected] = useState('');
  const [currentCategory, setCurrentCategory] = useState(
    props.categoriesLists[0],
  );

  useEffect(() => {
    const { params } = router.query;
    setCategoryList(props.categoriesLists);
    setSelected(params);
  });

  function categoryMap() {
    return categoryList?.map((category, index) => {
      return (
        <div
          key={category.category_lists_id}
          className="w-[90%] mb-[3vh] h-[15%] flex-none flex flex-col items-end shadow-[0px_6px_20px_0px_rgba(0,28,47,0.05)]"
        >
          <div className="flex w-[100%] h-[25%] pl-[1.5vw] bg-[#008DEB] text-white">
            Category ID: {category.category_lists_id}
          </div>

          <div className="w-[100%] h-[85%] flex items-center justify-start">
            <div className="w-[5%] ml-[1.5vw]">
              <Image
                unoptimized
                alt="resep-logo"
                layout="responsive"
                width={1}
                height={1}
                src={api_origin + category.categoryImage}
                loader={() => {
                  return api_origin + category.categoryImage;
                }}
              />
            </div>

            <p className="w-[73%] font-[650] text-[1.1rem] pl-[2vw]">
              {category.category}
            </p>

            <div className="w-[20%] h-[100%] flex items-center justify-evenly">
              <Button
                variant="outline"
                colorScheme="linkedin"
                onClick={() => {
                  setCurrentCategory(category);
                  setEditCategoryButton(true);
                  setCategoryList([...categoryList]);
                }}
                sx={{ width: '45%', height: '5vh' }}
              >
                <p className="text-[12px]">Edit</p>
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={() => {
                  deleteProduct(category.category_lists_id);
                  setCategoryList(props.categoriesLists.splice(index, 1));
                }}
                sx={{ width: '45%', height: '5vh' }}
              >
                <p className="text-[12px]">Hapus</p>
              </Button>
            </div>
          </div>
        </div>
      );
    });
  }

  async function deleteProduct(category_lists_id) {
    try {
      const resDeleteProduct = await axiosInstance.delete(
        `/categoriesLists/${category_lists_id}`,
      );
    } catch (error) {
      console.log({ error });
    }
  }

  const router = useRouter();

  const path = router.pathname;

  return (
    <div className="flex w-[100vw] h-[100vh]">
      <AdminNavbar path={path} />
      <EditCategoryModal
        currentCategory={currentCategory}
        editCategoryButton={editCategoryButton}
        setEditCategoryButton={setEditCategoryButton}
      />
      <AddCategoryModal
        addCategoryButton={addCategoryButton}
        setAddCategoryButton={setAddCategoryButton}
      />

      <div className="h-[100%] w-[85%] flex flex-col items-center justify-evenly">
        <div className="h-[10%] w-[90%] flex items-center font-[500] text-[3vh]">
          Category
        </div>

        <div className="flex flex-col w-[100%] h-[85%] items-center">
          {categoryMap()}
        </div>

        <div className="flex w-[90%] h-[5%] mb-[3vh] items-center">
          <Button
            disabled={page <= 1}
            borderRadius={'none'}
            size={'lg'}
            backgroundColor={'#008DEB'}
            color={'white'}
            onClick={() => {
              setPage(page - 1);

              const splitParams = router.query.params.split('=');

              splitParams[splitParams.length - 1] =
                parseInt(splitParams[splitParams.length - 1]) - 1;

              const joinParams = splitParams.join('=');

              router.replace(`/admin/category/${joinParams}`);
            }}
            style={{ marginRight: '1vw' }}
          >
            {'Previous'}
          </Button>

          <Button
            borderRadius={'none'}
            size={'lg'}
            backgroundColor={'#008DEB'}
            color={'white'}
            onClick={() => {
              setPage(page + 1);

              const splitParams = router.query.params.split('=');

              splitParams[splitParams.length - 1] =
                parseInt(splitParams[splitParams.length - 1]) + 1;

              const joinParams = splitParams.join('=');

              router.replace(`/admin/category/${joinParams}`);
            }}
            disabled={!props.hasMore}
          >
            {'Next'}
          </Button>

          <div className={'grow'} />

          <div
            onClick={() => {
              setAddCategoryButton(true);
            }}
            className="h-[90%] px-[2vw] bg-[#008DEB] text-white flex items-center hover:cursor-pointer mx-1 font-[700]"
          >
            + Tambah Kategori
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    let resGetCategoriesLists = '';

    if (context.params.params.includes('byId')) {
      const splitParams = context.params.params.split('=');
      const page = splitParams[1];
      resGetCategoriesLists = await axiosInstance.get(
        'categoriesLists/categoryList/',
        {
          params: {
            page,
            limit: 5,
          },
        },
      );
    }
    return {
      props: {
        params: context.params,
        categoriesLists: resGetCategoriesLists.data.data.getCategory,
        hasMore: resGetCategoriesLists.data.hasMore,
      },
    };
  } catch (error) {
    console.log({ error });
    return { props: { error: error.message } };
  }
}

export default Category;
