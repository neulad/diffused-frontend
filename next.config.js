const DiffusedNftsAbi = require('./constants/abis/DiffusedNfts.abi.json');
const DiffusedMarketplaceAbi = require('./constants/abis/DiffusedMarketplace.abi.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    networksToAddresses: {
      5: {
        name: 'goerli',
        DiffusedNfts: '0x8a624d120ebc698cc342f97300aeca2e26c0d48b',
        DiffusedNftsAbi,
        DiffusedMarketplace: '0xefE971E5C9C2385e116e368e747A2043d795aFC4',
        DiffusedMarketplaceAbi,
      },
    },
    ipfsHttpsPrefix: 'https://copper-careful-perch-968.mypinata.cloud/ipfs/',
    localStorageGenerationTitle: 'generation.current',
    getTokensQuery: `
      query Tokens($owner: String, $listed: Boolean) {
        tokens(where: { owner: $owner, listed: $listed }) {
          id
          owner
          name @client
        } 
      }
    `,
    getListinsQuery: `
      query Listings($currentBlockNumber: BigInt) {
        listings(first: 5, where: {endDate_gt: $currentBlockNumber}) {
          id
          status
          tokenId
          seller
          bids {
            id
            bidder
            amount
            bidAt
          }
          minimumBidIncrement
          endDate
          listedAt
        }
      }
    `,
    getTokenListing: `
      query Listing($tokenId: String!) {
        listings(where: {tokenId: $tokenId, status: Open}) {
          id
          status
          tokenId
          seller
          bids {
            id
            bidder
            amount
            bidAt
          }
          minimumBidIncrement
          endDate
          listedAt
        }
      }
    `,
  },
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '443',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'copper-careful-perch-968.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
};

module.exports = nextConfig;
