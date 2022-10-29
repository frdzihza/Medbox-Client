import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import axiosInstance from '../../../src/config/api';

function Index() {
  const router = useRouter();

  return <div></div>;
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: '/login' } };

    if (!session.user.user.isAdmin) {
      return { redirect: { destination: '/' } };
    }
    return { redirect: { destination: '/admin/inventory/byId=1' } };
  } catch (error) {
    console.log({ error });
    return { props: { error: error.message } };
  }
}

export default Index;
