import React from 'react';
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Link,
  InputGroup,
  InputRightElement,
  Image,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Icon, ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { redirect } from 'next/dist/server/api-utils';
import axiosInstance from '../../client/src/config/api';

function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [login, setLogin] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function getSessionAsync() {
    const session = await getSession();

    if (session?.user.user.isAdmin) {
      router.replace('/admin');
    } else if (session) {
      router.replace('/');
    }
  }

  useEffect(() => {
    getSessionAsync();
  }, [isLogin]);

  function PasswordInput() {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
      <InputGroup size="lg">
        <Input
          pr="4.5rem"
          type={show ? 'text' : 'password'}
          placeholder="Enter password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          variant={'filled'}
          mb={6}
        />
        <InputRightElement>
          <Button rounded="10%" size="lg" onClick={handleClick}>
            {show ? (
              <ViewOffIcon onClick={handleClick} />
            ) : (
              <ViewIcon onClick={handleClick} />
            )}
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  }

  const onLoginClick = async () => {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!res.error) {
      getSessionAsync();
    } else {
      console.log({ Error: res.error });
      toast({
        title: 'Error!',
        description: res.error,
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      height="100vh"
      // alignItems="center"
      justifyContent="center"
      direction="row"
    >
      <Flex
        flex={1}
        background={
          'linear-gradient(153.41deg, #008DEB 0.81%, rgba(0, 141, 235, 0.56) 49.89%, rgba(0, 141, 235, 0.28) 95.87%);'
        }
        boxShadow={'2xl'}
      >
        <div className="w-[100%] flex items-center justify-center">
          <Image
            alt={'Register Image'}
            objectFit="contain"
            src={'login/orang.svg'}
            zIndex={'popover'}
          />
          <Image
            className="absolute"
            alt={'Register Image'}
            objectFit="contain"
            src={'login/Buletan.svg'}
          />
        </div>
      </Flex>
      <Flex
        className="shadow-[0px_20px_36px_1px_rgba(0,28,47,1)"
        alignItems="center"
        justifyContent="center"
        direction="column"
        background="white"
        width="50%"
        p={12}
        rounded={6}
      >
        <Link className="w-[60%]" href="/">
          <Image
            alt={'Register Image'}
            objectFit={'cover'}
            marginBottom="13vh"
            width="100%"
            src={'forgotPassword/Medbox-logo.svg'}
            zIndex={'popover'}
          />
        </Link>
        <p className="mb-6 font-[400] text-[3rem]">Login to Medbox</p>
        <Input
          type="text"
          value={email}
          size="lg"
          placeholder="your@mail.com"
          variant="filled"
          mb={3}
          onChange={(event) => setEmail(event.target.value)}
        />
        {PasswordInput()}

        <Button
          colorScheme="linkedin"
          size="lg"
          width={'100px'}
          onClick={onLoginClick}
        >
          Login
        </Button>
        <Text mt={5}>
          Haven&apos;t registered? {''}
          <Link color="linkedin.500" href="/register">
            Register here!
          </Link>
        </Text>
        <Text mt={5}>
          Forgot Password?{' '}
          <Link color="linkedin.500" href="/forgotPassword">
            Click Here!
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}

export default Login;

export async function getServerSideProps() {
  try {
    const session = await getSession();

    if (session?.user.user.isAdmin) {
      return { redirect: { destination: '/admin' } };
    } else if (session) {
      return { redirect: { destination: '/' } };
    }

    return { props: {} };
  } catch (error) {
    console.log({ error });
    return { props: { error: error.message } };
  }
}
