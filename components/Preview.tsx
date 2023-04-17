import clsx from 'clsx';
import styles from '../styles/Preview.module.scss';
import { useQuery } from 'react-query';
import EntryData from './EntryData';
import PreviewImage from './PreviewImage';
import { useEffect } from 'react';
import MintButton from './MintButton';
import { useAccount, useNetwork } from 'wagmi';
import { useSession } from 'next-auth/react';
import getConfig from 'next/config';

interface PreviewProps {
  isLoading: boolean;
  isIdle: boolean;
  data: any;
  error: Error | unknown;
  image: { id: string; extension: string };
  setImage: any;
  isGenerating: boolean;
}

const Preview = ({
  isGenerating,
  isLoading,
  error,
  image,
  setImage,
}: PreviewProps) => {
  const {
    isLoading: isJsonLoading,
    error: jsonLoadingError,
    refetch,
    data: jsonData,
  } = useQuery(
    'metadata',
    async () => {
      const res = await fetch('/generated/jsons/' + image.id + '.json');

      if (res.status == 404) {
        throw new Error('Image is not found, try to generate new one!');
      }

      return res.json();
    },
    { enabled: !!image.id && !!image.extension }
  );

  const { chain } = useNetwork();
  const { status } = useSession();
  const { address } = useAccount();
  const { publicRuntimeConfig } = getConfig();

  useEffect(() => {
    if (image.id && image.extension) {
      refetch();
    }
  }, [image]);

  if (error) {
    console.error(error);
    return (
      <p className={clsx(['basis-1/2'])}>
        error took place: <span>{(error as Error).message}</span>
      </p>
    );
  }

  return (
    <div
      className={clsx([
        'basis-2/3',
        'w-full',
        'tablet:px-8',
        'px-6',
        'py-7',
        'bg-[#18151b]',
        'rounded-2xl',
      ])}
    >
      <h1 className={clsx(['font-semibold', 'text-2xl', 'mb-7'])}>Output</h1>

      <div className={clsx(['flex', 'flex-col', 'gap-5', 'wider:flex-row'])}>
        <div className={clsx(['basis-[48.229%]', 'flex', 'flex-col', 'gap-5'])}>
          <div
            className={clsx([
              'bg-[#1f1826]',
              styles['image-square'],
              'flex',
              'relative',
              'rounded-lg',
              'items-center',
              'overflow-clip',
              'p-10',
              'justify-center',
              'min-w-263',
            ])}
          >
            <PreviewImage
              isLoading={isLoading}
              isJsonLoading={isJsonLoading}
              error={error}
              jsonLoadingError={jsonLoadingError}
              jsonData={jsonData}
              image={image}
            />
          </div>

          {publicRuntimeConfig.networksToAddresses[chain?.id || 0]
            ?.DiffusedNfts &&
            image.id &&
            !isGenerating &&
            image.extension &&
            address &&
            status == 'authenticated' &&
            jsonData && (
              <MintButton
                image={image}
                chainId={chain?.id || 0}
                setImage={setImage}
              />
            )}
        </div>

        <div className={clsx(['basis-[49.486%]'])}>
          <p className={clsx(['text-lg', 'font-medium', 'mb-2'])}>Entry data</p>
          <div
            className={clsx([
              'w-full',
              'h-[1px]',
              'bg-white',
              'bg-opacity-10',
              'mb-[0.6875rem]',
            ])}
          ></div>
          <EntryData
            isLoading={isLoading}
            isJsonLoading={isJsonLoading}
            error={error}
            jsonLoadingError={jsonLoadingError}
            jsonData={jsonData}
            image={image}
          />
        </div>
      </div>
    </div>
  );
};

export default Preview;
