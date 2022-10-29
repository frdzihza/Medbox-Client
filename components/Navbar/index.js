import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  useToast,
  Button,
  Flex,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverArrow,
} from '@chakra-ui/react';
import axiosInstance from '../../src/config/api';
import Link from 'next/link';
import { getSession, signOut } from 'next-auth/react';

function Navbar(props) {
  const [session, setSession] = useState(props.session);
  const [userId, setUserId] = useState('');

  const initialFocusRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    getSessionAsync();
  }, []);

  const resendVerificationHandler = async () => {
    const body = {
      email: session.user.user.email,
      user_id: session.user.user.user_id,
    };
    const res = await axiosInstance.post('/users/resendVerif', body);
    toast({
      description: res.data.message,
      position: 'top',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  async function getSessionAsync() {
    const session = await getSession();

    if (session) {
      const { user_id } = session.user.user;
      setUserId(user_id);
    }

    setSession(session);

    async function onLogoutClick() {
      try {
        signOut();
      } catch (error) {
        console.log({ error });
      }
    }
  }

  return (
    <div className="h-[100px] flex items-end desktop:h-[72px] shadow-[0px_6px_20px_0px_rgba(0,28,47,0.05)]">
      <div className="flex w-[100%] h-[70px] desktop:h-[100%] items-center justify-between">
        <div className="flex ml-[7vw] h-[70%] items-center">
          <Link href="/">
            <div className="w-[20vh]">
              <Image
                className="hover:cursor-pointer"
                src="/landingpage/Medbox.svg"
                alt="medbox-logo"
                layout="responsive"
                width={20}
                height={10}
              />
            </div>
          </Link>
          <div className="desktop:flex ml-[5vw] justify-between w-[20vw] hidden">
            <Link href="/">
              <p className="duration-300 ease-in-out bg-white text-[1vw] font-[500] hover:cursor-pointer hover:shadow-[0px_5px_0px_-2px_rgba(0,141,235,1)]">
                Beranda
              </p>
            </Link>
            <Link href="/productCatalog">
              <p className="duration-300 ease-in-out bg-white text-[1vw] font-[500] hover:cursor-pointer hover:shadow-[0px_5px_0px_-2px_rgba(0,141,235,1)]">
                Toko Obat
              </p>
            </Link>
            <Link href={`/transaction/${userId}`}>
              <p className="duration-300 ease-in-out bg-white text-[1vw] font-[500] hover:cursor-pointer hover:shadow-[0px_5px_0px_-2px_rgba(0,141,235,1)]">
                Riwayat
              </p>
            </Link>
          </div>
        </div>
        <div className="grow" />
        <div className="flex mr-[8vw] h-[70%] items-center justify-end w-[20vw]">
          {!session?.user.user.isVerified && session ? (
            <Popover
              initialFocusRef={initialFocusRef}
              placement="bottom"
              closeOnBlur={false}
            >
              <PopoverTrigger>
                <Button color={'red.400'} variant={'ghost'}>
                  Unverified Account
                </Button>
              </PopoverTrigger>
              <PopoverContent w={'11vw'} h={'7.5vh'}>
                <PopoverArrow />
                <PopoverHeader
                  pt={4}
                  fontWeight="bold"
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  border="0"
                >
                  <Button
                    colorScheme={'linkedin'}
                    variant={'solid'}
                    onClick={resendVerificationHandler}
                  >
                    Resend Verification
                  </Button>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ) : (
            ''
          )}
          {session && session.user.user.isVerified ? (
            <div className="w-[3.5vw] desktop:w-[1.2vw] hover:cursor-pointer  ml-[4.5vw] desktop:ml-[2vw]">
              <Link href={`/cart/${userId}`}>
                <Image
                  src="/landingpage/Cart.svg"
                  alt="cart-logo"
                  layout="responsive"
                  width={19.2}
                  height={20.4}
                />
              </Link>
            </div>
          ) : (
            ''
          )}
          {session && session.user.user.isVerified ? (
            <div className="hidden desktop:inline w-[3.5vw] desktop:w-[1.2vw] hover:cursor-pointer ml-[4.5vw] desktop:ml-[2vw]">
              <Link href="/profile">
                <Image
                  src="/landingpage/Account.svg"
                  alt="menu-logo"
                  layout="responsive"
                  width={20}
                  height={20}
                />
              </Link>
            </div>
          ) : (
            ''
          )}
        </div>
        {session ? (
          <div className="hidden desktop:flex desktop:ml-[-5vw]">
            <Button
              onClick={() => {
                signOut();
              }}
              variant="outline"
              colorScheme="linkedin"
              sx={{
                width: '6vw',
                height: '5vh',
                borderRadius: '1.2vh',
                marginRight: '2vw',
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="hidden desktop:flex desktop:ml-[-8vw]">
            <Link href="/login">
              <Button
                variant="outline"
                colorScheme="linkedin"
                sx={{
                  width: '6vw',
                  height: '5vh',
                  borderRadius: '1.2vh',
                  marginRight: '2vw',
                }}
              >
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    return { props: { session } };
  } catch (error) {
    console.log({ error });
    return { props: { error } };
  }
}

export default Navbar;
