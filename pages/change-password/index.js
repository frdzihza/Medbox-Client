import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Link,
  InputGroup,
  InputRightElement,
  ChakraProvider,
  Image,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Icon, ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import axiosInstance from '../../src/config/api';
import { TextField } from '../../components/textfield';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import theme from '../../components/theme';
import '@fontsource/poppins';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

function ChangePassword(props) {
  const validate = Yup.object({
    oldPassword: Yup.string().required('Please fill this field'),
    password: Yup.string().required('Please fill this field'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password must match')
      .required('Please fill this field'),
  });

  const router = useRouter();
  const toast = useToast();

  const onHandleSubmit = async ({ oldPassword, password }) => {
    try {
      const body = {
        oldPassword,
        password,
      };

      const session = await getSession();

      const { user_token } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${user_token}` },
      };

      const resUpdatePassword = await axiosInstance.patch(
        '/users/changepassword',
        body,
        config,
      );
      toast({
        title: 'Success!',
        description: 'Password updated',
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.replace('/');
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
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          direction="column"
          background="white"
          className="shadow-[0px_6px_20px_0px_rgba(0,28,47,0.1)]"
          p={12}
          rounded={6}
        >
          <Link className="w-[80%] h-[9vh]" href="/">
            <Image
              alt={'Register Image'}
              objectFit={'cover'}
              marginBottom="20vh"
              width="100%"
              src={'forgotPassword/Medbox-logo.svg'}
            />
          </Link>
          <Formik
            initialValues={{
              oldPassword: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={validate}
            onSubmit={async (values) => {
              onHandleSubmit({
                oldPassword: values.oldPassword,
                password: values.password,
              });
            }}
          >
            {({ handleSubmit, errors, touched, values, setFieldValue }) => (
              <div>
                <div className="font-[500] text-[1.8rem] w-[100%] flex justify-center">
                  Change Password
                </div>
                <Field name="oldPassword">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Old Password"
                      name="oldPassword"
                      type="password"
                    />
                  )}
                </Field>
                <Field name="password">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="New Password"
                      name="password"
                      type="password"
                    />
                  )}
                </Field>
                <Field name="confirmPassword">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                    />
                  )}
                </Field>

                <div className="w-[100%] justify-evenly flex">
                  <Button
                    onClick={handleSubmit}
                    colorScheme="linkedin"
                    mx="5"
                    my="1vh"
                    size="lg"
                    width={'100px'}
                    type="submit"
                  >
                    Submit
                  </Button>
                  <Button
                    colorScheme="linkedin"
                    mx="5"
                    my="1vh"
                    size="lg"
                    width={'100px'}
                    type="reset"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </Formik>
          <Text mt={5}>
            Back to{' '}
            <Link color="linkedin.500" href="/">
              Home!
            </Link>
          </Text>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: '/login' } };

    const { user_token } = session.user;

    const config = {
      headers: { Authorization: `Bearer ${user_token}` },
    };

    const user_id = session.user.user.user_id;

    const res = await axiosInstance.get(`/users/${user_id}`, config);

    return {
      props: { user: res.data.data, session },
    };
  } catch (error) {
    console.log({ error });
    return { props: { error } };
  }
}

export default ChangePassword;
