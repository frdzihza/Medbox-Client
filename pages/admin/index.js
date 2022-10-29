import { getSession, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

function Index() {
  return <div></div>;
}

export default Index;

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: '/login' } };

    if (!session.user.user.isAdmin) {
      return { redirect: { destination: '/' } };
    }

    return { redirect: { destination: 'admin/inventory' } };
  } catch (error) {
    console.log({ error });
    return { props: { error: error.message } };
  }
}
