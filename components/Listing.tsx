import getConfig from 'next/config';
import { useQuery } from 'react-query';
import { useBlockNumber, useContractRead, useNetwork } from 'wagmi';
import Image from 'next/image';
import clsx from 'clsx';
import { Dispatch, SetStateAction } from 'react';

interface ListingProps {
  listing: {
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

const Listing = ({ listing, setCurrentListing }: ListingProps) => {
  const { publicRuntimeConfig } = getConfig();
  const { chain } = useNetwork();

  // const {
  //   data: minBidData,
  //   isError: isMinBidError,
  //   isLoading: isMinBidLoading,
  // } = useContractRead({
  //   address: publicRuntimeConfig.networksToAddresses?.DiffusedMarketplace,
  //   abi: publicRuntimeConfig.networksToAddresses?.DiffusedMarketplaceAbi,
  //   functionName: 'getMinBid',
  //   args: [listing.tokenId],
  // });

  const {
    data: tokenUriData,
    isError: isTokenUriError,
    isLoading: isTokenUriLoading,
  } = useContractRead({
    address:
      publicRuntimeConfig.networksToAddresses[chain?.id || '']?.DiffusedNfts,
    abi: publicRuntimeConfig.networksToAddresses[chain?.id || '']
      ?.DiffusedNftsAbi,
    functionName: 'tokenURI',
    args: [listing.tokenId],
  });

  const {
    isLoading: isTokenDataLoading,
    isError: isTokenDataError,
    isIdle: isTokenDataIdle,
    data: tokenData,
  } = useQuery(
    ['token', listing.tokenId],
    async () => {
      const res = await fetch(
        (tokenUriData as string).replace(
          'ipfs://',
          publicRuntimeConfig.ipfsHttpsPrefix
        )
      );

      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    },
    { enabled: !!tokenUriData, refetchOnWindowFocus: false }
  );

  if (isTokenDataLoading) {
    return <p>Loading ypur data</p>;
  }

  if (isTokenDataError) {
    return <p>Couldnt retrieve</p>;
  }

  return <div className={clsx(['flex', 'flex-col', 'gap-3'])}></div>;
};

export default Listing;
