import { Button } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col w-[100vw] h-[100vh] items-center justify-center relative">
      <div className="w-[100vw] -z-[1]">
        <Image
          width={1920}
          height={1080}
          src={'/others/back1.jpg'}
          layout="responsive"
          alt={'kocheng'}
        />
      </div>
      <div className="absolute top-[10vh] flex flex-col items-center text-white">
        <p className="text-[7rem] font-[600]">404</p>
        <p className="text-[3rem]">-whoops</p>
        <p className="text-[3rem]">it looks like you&apos;re lost</p>
        <Button
          fontSize={'2xl'}
          marginTop={20}
          onClick={() => {
            router.replace('/');
          }}
          variant={'link'}
          colorScheme="red"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
