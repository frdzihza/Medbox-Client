import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Image from 'next/image';
import axiosInstance from '../../src/config/api';
import { api_origin } from '../.././constraint';
function EditCategoryModal({
  editCategoryButton,
  setEditCategoryButton,
  currentCategory,
}) {
  const [newCategory, setNewCategory] = useState({
    category: currentCategory.category,
    categoryImage: currentCategory.categoryImage,
  });
  const [categoryImageFile, setCategoryImageFile] = useState();
  const [newCategoryImage, setNewCategoryImage] = useState(
    currentCategory.categoryImage,
  );
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editCategoryButton) {
      onOpen();
    } else if (!editCategoryButton) {
      onClose();
    }

    setNewCategory({
      category: currentCategory.category,
      categoryImage: currentCategory.categoryImage,
    });
    setNewCategoryImage(currentCategory.categoryImage);
  }, [editCategoryButton]);

  async function updateCategoryClick() {
    try {
      setLoading(true);
      if (
        Object.values(newCategory).includes('') ||
        Object.values(newCategory).includes(undefined)
      ) {
        toast({
          description: 'Tolong Isi Semua',
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      const categoryImageFileBody = new FormData();

      categoryImageFileBody.append('categoriesImage', categoryImageFile);

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      const resPatchCategory = await axiosInstance.patch(
        `/categoriesLists/categoryUpdate/${currentCategory.category_lists_id}`,
        {
          newCategory,
          currentCategory,
        },
      );

      const extName = newCategory.categoryImage.split('.');

      const resPatchCategoryImage = await axiosInstance.post(
        `/categoriesLists/upload/${resPatchCategory.data.data.resUpdateCategoryList.category_lists_id}.${extName[1]}`,
        categoryImageFileBody,
        config,
      );

      if (resPatchCategory) {
        setEditCategoryButton(false);
      }
      toast({
        description: resPatchCategory.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setLoading(false);
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
      setLoading(false);
      setEditCategoryButton(false);
    }
  }

  function handleImageChange(event) {
    setNewCategoryImage(URL.createObjectURL(event.target.files[0]));
    setNewCategory({
      ...newCategory,
      categoryImage: event.target.files[0].name,
    });
    setCategoryImageFile(event.target.files[0]);
  }

  const handleChange = (prop) => (event) => {
    setNewCategory({ ...newCategory, [prop]: event.target.value });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setEditCategoryButton(false);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ubah Category</ModalHeader>
        <ModalBody>
          <p>Foto</p>
          <div className="w-[35%] my-[.5vh] hover:cursor-pointer">
            <label
              className="hover:cursor-pointer"
              htmlFor="categoryImageInput"
            >
              <Image
                unoptimized
                src={
                  newCategoryImage.includes(api_origin.slice(0, 16))
                    ? newCategoryImage
                    : api_origin + newCategoryImage
                }
                style={{ borderRadius: '.3vw' }}
                width={1}
                height={1}
                layout="responsive"
              />
            </label>
          </div>
          <input
            onChange={handleImageChange}
            className="hidden"
            id="categoryImageInput"
            type="file"
          />
          <Input
            value={newCategory.category}
            onChange={handleChange('category')}
            placeholder="Category"
            size="lg"
            height="11vh"
            resize="none"
          />
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <div className="flex w-[50%] justify-end">
            <Button
              style={{ width: '40%', marginRight: '.3vw' }}
              colorScheme="linkedin"
              isLoading={loading}
              onClick={() => {
                updateCategoryClick();
              }}
            >
              Simpan
            </Button>
            <Button
              style={{ width: '40%' }}
              onClick={() => {
                setEditCategoryButton(false);
                setNewCategory({
                  category: '',
                });
              }}
              variant="ghost"
            >
              Batal
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditCategoryModal;
