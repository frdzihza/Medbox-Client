import React from 'react';

function IndexLaporan() {
  return <div></div>;
}

export default IndexLaporan;

export async function getServerSideProps() {
  try {
    return { redirect: { destination: '/admin/laporan/product' } };
  } catch (error) {
    console.log({ error });
    return { props: { error } };
  }
}
