import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

function Index() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/admin/category/byId=1`);
  }, []);
  return <div></div>;
}

export default Index;
