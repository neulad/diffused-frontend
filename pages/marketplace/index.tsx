import { gql } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import Header from '../../components/Header';
import ListingList from '../../components/ListingList';
import TokenList from '../../components/TokenList';

const Nfts = () => {
  const { address, isConnected } = useAccount();
  const [isLoaded, setIsLoaded] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isConnected || !address || !isLoaded) {
    return (
      <>
        <Header headerRef={headerRef} />
        <p>Please connect to web3 wallet</p>
      </>
    );
  }

  return (
    <>
      <Header headerRef={headerRef} />
      <ListingList owner={address as string} headerRef={headerRef} />
    </>
  );
};

export default Nfts;
