import { gql, useApolloClient, useQuery } from '@apollo/client';
import getConfig from 'next/config';
import clsx from 'clsx';
import Token from './Token';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import LoadingToken from './LoadingToken';
import ListedToken from './ListedToken';
import styles from '../styles/TokenList.module.scss';
import { useBlockNumber } from 'wagmi';

interface TokenListProps {
  owner: string;
  headerRef: MutableRefObject<HTMLElement | null>;
}

const TokenList = ({ owner, headerRef }: TokenListProps) => {
  const { publicRuntimeConfig } = getConfig();
  const [isTokenListed, setIsTokenListed] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const sidebarReference = useRef<HTMLInputElement>(null);
  const [isFixedSidebar, setIsFixedSidebar] = useState(false);
  const {
    data: blockNumber,
    isError: isBlockNumberError,
    isLoading: isBlockNumberLoading,
  } = useBlockNumber();
  const client = useApolloClient();

  useEffect(() => {
    const removeFixed = () => {
      if (window.innerWidth <= 768) {
        setIsFixedSidebar(false);
      }
    };

    window.addEventListener('resize', removeFixed);

    return () => {
      window.removeEventListener('resize', removeFixed);
    };
  }, []);

  useEffect(() => {
    const stickOnScroll = () => {
      if (window.innerWidth <= 768) return;

      if (
        headerRef.current &&
        window.pageYOffset + headerRef.current.offsetHeight >
          (sidebarReference.current ? sidebarReference.current.offsetTop : 0)
      ) {
        setIsFixedSidebar(true);
      } else {
        setIsFixedSidebar(false);
      }
    };

    window.addEventListener('scroll', stickOnScroll);

    return () => {
      window.removeEventListener('scroll', stickOnScroll);
    };
  }, []);

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
    called: queryCalled,
    refetch: queryRefetch,
  } = useQuery(gql(publicRuntimeConfig.getListinsQuery), {
    variables: { currentBlockNumber: blockNumber },
    skip: !blockNumber,
  });

  if (queryError || isBlockNumberError) {
    console.log(queryError);
    return <p>Error occured, sorry!</p>;
  }

  if (queryLoading || !queryCalled) {
    return <p>Loading</p>;
  }

  return (
    <div className={clsx(['grow'])}>
      {queryData.listings.map((listing) => {
        // <Listing />;
      })}
    </div>
  );
};

export default TokenList;
