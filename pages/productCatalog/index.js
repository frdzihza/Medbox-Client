import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/productCatalog/semuaObat=1');
  }, []);

  return <div></div>;
}

export default Index;
