import React from 'react';
import { getSession, useSession } from 'next-auth/react';

function IndexTransac(props) {
  return <div>index</div>;
}

export default IndexTransac;

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: '/login' } };

    return { props: { session } };
  } catch (error) {
    return { props: { Error: error.message } };
  }
}
