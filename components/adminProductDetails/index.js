import React, { useEffect } from 'react';
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
} from '@chakra-ui/react';
import Image from 'next/image';
import axiosInstance from '../../src/config/api';
import { api_origin } from '../../constraint';

function AdminProductDetails({
  currentProduct,
  openProductDetails,
  setOpenProductDetails,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    productName,
    description,
    isPublic,
    category,
    packageType,
    productImage,
    productPrice,
    defaultQuantity,
    productStock,
    product_id,
    servingType,
    createdAt,
    updatedAt,
  } = currentProduct;

  useEffect(() => {
    if (openProductDetails) {
      onOpen();
    } else if (!openProductDetails) {
      onClose();
    }
  }, [openProductDetails]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setOpenProductDetails(false);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Produk: {productName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>Foto</p>
          <div className="w-[35%] my-[.1vh] hover:cursor-not-allowed">
            <label
              className="hover:cursor-not-allowed"
              htmlFor="productImageInput"
            >
              <Image
                unoptimized
                style={{ borderRadius: '.3vw' }}
                src={
                  productImage.includes(api_origin)
                    ? productImage
                    : api_origin + productImage
                }
                width={1}
                height={1}
                layout="responsive"
                loader={() => {
                  return productImage.includes(api_origin)
                    ? productImage
                    : api_origin + productImage;
                }}
              />
            </label>
          </div>
          Kategori
          <Input
            disabled
            backgroundColor="gray.300"
            value={category}
            size="lg"
            marginY=".1vh"
            placeholder="Kategori"
          />
          Harga
          <Input
            disabled
            backgroundColor="gray.300"
            value={productPrice}
            size="lg"
            marginY=".1vh"
            placeholder="Harga"
          />
          Kemasan
          <Input
            disabled
            backgroundColor="gray.300"
            value={packageType}
            size="lg"
            marginY=".1vh"
            placeholder="Kemasan"
          />
          Satuan Unit
          <Input
            disabled
            backgroundColor="gray.300"
            value={servingType}
            size="lg"
            marginY=".1vh"
            placeholder="Unit Satuan"
          />
          Default Quantity
          <Input
            disabled
            backgroundColor="gray.300"
            value={defaultQuantity}
            size="lg"
            marginY=".5vh"
            placeholder="Jumlah Per Kemasan"
          />
          Deskripsi
          <Textarea
            disabled
            backgroundColor="gray.300"
            value={description}
            placeholder="Description"
            size="lg"
            height="11vh"
            resize="none"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AdminProductDetails;
