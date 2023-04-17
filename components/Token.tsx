import clsx from 'clsx';
import Image from 'next/image';
import getConfig from 'next/config';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useQuery } from 'react-query';
import styles from '../styles/Token.module.scss';
import { useEffect, useRef, useState } from 'react';
import TransferModal from './TransferModal';
import LoadingToken from './LoadingToken';
import ListingModal from './ListingModal';
import { toast } from 'react-toastify';
import previewStyles from '../styles/Preview.module.scss';
import { ApolloQueryResult, gql, useApolloClient } from '@apollo/client';
import { BigNumber, ethers } from 'ethers';

interface TokenProps {
  queryRefetch: (
    variables?:
      | Partial<{
          owner: string;
          listed: boolean;
        }>
      | undefined
  ) => Promise<ApolloQueryResult<any>>;
  queriedToken: { id: string; owner: string };
}

const Token = ({ queriedToken, queryRefetch }: TokenProps) => {
  const { chain } = useNetwork();
  const { publicRuntimeConfig } = getConfig();
  const { address } = useAccount();
  const client = useApolloClient();
  const toastId = useRef(0);

  const [isTransferModalActive, setIsTransferModalActive] = useState(false);
  const [isListingModalActive, setIsListingModalActive] = useState(false);
  // If tx is being processed on token it should be disabled
  const [isTokenBusy, setIsTokenBusy] = useState(false);

  const [openingBid, setOpeningBid] = useState('');
  const [duration, setDuration] = useState('');
  const [minimumBidIncrement, setMinimumBidIncrement] = useState('');

  useEffect(() => {
    if (isListingModalActive || isTransferModalActive)
      document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'scroll';
  }, [isListingModalActive, isTransferModalActive]);

  const { data: tokenUri } = useContractRead({
    address:
      publicRuntimeConfig.networksToAddresses[chain?.id || 0]?.DiffusedNfts,
    abi: publicRuntimeConfig.networksToAddresses[chain?.id || 0]
      ?.DiffusedNftsAbi,
    functionName: 'tokenURI',
    args: [queriedToken.id],
    onError() {
      console.log('error with token', queriedToken.id);
    },
  });

  const {
    isLoading: isTokenDataLoading,
    isError: isTokenDataError,
    isIdle: isTokenDataIdle,
    data: tokenData,
  } = useQuery(
    ['tokenData', queriedToken.id],
    async () => {
      const res = await fetch(
        (tokenUri as string).replace(
          'ipfs://',
          publicRuntimeConfig?.ipfsHttpsPrefix
        )
      );

      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
    {
      enabled: !!tokenUri,
      refetchOnWindowFocus: false,
      onSuccess(data) {
        const id = client.cache.identify(queriedToken);
        client.writeQuery({
          query: gql`
            query WriteToken($id: Int!) {
              token(id: $id) {
                name @client
              }
            }
          `,
          data: {
            token: {
              name: data?.name ? data.name : '',
            },
          },
          variables: {
            id: queriedToken.id,
          },
          broadcast: true,
        });
      },
    }
  );

  const { write: writeTransfer, data: dataTransfer } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address:
      publicRuntimeConfig.networksToAddresses[chain?.id || 0]?.DiffusedNfts,
    abi: publicRuntimeConfig.networksToAddresses[chain?.id || 0]
      ?.DiffusedNftsAbi,
    functionName: 'safeTransferFrom(address,address,uint256)',
    onError: (err: any) => {
      setIsTokenBusy(false);

      toast.update(toastId.current, {
        render: err.message.includes('user rejected')
          ? 'User rejected transaction! ✍️'
          : err.reason || 'Error occured!',
        type: 'error',
        autoClose: 5000,
        isLoading: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    },
  });

  useWaitForTransaction({
    hash: dataTransfer?.hash,
    confirmations: 1,
    onSuccess() {
      toast.update(toastId.current, {
        render: 'Transferred! 🤝',
        isLoading: false,
        type: 'success',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });

      setTimeout(() => {
        queryRefetch();
      }, 4_000);
    },
  });

  const { write: writeList, data: dataList } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address:
      publicRuntimeConfig.networksToAddresses[chain?.id || 0]
        ?.DiffusedMarketplace,
    abi: publicRuntimeConfig.networksToAddresses[chain?.id || 0]
      ?.DiffusedMarketplaceAbi,
    functionName: 'listToken(uint256,uint256,uint256,uint256)',
    onError(err: any) {
      setIsTokenBusy(false);

      toast.update(toastId.current, {
        render: err.message.includes('user rejected')
          ? 'User rejected transaction! ✍️'
          : err.reason || 'Error occured!',
        type: 'error',
        autoClose: 5000,
        isLoading: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    },
  });

  useWaitForTransaction({
    hash: dataList?.hash,
    confirmations: 1,
    onSuccess() {
      toast.update(toastId.current, {
        render: 'Listed! 🙌',
        isLoading: false,
        type: 'success',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });

      setTimeout(() => {
        queryRefetch();
      }, 4_000);
    },
  });

  const { config: configApprove } = usePrepareContractWrite({
    address:
      publicRuntimeConfig.networksToAddresses[chain?.id || 0]?.DiffusedNfts,
    abi: publicRuntimeConfig.networksToAddresses[chain?.id || 0]
      ?.DiffusedNftsAbi,
    functionName: 'approve',
    args: [
      publicRuntimeConfig.networksToAddresses[chain?.id || 0]
        ?.DiffusedMarketplace,
      queriedToken.id,
    ],
  });

  const { write: writeApprove, data: dataApprove } = useContractWrite({
    ...(configApprove as any),
    onError: (err: any) => {
      setIsTokenBusy(false);

      toast.update(toastId.current, {
        render: err.message.includes('user rejected')
          ? 'User rejected transaction! ✍️'
          : err.reason || 'Error occured!',
        type: 'error',
        autoClose: 5000,
        isLoading: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    },
  });

  useWaitForTransaction({
    hash: dataApprove?.hash,
    confirmations: 1,
    onSuccess() {
      toast.update(toastId.current, {
        render: 'Approved! 👏',
        isLoading: false,
        type: 'success',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      toastId.current = toast.loading('Listing! 📝', {
        theme: 'dark',
        closeOnClick: true,
        draggable: true,
      }) as number;

      writeList?.({
        recklesslySetUnpreparedArgs: [
          queriedToken.id,
          ethers.utils.parseUnits(openingBid, 'ether'),
          duration,
          minimumBidIncrement,
        ],
      });
    },
  });

  if (isTokenDataLoading || isTokenDataIdle) {
    return <LoadingToken />;
  }

  if (isTokenDataError) {
    return <p>Error!</p>;
  }

  return (
    <div>
      <div
        className={clsx([
          'py-3',
          isTokenBusy && 'opacity-50 pointer-events-none',
          'rounded-2xl',
          styles.cardShadow,
        ])}
      >
        <div
          className={clsx([
            'rounded-lg',
            'mx-auto',
            'relative',
            'overflow-clip',
            'mb-2',
            previewStyles['image-square'],
            'w-[full]',
            'token-buttons',
          ])}
        >
          <Image
            src={tokenData.image.replace(
              'ipfs://',
              publicRuntimeConfig.ipfsHttpsPrefix
            )}
            layout="fill"
            className={clsx([styles.scaled])}
          />
          <div id="tokenSellingBtn" className={clsx(['hidden'])}>
            <div
              className={clsx([
                styles['bg-gradient'],
                'absolute',
                'left-0',
                'right-0',
                'top-0',
                'bottom-0',
              ])}
            ></div>
            <div
              className={clsx([
                'absolute',
                'bottom-0',
                'p-2',
                'pointer',
                'flex',
                'items-center',
                'justify-between',
                'gap-3',
                'w-full',
              ])}
            >
              <button
                type="button"
                onClick={() => {
                  if (!isListingModalActive) setIsListingModalActive(true);
                }}
                className={clsx([
                  'bg-white',
                  'py-2',
                  'font-semibold',
                  'text-xs',
                  'rounded-lg',
                  'transition',
                  'ease-in',
                  'w-full',
                  'text-[#121212]',
                  'hover:bg-[#5A5FFA]',
                  'hover:text-white',
                  'active:bg-[#282DC8]',
                  'active:text-white',
                ])}
              >
                Sell
              </button>
              <button
                className={clsx([
                  'p-[7px]',
                  styles['transfer-button'],
                  'border',
                  'border-white',
                  'rounded-lg',
                ])}
                onClick={() => {
                  if (!isTransferModalActive) setIsTransferModalActive(true);
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M14.9167 6V12.4583C14.9167 14.8802 14.1094 15.6875 11.6875 15.6875H5.22917C2.80729 15.6875 2 14.8802 2 12.4583V6H14.9167Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M16.1693 4.46358V5.27087C16.1693 6.15889 15.7414 6.88546 14.5547 6.88546H2.44533C1.21018 6.88546 0.83075 6.15889 0.83075 5.27087V4.46358C0.83075 3.57556 1.21018 2.849 2.44533 2.849H14.5547C15.7414 2.849 16.1693 3.57556 16.1693 4.46358Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M16.1693 4.46358V5.27087C16.1693 6.15889 15.7414 6.88546 14.5547 6.88546H2.44533C1.21018 6.88546 0.83075 6.15889 0.83075 5.27087V4.46358C0.83075 3.57556 1.21018 2.849 2.44533 2.849H14.5547C15.7414 2.849 16.1693 3.57556 16.1693 4.46358Z"
                    fill="#ffffff"
                  />
                  <path
                    opacity="0.4"
                    d="M8.20939 2.84899H3.75314C3.47866 2.5503 3.48673 2.09014 3.77736 1.79952L4.92371 0.653162C5.22241 0.354464 5.71486 0.354464 6.01356 0.653162L8.20939 2.84899Z"
                    fill="#ffffff"
                  />
                  <path
                    opacity="0.4"
                    d="M13.2388 2.84899H8.78259L10.9784 0.653162C11.2771 0.354464 11.7696 0.354464 12.0683 0.653162L13.2146 1.79952C13.5052 2.09014 13.5133 2.5503 13.2388 2.84899Z"
                    fill="#ffffff"
                  />
                  <path
                    opacity="0.6"
                    d="M6 6V10.1495C6 10.7953 6.71042 11.1747 7.2513 10.8276L8.01016 10.3271C8.28464 10.1495 8.63177 10.1495 8.89818 10.3271L9.61667 10.8115C10.1495 11.1667 10.868 10.7872 10.868 10.1414V6H6Z"
                    fill="#ffffff"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={clsx(['px-3', 'flex', 'items-baseline	', 'gap-x-1.5'])}>
          <p className={clsx(['font-medium', 'text-base'])}>
            {tokenData.name
              .slice(0, 14)
              .concat(tokenData.name.length > 15 ? '...' : '')}
          </p>
          <p className={clsx(['text-xs', 'text-[#C5C5C5]'])}>
            #{queriedToken.id}
          </p>
        </div>

        {isListingModalActive && (
          <ListingModal
            tokenId={queriedToken.id}
            writeApprove={writeApprove}
            toastId={toastId}
            tokenData={tokenData}
            setIsListingActive={setIsListingModalActive}
            address={address}
            setIsTokenBusy={setIsTokenBusy}
            setDuration={setDuration}
            setMinimumBidIncrement={setMinimumBidIncrement}
            setOpeningBid={setOpeningBid}
            openingBid={openingBid}
            duration={duration}
            minimunBidIncrement={minimumBidIncrement}
          />
        )}
        {isTransferModalActive && (
          <TransferModal
            tokenId={queriedToken.id}
            writeTransfer={writeTransfer}
            toastId={toastId}
            tokenData={tokenData}
            setIsTransferModalActive={setIsTransferModalActive}
            address={address}
            setIsTokenBusy={setIsTokenBusy}
          />
        )}
      </div>
    </div>
  );
};

export default Token;
