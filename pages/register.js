import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axiosInstance from '../src/config/api';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  ChakraProvider,
  Link,
  Text,
  VStack,
  InputGroup,
  Spacer,
  InputRightElement,
  InputLeftAddon,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField } from '../components/textfield';
import '@fontsource/poppins';
import theme from '../components/theme';
import { useToast } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Register() {
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toast = useToast();

  const { data: session } = useSession();
  if (session) router.replace('/');

  const phoneRegExp =
    /^((\\+[0-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validate = Yup.object({
    fullName: Yup.string()
      .max(50, 'Must be 50 characters or less')
      .required('Full Name is Required')
      .matches(/^[A-Za-z ]*$/, 'Please enter valid name'),
    email: Yup.string().email('Email is invalid').required('Email is Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 charaters')
      .required('Password is Required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
        'Must Contain at least 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      ),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .max(15)
      .required('A phone number is required'),
    confirmPassword: Yup.string()
      .required('Confirm Password Required')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const onRegisterClick = async ({
    fullName,
    email,
    password,
    phoneNumber,
  }) => {
    try {
      const body = {
        name: fullName,
        email,
        password,
        phoneNumber,
      };
      const res = await axiosInstance.post('/users/register', body);
      toast({
        title: 'Account created.',
        description: res.data.message,
        position: 'top',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        router.replace('/login');
      }, 5000);

      // window.location.reload();
    } catch (error) {
      console.log({ error });
      if (error.response?.data) {
        toast({
          title: 'Error',
          description: error.response.data.message,
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Formik
        initialValues={{
          fullName: '',
          email: '',
          password: '',
          phoneNumber: '',
          confirmPassword: '',
        }}
        validationSchema={validate}
        onSubmit={(values) => {
          onRegisterClick({
            fullName: values.fullName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
          });
          setDisabled(true);
          setTimeout(() => {
            setDisabled(false);
          }, 3000);
        }}
      >
        {({ handleSubmit, errors, touched, values, setFieldValue }) => (
          <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
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
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
              <Stack spacing={4} w={'full'} maxW={'md'}>
                <Heading fontSize={'2xl'}>Sign up</Heading>
                <Field name="fullName">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      name="fullName"
                      type="text"
                    />
                  )}
                </Field>
                <Field name="email">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      name="email"
                      type="text"
                    />
                  )}
                </Field>
                <Field name="phoneNumber">
                  {({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      name="phoneNumber"
                      type="number"
                    />
                  )}
                </Field>
                <Field name="password">
                  {({ field }) => (
                    <InputGroup>
                      <TextField
                        {...field}
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        w={'23.5vw'}
                      />
                      <InputRightElement>
                        <Button
                          alignSelf={'center'}
                          variant={'ghost'}
                          mt={'120%'}
                          mr={'-10%'}
                          onClick={() =>
                            setShowPassword((showPassword) => !showPassword)
                          }
                        >
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  )}
                </Field>
                <br />
                <Field name="confirmPassword">
                  {({ field }) => (
                    <InputGroup>
                      <TextField
                        {...field}
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        w={'23.5vw'}
                      />
                      <InputRightElement>
                        <Button
                          alignSelf={'center'}
                          variant={'ghost'}
                          mt={'120%'}
                          mr={'-10%'}
                          onClick={() =>
                            setShowConfirmPassword(
                              (showConfirmPassword) => !showConfirmPassword,
                            )
                          }
                        >
                          {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  )}
                </Field>
                <Stack spacing={6}>
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}
                  ></Stack>
                  <Button
                    colorScheme={'blue'}
                    variant={'solid'}
                    type="submit"
                    disabled={disabled}
                    onClick={handleSubmit}
                  >
                    Sign up
                  </Button>
                </Stack>
                <VStack>
                  <Text>
                    Already Have an Account?{' '}
                    <Link color="linkedin.500" href="/login">
                      Click Here!
                    </Link>
                  </Text>
                </VStack>
              </Stack>
            </Flex>
          </Stack>
        )}
      </Formik>
    </ChakraProvider>
  );
}
