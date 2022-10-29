import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  ModalCloseButton,
  Text,
  HStack,
  Flex,
  VStack,
  Box,
} from '@chakra-ui/react';
import axiosInstance from '../../src/config/api';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';

function AddFormulaModal({
  addFormulaButton,
  setAddFormulaButton,
  allProducts,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [quantity, setQuantity] = useState(0);
  const [option, setOption] = useState();
  const [id, setId] = useState();
  const [tempFormula, setTempFormula] = useState([]);
  const [deleted, setDeleted] = useState(0);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [amount, setAmount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    checkSameProduct();
    if (addFormulaButton) {
      onOpen();
    } else if (!addFormulaButton) {
      onClose();
    }
  }, [addFormulaButton, quantity, tempFormula, option]);

  const onHandleNameChange = (e) => {
    setName(e.target.value);
  };

  const onHandleOptionChange = (e) => {
    setOption(e.target.value);
  };

  const onHandleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };
  const onHandleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  function checkSameProduct() {
    tempFormula.forEach((product) => {
      if (option == product.productName) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    });
  }

  const onAddClick = () => {
    {
      setTempFormula([
        ...tempFormula,
        {
          productName: option,
          quantity,
        },
      ]),
        setQuantity(0),
        setOption('');
    }
  };

  async function onSaveClick() {
    try {
      setLoading(true);
      const body = { productName: name, formula: tempFormula, amount: amount };
      const res = await axiosInstance.post('/products/concoction', body);
      if (res) {
        toast({
          title: 'Concoction Created!',
          description: res.data.message,
          position: 'top',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        setAddFormulaButton(false);
        setTempFormula([]), setQuantity(0);
        setDeleted(0), setName(''), setAmount(0);
      }
    } catch (error) {
      toast({
        title: 'Create Concoction Failed!',
        description: error.response.data?.message
          ? error.response.data.message
          : error.message,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.log({ Error: error.response.data });
      setLoading(false);
      setAddFormulaButton(false);
      setTempFormula([]), setQuantity(0);
      setDeleted(0), setName(''), setAmount(0);
    }
  }

  function tempFormulaMap() {
    return tempFormula.map((tempForm, index) => {
      return (
        <>
          <HStack
            spacing={2}
            bg={'gray.100'}
            border="1px"
            borderColor="gray.100"
            my={1}
            mx={6}
            rounded={6}
          >
            <Text ml={10} mr={2} my={2} fontSize="md" fontWeight={'semibold'}>
              {tempForm.productName}
            </Text>
            <Text fontSize="s">x{tempForm.quantity}</Text>
            <Button
              variant={'ghost'}
              colorScheme={'red'}
              isLoading={loading}
              onClick={() => {
                let tempArray = tempFormula;
                tempArray.splice(index, 1);
                setTempFormula(tempArray);
                setDeleted(deleted + 1);
              }}
            >
              x
            </Button>
          </HStack>
        </>
      );
    });
  }

  function productNameMap() {
    return allProducts?.map((product) => {
      if (!product.formula) {
        return (
          <option key={product.product_id} value={`${product.productName}`}>
            {product.productName}
          </option>
        );
      }
    });
  }
  {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setAddFormulaButton(false), setTempFormula([]), setQuantity(0);
          setDeleted(0), setName(''), setAmount(0);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Obat Racikan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              mb={2}
              type={'text'}
              placeholder="Nama Obat"
              onChange={onHandleNameChange}
            ></Input>
            <HStack my={3}>
              <Text>Jumlah Racikan:</Text>
              {amount == 0 ? (
                <Button
                  colorScheme={'linkedin'}
                  variant={'ghost'}
                  isDisabled
                  onClick={() => {
                    setAmount(amount - 1);
                  }}
                >
                  -
                </Button>
              ) : (
                <Button
                  colorScheme={'linkedin'}
                  variant={'ghost'}
                  onClick={() => {
                    setAmount(amount - 1);
                  }}
                >
                  -
                </Button>
              )}

              <Input
                placeholder="Jumlah Racikan"
                type={'text'}
                width={'70px'}
                value={amount}
                onChange={onHandleAmountChange}
              ></Input>
              <Button
                colorScheme={'linkedin'}
                variant={'ghost'}
                onClick={() => {
                  setAmount(amount + 1);
                }}
              >
                +
              </Button>
            </HStack>
            <HStack>
              <Select
                name="productName"
                placeholder="Pilih Obat"
                onChange={onHandleOptionChange}
              >
                {productNameMap()}
              </Select>
              {quantity == 0 ? (
                <Button
                  colorScheme={'linkedin'}
                  variant={'ghost'}
                  isDisabled
                  onClick={() => {
                    setQuantity(quantity - 1);
                  }}
                >
                  -
                </Button>
              ) : (
                <Button
                  colorScheme={'linkedin'}
                  variant={'ghost'}
                  onClick={() => {
                    setQuantity(quantity - 1);
                  }}
                >
                  -
                </Button>
              )}

              <Input
                type={'text'}
                width={'70px'}
                value={quantity}
                onChange={onHandleQuantityChange}
              ></Input>
              <Button
                colorScheme={'linkedin'}
                variant={'ghost'}
                onClick={() => {
                  setQuantity(quantity + 1);
                }}
              >
                +
              </Button>
            </HStack>
          </ModalBody>

          <Box rounded={10} border="1px" borderColor="gray.100" py={2}>
            <VStack>
              {tempFormulaMap()}
              {tempFormula.length ? (
                <Button
                  height={'20px'}
                  width={'110px'}
                  variant={'ghost'}
                  fontSize={'small'}
                  fontWeight={'normal'}
                  colorScheme={'red'}
                  isLoading={loading}
                  onClick={() => {
                    setTempFormula([]);
                  }}
                >
                  Hapus Semua
                </Button>
              ) : (
                <></>
              )}
            </VStack>
          </Box>

          <ModalFooter>
            <Button
              variant="ghost"
              colorScheme="red"
              mr={3}
              onClick={() => {
                setAddFormulaButton(false), setTempFormula([]), setQuantity(0);
                setDeleted(0), setName(''), setAmount(0);
              }}
            >
              Batal
            </Button>
            {quantity == 0 || option == '' ? (
              <Button
                mr={2}
                isDisabled
                colorScheme="linkedin"
                variant="outline"
                onClick={() => {
                  setTempFormula([
                    ...tempFormula,
                    {
                      productName: option,
                      quantity,
                    },
                  ]);
                }}
              >
                Tambah
              </Button>
            ) : (
              <Button
                mr={2}
                colorScheme="linkedin"
                variant="outline"
                isDisabled={disabled}
                onClick={onAddClick}
              >
                Tambah
              </Button>
            )}
            {name && tempFormula.length && amount > 0 ? (
              <Button
                colorScheme="teal"
                variant="outline"
                isLoading={loading}
                onClick={onSaveClick}
              >
                Simpan
              </Button>
            ) : (
              <Button
                colorScheme="teal"
                variant="outline"
                isLoading={loading}
                isDisabled
                onClick={() => {}}
              >
                Simpan
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}
export default AddFormulaModal;
