import {
  ApolloQueryResult,
  gql,
  useApolloClient,
  useQuery as useApolloQuery,
} from '@apollo/client';
import { useQuery as useReactQuery } from 'react-query';
import clsx from 'clsx';
import getConfig from 'next/config';
import previewStyles from '../styles/Preview.module.scss';
import tokenStyles from '../styles/Token.module.scss';
import Image from 'next/image';
import {
  useBlockNumber,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import LoadingToken from './LoadingToken';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import BidsModal from './BidsModal';

interface ListedTokenProps {
  owner: string;
  queriedToken: { id: string; owner: string };
  queryRefetch: (
    variables?:
      | Partial<{
          owner: string;
          listed: boolean;
        }>
      | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

enum auctionStatus {
  lastBlock,
  Active,
  Closed,
  Loading,
}

const ListedToken = ({ queriedToken, queryRefetch }: ListedTokenProps) => {
  const { chain } = useNetwork();
  const { publicRuntimeConfig } = getConfig();
  const client = useApolloClient();
  const [isTokenBusy, setIsTokenBusy] = useState(false);
  const [isBidsActive, setIsActiveBids] = useState(false);
  const [blocksAhead, setBlocksAhead] = useState({
    number: '0',
    status: auctionStatus.lastBlock,
  });
  const toastId = useRef(0);

  const { config: claimConfig } = usePrepareContractWrite({
    address:
      publicRuntimeConfig.networksToAddresses[chain?.id || 0]
        .DiffusedMarketplace,
    abi: publicRuntimeConfig.networksToAddresses[chain?.id || 0]
      .DiffusedMarketplaceAbi,
    functionName: 'callEndDate',
    args: [queriedToken.id],
  });
  const { data: claimData, write: writeClaim } = useContractWrite({
    ...claimConfig,
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
  } as any);

  useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess() {
      toast.update(toastId.current, {
        render: 'Claimed! 🤙',
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
      }, 3000);
    },
  });

  const { data: tokenUri } = useContractRead({
    address:
      publicRuntimeConfig.networksToAddresses[chain?.id || 0]?.DiffusedNfts,
    abi: publicRuntimeConfig.networksToAddresses[chain?.id || 0]
      ?.DiffusedNftsAbi,
    functionName: 'tokenURI',
    args: [queriedToken.id],
  });

  const {
    loading: listingLoading,
    error: listingError,
    data: listingData,
    refetch: refetchListingQuery,
  } = useApolloQuery(gql(publicRuntimeConfig.getTokenListing), {
    variables: { tokenId: queriedToken.id },
    refetchWritePolicy: 'overwrite',
  });

  const { data: blocksNumberData, isLoading: isBlockNumberLoading } =
    useBlockNumber({
      watch: true,
    });

  useEffect(() => {
    if (!listingData || !blocksNumberData) {
      setBlocksAhead({
        number: '0',
        status: auctionStatus.Loading,
      });

      return;
    }

    const blocksAhead = BigNumber.from(listingData.listings[0].endDate).sub(
      blocksNumberData || 0
    );

    if (blocksAhead.gt(0)) {
      setBlocksAhead({
        number: blocksAhead.toString(),
        status: auctionStatus.Active,
      });
    } else if (blocksAhead.eq(0)) {
      setBlocksAhead({
        number: blocksAhead.toString(),
        status: auctionStatus.lastBlock,
      });
    } else {
      setBlocksAhead({
        number: blocksAhead.toString(),
        status: auctionStatus.Closed,
      });
    }
  }, [blocksNumberData, listingData]);

  const {
    isLoading: isTokenDataLoading,
    isError: isTokenDataError,
    isIdle: isTokenDataIdle,
    data: tokenData,
  } = useReactQuery(
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

  if (
    isTokenDataLoading ||
    isTokenDataIdle ||
    listingLoading ||
    isBlockNumberLoading
  ) {
    return <LoadingToken />;
  }

  if (isTokenDataError || listingError) {
    return <p>Error!</p>;
  }

  return (
    <div
      className={clsx([
        'listed-token',
        isTokenBusy && 'opacity-50 pointer-events-none',
        'py-3',
        'px-2',
        'border',
        'border-[#292929]',
        'rounded-2xl',
      ])}
    >
      <div className={clsx(['relative'])}>
        <div>
          <div
            className={clsx([
              'listed-token-remainder-blocks',
              'bg-[#374151]',
              'px-[0.625rem]',
              'hover:cursor-default',
              'z-[10]',
              'py-1',
              'border',
              'border-[#31C48D]',
              'text-xs',
              'font-medium',
              'absolute',
              'top-2',
              'flex',
              'gap-[0.375rem]',
              'items-center',
              'right-2',
              'rounded-md',
              'text-[#31C48D]',
              blocksAhead.status == auctionStatus.Loading &&
                'pointer-events-none',
            ])}
          >
            <div
              className={clsx([
                'listed-token-time-section',
                'p-3',
                'hidden',
                'absolute',
                'min-w-max',
                'top-0',
                'bg-[#1F2A37]',
                'border',
                'z-[1000]',
                'rounded-md',
                'border-[#4B5563]',
              ])}
            >
              <div
                className={clsx([
                  'w-3',
                  'h-3',
                  'pointer-events-none',
                  'border-b',
                  'border-r',
                  'bg-[#1F2A37]',
                  'rotate-45',
                  'border-[#4B5563]',
                  'absolute',
                  'translate-y-1/2',
                  'left-1/2',
                  '-translate-x-1/2',
                  'bottom-0',
                ])}
              ></div>
              <p
                className={clsx([
                  'mb-1',
                  'font-semibold',
                  'text-sm',
                  'text-white',
                ])}
              >
                {(() => {
                  if (blocksAhead.status == auctionStatus.Active) {
                    return 'Auction ends in';
                  }

                  if (blocksAhead.status == auctionStatus.lastBlock) {
                    return 'The last block!';
                  }

                  return 'Auction ended';
                })()}
              </p>
              <p
                className={clsx(['text-[#C5C5C5]', 'text-sm', 'mb-[0.375rem]'])}
              >
                {(() => {
                  if (blocksAhead.status == auctionStatus.Active) {
                    return blocksAhead.number + ' blocks';
                  }

                  if (blocksAhead.status == auctionStatus.lastBlock) {
                    return 'After this block auction gets closed.';
                  }

                  return 'Claim the token.';
                })()}
              </p>

              {blocksAhead.status === auctionStatus.Active && (
                <div
                  className={clsx([
                    'h-[0.375rem]',
                    'w-full',
                    'bg-[#4B5563]',
                    'rounded-sm',
                  ])}
                >
                  <div
                    className={clsx(['h-full', 'rounded-sm', 'bg-[#66BB6A]'])}
                    style={{
                      width:
                        (
                          (Number(blocksAhead.number) /
                            (listingData.listings[0].endDate -
                              listingData.listings[0].listedAt)) *
                          100
                        ).toString() + '%',
                    }}
                  ></div>
                </div>
              )}
            </div>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 11.5999C7.48521 11.5999 8.9096 11.0099 9.9598 9.9597C11.01 8.9095 11.6 7.48512 11.6 5.9999C11.6 4.51469 11.01 3.09031 9.9598 2.0401C8.9096 0.989901 7.48521 0.399902 6 0.399902C4.51479 0.399902 3.09041 0.989901 2.0402 2.0401C0.99 3.09031 0.400002 4.51469 0.400002 5.9999C0.400002 7.48512 0.99 8.9095 2.0402 9.9597C3.09041 11.0099 4.51479 11.5999 6 11.5999ZM6.7 3.1999C6.7 3.01425 6.62625 2.8362 6.49498 2.70493C6.3637 2.57365 6.18565 2.4999 6 2.4999C5.81435 2.4999 5.6363 2.57365 5.50503 2.70493C5.37375 2.8362 5.3 3.01425 5.3 3.1999V5.9999C5.30004 6.18554 5.37382 6.36356 5.5051 6.4948L7.4847 8.4751C7.54974 8.54014 7.62695 8.59173 7.71192 8.62693C7.7969 8.66213 7.88798 8.68024 7.97995 8.68024C8.07193 8.68024 8.163 8.66213 8.24798 8.62693C8.33295 8.59173 8.41016 8.54014 8.4752 8.4751C8.54024 8.41007 8.59183 8.33286 8.62703 8.24788C8.66223 8.16291 8.68034 8.07183 8.68034 7.97985C8.68034 7.88788 8.66223 7.7968 8.62703 7.71183C8.59183 7.62685 8.54024 7.54964 8.4752 7.4846L6.7 5.7101V3.1999Z"
                fill="#31C48D"
              />
            </svg>

            <p>
              {(() => {
                if (blocksAhead.status == auctionStatus.Loading) {
                  return '...';
                }

                if (blocksAhead.status == auctionStatus.Active) {
                  return blocksAhead.number;
                }

                if (blocksAhead.status == auctionStatus.lastBlock) {
                  return '1!';
                }

                return 'expired';
              })()}
            </p>
          </div>
        </div>

        <div
          className={clsx([
            'rounded-lg',
            'mx-auto',
            'relative',
            'overflow-clip',
            'mb-4',
            previewStyles['image-square'],
            'w-[full]',
          ])}
        >
          <Image
            src={tokenData.image.replace(
              'ipfs://',
              publicRuntimeConfig.ipfsHttpsPrefix
            )}
            layout="fill"
            className={clsx([tokenStyles.scaled])}
          />

          <div
            className={clsx([
              tokenStyles['bg-gradient'],
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
              'bottom-2',
              'left-2',
              'pointer-events-none',
              'flex',
              'flex-col',
              'gap-2',
              'items-start',
            ])}
          >
            <div
              id="lastBidDiv"
              className={clsx([
                'last-bid-blurred-bg',
                'p-1',
                'hidden',
                'flex',
                'flex-col',
                'gap-[0.125rem]',
                'border-[0.2px]',
                'rounded-md',
                'bg-[#676767]',
                'bg-opacity-[0.04]',
              ])}
            >
              <p className={clsx(['text-xs'])}>Last Bid</p>
              <div className={clsx('flex', 'gap-1')}>
                <span className={clsx(['text-base', 'font-semibold'])}>
                  {ethers.utils.formatEther(
                    listingData.listings[0].bids[0].amount
                  )}
                </span>
                <span className={clsx(['text-base', 'opacity-60'])}>
                  {chain?.nativeCurrency?.symbol || 'ETH'}
                </span>
              </div>
            </div>

            <div className={clsx(['flex', 'items-center', 'gap-1'])}>
              <p className={clsx(['font-medium', 'text-base'])}>
                {tokenData.name
                  .slice(0, 14)
                  .concat(tokenData.name.length > 15 ? '...' : '')}
              </p>
              <p className={clsx(['opacity-60', 'text-xs'])}>
                #{queriedToken.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(['flex', 'justify-between', 'items-center', 'mb-2'])}
      >
        <p className={clsx(['text-xs', 'opacity-60'])}>Initial Price</p>
        <div>
          <span className={clsx(['text-sm', 'font-semibold'])}>
            <>
              {ethers.utils.formatEther(listingData.listings[0].bids[0].amount)}
              &nbsp;
            </>
          </span>
          <span className={clsx(['text-sm', 'opacity-60'])}>ETH</span>
        </div>
      </div>

      <div className={clsx(['flex', 'gap-2', 'items-stretch'])}>
        <button
          type="button"
          disabled={blocksAhead.status != auctionStatus.Closed}
          onClick={() => {
            toastId.current = toast.loading('Claiming 🙊', {
              theme: 'dark',
              closeOnClick: true,
              draggable: true,
            }) as number;
            setIsTokenBusy(true);

            writeClaim?.();
          }}
          className={clsx([
            'bg-[#121212]',
            'py-2',
            'font-medium',
            'text-xs',
            'rounded-lg',
            blocksAhead.status != auctionStatus.Closed && 'pointer-events-none',
            'transition',
            'ease-in',
            'border',
            'text-[#66bb6a]',
            'border-[#66bb6a]',
            'basis-3/4',
            'hover:bg-[#66bb6a]',
            'hover:text-white',
          ])}
        >
          Claim
        </button>
        <button
          onClick={() => {
            setIsActiveBids(true);
          }}
          className={clsx([
            'px-[0.489375rem]',
            'text-xs',
            'grow',
            'font-medium',
            'text-white',
            'bg-[#676767]',
            'hover:bg-[#676767]',
            'hover:bg-opacity-40',
            'transition',
            'bg-opacity-[4%]',
            'hover:backdrop-blur-sm',
            'border',
            'border-white',
            'rounded-lg',
          ])}
        >
          Bids
        </button>
      </div>

      {isBidsActive && (
        <BidsModal
          refetchListingQuery={refetchListingQuery}
          setIsActiveBids={setIsActiveBids}
          listing={listingData.listings[0]}
        />
      )}
    </div>
  );
};

export default ListedToken;
