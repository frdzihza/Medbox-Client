import { Button, Input, useToast } from '@chakra-ui/react';
import axiosInstance from '../src/config/api';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const toast = useToast();

  function emailChangeHandler(event) {
    setEmail(event.target.value);
  }

  async function sendResetPasswordMail() {
    try {
      if (!email)
        return toast({
          title: 'Empty Field!',
          description: 'Please Fill',
          position: 'top',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });

      await axiosInstance.post(`/users/sendResetPasswordMail`, { email });

      toast({
        title: 'Success!',
        description: 'Success send reset password mail.',
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
  }

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center flex-col">
      <div className="w-[50vw] mb-[10vh] desktop:w-[20vw]">
        <Image
          src="/forgotPassword/Medbox-logo.svg"
          alt="medbox-logo"
          layout="responsive"
          width={136}
          height={32}
        />
      </div>
      <div className="w-[80%] desktop:w-[50%] py-[10vh] flex flex-col items-center justify-center bg-white shadow-[0px_20px_36px_1px_rgba(0,28,47,0.1)]">
        <p className="text-[1.6rem] desktop:text-[2rem] font-[500] w-[100%] flex justify-center">
          Forgot Password
        </p>
        <p>Please enter your email</p>
        <div
          id="mobile-input"
          className="bg-white w-[90%] desktop:hidden my-[3vh] rounded-[3vw]"
        >
          <Input
            size="md"
            variant="filled"
            placeholder="Your Email"
            onChange={emailChangeHandler}
          />
        </div>
        <div
          id="desktop-input"
          className="bg-white desktop:inline hidden w-[50%] my-[3vh] rounded-[3vw]"
        >
          <Input
            size="lg"
            variant="filled"
            placeholder="Your Email"
            onChange={emailChangeHandler}
          />
        </div>
        <div id="mobile-button" className="w-[50vw] desktop:hidden">
          <Button
            onClick={sendResetPasswordMail}
            style={{ width: '100%' }}
            colorScheme="linkedin"
            size="sm"
          >
            Submit
          </Button>
        </div>
        <div id="desktop-button" className="hidden desktop:inline w-[30%]">
          <Button
            onClick={sendResetPasswordMail}
            style={{ width: '100%' }}
            colorScheme="linkedin"
            size="lg"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
