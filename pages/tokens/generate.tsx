import axios, { AxiosResponse } from 'axios';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import GenerateForm from '../../components/GenerateForm';
import Header from '../../components/Header';
import Preview from '../../components/Preview';

interface GeneratePageProps {
  authenticatedAddress: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = await getToken({ req: context.req });
  const authenticatedAddress = token?.sub ?? null;

  return {
    props: {
      authenticatedAddress,
    },
  };
};

const Generate = ({ authenticatedAddress }: GeneratePageProps) => {
  const [image, setImage] = useState({ id: '', extension: '' });

  useEffect(() => {
    setImage({
      id: JSON.parse(localStorage.getItem('generation.current') || '{}').id,
      extension: JSON.parse(localStorage.getItem('generation.current') || '{}')
        .extension,
    });
  }, []);

  const generateNft = useMutation<
    AxiosResponse<any, any>,
    unknown,
    unknown,
    unknown
  >((newPokemon) => {
    return axios.post('/api/nfts', newPokemon);
  });

  return (
    <div>
      <Header />
      <div
        className={clsx([
          'tablet:flex-row',
          'tablet:items-start',
          'items-center',
          'justify-center',
          'tablet:px-6',
          'px-3',
          'gap-5',
          'text-2xl',
          'flex',
          'flex-col',
        ])}
      >
        <GenerateForm
          generateNft={generateNft}
          image={image}
          setImage={setImage}
          authenticatedAddress={authenticatedAddress}
        />
        <Preview
          isLoading={generateNft.isLoading}
          isIdle={generateNft.isIdle}
          data={generateNft.data}
          error={generateNft.error}
          image={image}
          setImage={setImage}
          isGenerating={generateNft.isLoading}
        />
      </div>
    </div>
  );
};

export default Generate;
