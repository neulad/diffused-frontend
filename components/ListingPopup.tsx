import {
  useBlockNumber,
  useContractRead,
  useContractWrite,
  useNetwork,
} from 'wagmi';
import getConfig from 'next/config';
import clsx from 'clsx';
import { gql, useQuery } from '@apollo/client';

interface ListingPopupProps {
  currentListing: {
    id: string;
    status: string;
    tokenId: string;
    seller: string;
    bids: { id: string; bidder: string; amount: string; bidAt: string }[];
    minimumBidIncrement: string;
    endDate: string;
    listedAt: string;
  };
  setCurrentListing: any;
}

const ListingPopup = ({
  currentListing,
  setCurrentListing,
}: ListingPopupProps) => {
  const { chain } = useNetwork();
  const { publicRuntimeConfig } = getConfig();

  const {
    data: minBidData,
    isError: isMinBidError,
    isLoading: isMinBidLoading,
  } = useContractRead({
    address:
      publicRuntimeConfig.networksToAddresses[chain?.id || '']
        ?.DiffusedMarketplace,
    abi: publicRuntimeConfig.networksToAddresses[chain?.id || '']
      ?.DiffusedMarketplaceAbi,
    functionName: 'getMinBid',
    args: [currentListing.tokenId],
    enabled: !!currentListing.tokenId,
    watch: true,
  });

  const { refetch } = useQuery(gql(publicRuntimeConfig.getSingleListingQuery), {
    onCompleted: (data) => {
      setCurrentListing(data.listing);
    },
    variables: { id: currentListing.id },
  });

  useBlockNumber({
    onBlock() {
      refetch();
    },
  });

  const { write: writeBid } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address:
      publicRuntimeConfig.networksToAddresses[chain?.id || '']
        ?.DiffusedMarketplace,
    abi: publicRuntimeConfig.networksToAddresses[chain?.id || '']
      ?.DiffusedMarketplaceAbi,
    functionName: 'bid',
  });

  return (
    <div
      className={clsx([
        'absolute',
        'z-10',
        'right-0',
        'bg-white',
        'text-black',
        'top-0',
        'bottom-0',
      ])}
    >
      <p>{currentListing.tokenId}</p>
      <p>{currentListing.seller}</p>
      <ul>
        {currentListing.bids.map((el) => (
          <li key={el.id}>
            {el.bidder} {el.amount} {el.bidAt}
          </li>
        ))}
      </ul>
      <p>{currentListing.minimumBidIncrement}</p>
      <p>{currentListing.endDate}</p>
      <p>{currentListing.listedAt}</p>
      <p>Min bid: {minBidData?.toString() as string}</p>

      <button
        onClick={() =>
          writeBid?.({
            recklesslySetUnpreparedOverrides: {
              value: minBidData?.toString(),
            },
            recklesslySetUnpreparedArgs: [currentListing.tokenId, minBidData],
          })
        }
      >
        Make a bid
      </button>
    </div>
  );
};

export default ListingPopup;
