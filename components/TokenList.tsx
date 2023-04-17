import { gql, useApolloClient, useQuery } from '@apollo/client';
import getConfig from 'next/config';
import clsx from 'clsx';
import Token from './Token';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import LoadingToken from './LoadingToken';
import ListedToken from './ListedToken';
import styles from '../styles/TokenList.module.scss';

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
  } = useQuery(gql(publicRuntimeConfig.getTokensQuery), {
    variables: { owner, listed: isTokenListed },
    skip: !owner,
    pollInterval: 16_000,
  });

  if (queryError) {
    console.log(queryError);
    return <p>Error occured, sorry!</p>;
  }

  return (
    <div className={clsx(['tablet:px-6', 'px-3'])}>
      <p className={clsx(['text-2xl', 'mb-2'])}>My tokens</p>
      <hr
        className={clsx([
          'w-full',
          'h-[1px]',
          'opacity-10',
          'bg-white',
          'mb-4',
        ])}
      />

      <div className={clsx(['flex', 'flex-col', 'md:flex-row', 'gap-5'])}>
        <div
          ref={sidebarReference}
          className={clsx(['w-full', 'md:w-[300px]', 'wider:w-[446px]'])}
        >
          <div
            className={clsx([
              isFixedSidebar && `fixed top-[78px]`,
              styles['fixed-sidebar'],
              'z-10',
            ])}
          >
            <div className={clsx(['relative', 'mb-2'])}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  width="17"
                  height="17"
                  className="text-[#9ca3af]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 22L20 20"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="minimumBidIncrement"
                className={clsx([
                  'bg-[#242424]',
                  'text-white',
                  'text-sm',
                  'rounded-lg',
                  'pr-8',
                  'block',
                  'placeholder:opacity-40',
                  'placeholder:italic',
                  'placeholder:text-sm',
                  'focus:placeholder:text-transparent',
                  'focus:caret-white',
                  'w-full',
                  'pl-10',
                  'p-2.5',
                ])}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                placeholder="Search for the tokens"
              />
            </div>
            <div
              className={clsx(['py-5', 'px-4', 'rounded-lg', 'bg-[#1b1b1b]'])}
            >
              <p className={clsx(['text-base', 'font-medium', 'mb-4'])}>
                Token Status
              </p>
              <div className="flex items-center mb-4">
                <input
                  id="not-listed"
                  type="radio"
                  checked={!isTokenListed}
                  value=""
                  onClick={() => {
                    setIsTokenListed(false);
                  }}
                  name="not-listed"
                  className={clsx([
                    'w-4',
                    'h-4',
                    'focus:ring-blue-500',
                    'bg-white',
                    'appearance-none',
                    'rounded-full',
                    'bg-white',
                    'border-white',
                    isTokenListed && 'hover:cursor-pointer',

                    isTokenListed && 'border-opacity-10',
                    isTokenListed && 'border-[0.5px]',
                    isTokenListed && 'bg-opacity-5',

                    !isTokenListed && 'border-[3.5px]',
                    !isTokenListed && 'border-[#5F5AFA]',
                  ])}
                />
                <label
                  htmlFor="not-listed"
                  className={clsx(['ml-2', 'text-sm', 'font-medium'])}
                >
                  Not listed
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="listed"
                  checked={isTokenListed}
                  type="radio"
                  value=""
                  name="listed"
                  onClick={() => {
                    setIsTokenListed(true);
                  }}
                  className={clsx([
                    'w-4',
                    'h-4',
                    'focus:ring-blue-500',
                    'bg-white',
                    'appearance-none',
                    'rounded-full',
                    'bg-white',
                    'border-white',
                    !isTokenListed && 'hover:cursor-pointer',

                    !isTokenListed && 'border-opacity-10',
                    !isTokenListed && 'border-[0.5px]',
                    !isTokenListed && 'bg-opacity-5',

                    isTokenListed && 'border-[3.5px]',
                    isTokenListed && 'border-[#5F5AFA]',
                  ])}
                />
                <label
                  htmlFor="listed"
                  className={clsx([
                    'ml-2',
                    'text-sm',
                    'font-medium',
                    'border-3',
                  ])}
                >
                  Listed
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={clsx(['grow'])}>
          {!queryLoading && queryCalled && queryData ? (
            <div
              className={clsx([
                'grid',
                'ss:grid-cols-2',
                'wider:grid-cols-3',
                'xwider:grid-cols-5',
                'gap-5',
              ])}
            >
              {queryData.tokens
                .filter((nft: { id: string; owner: string }) => {
                  if (!searchInput) return true;

                  const cachedToken = client.readQuery({
                    query: gql`
                      query GetToken($id: Int!) {
                        token(id: $id) {
                          name @client
                        }
                      }
                    `,
                    variables: {
                      id: nft.id,
                    },
                  });

                  const searchString = (
                    cachedToken?.token?.name + nft.id
                  ).toLowerCase();
                  let isFound = false;
                  for (let searchWord of searchInput.split(' ')) {
                    if (searchString.includes(searchWord.toLowerCase())) {
                      isFound = true;
                      break;
                    }
                  }

                  return isFound;
                })
                .map((nft: { id: string; owner: string }) => {
                  return isTokenListed ? (
                    <ListedToken
                      key={nft.id}
                      queryRefetch={queryRefetch}
                      queriedToken={nft}
                      owner={owner}
                    />
                  ) : (
                    <Token
                      key={nft.id}
                      queriedToken={nft}
                      queryRefetch={queryRefetch}
                    />
                  );
                })}
            </div>
          ) : (
            <div
              className={clsx([
                'grid',
                'ss:grid-cols-2',
                'wider:grid-cols-3',
                'xwider:grid-cols-5',
                'gap-5',
              ])}
            >
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
              <LoadingToken />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenList;
