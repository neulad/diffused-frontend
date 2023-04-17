import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import tokenStyles from '../styles/Token.module.scss';
import Bid from './Bid';

interface BidsModalProps {
  setIsActiveBids: any;
  refetchListingQuery: any;
  listing: {
    id: string;
    status: string;
    tokenId: string;
    seller: string;
    bids: {
      id: string;
      bidder: string;
      amount: string;
      bidAt: string;
    }[];
    minimumBidIncrement: string;
    endDate: string;
    listedAt: string;
  };
}

const BidsModal = ({
  setIsActiveBids,
  listing,
  refetchListingQuery,
}: BidsModalProps) => {
  const bidsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchListingQuery();
    }, 6_000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const closeWindow = (e: KeyboardEvent) => {
      if (['27', 'Escape'].includes(String(e.key))) setIsActiveBids(false);
    };

    window.addEventListener('keydown', closeWindow);

    return () => {
      window.removeEventListener('keydown', closeWindow);
    };
  }, []);

  useEffect(() => {
    const removeModal = (e: MouseEvent) => {
      if (!bidsRef.current?.contains(e.target as HTMLElement)) {
        setIsActiveBids(false);
      }
    };

    document.addEventListener('mousedown', removeModal);

    return () => document.removeEventListener('mousedown', removeModal);
  }, []);

  return (
    <div
      className={clsx([
        'fixed',
        'z-[100]',
        'top-0',
        'left-0',
        'right-0',
        'bottom-0',
        'bg-[#181818]',
        'backdrop-blur',
        'bg-opacity-40',
      ])}
    >
      <div
        className={clsx([
          'sm:w-1/2',
          'w-4/5',
          tokenStyles['pop-up-fade-out'],
          'bg-[#181818]',
          'rounded-lg',
          'absolute',
          'top-[50%]',
          'left-[50%]',
          'min-w-max',
          'border',
          'border-[#4B5563]',
          'py-6',
        ])}
        ref={bidsRef}
      >
        <div
          className={clsx([
            'flex',
            'justify-between',
            'items-center',
            'px-6',
            'mb-6',
          ])}
        >
          <p className={clsx(['text-lg', 'font-semibold'])}>Bids</p>

          <svg
            className={clsx([
              'opacity-50',
              'hover:opacity-95',
              'transition',
              'ease-in',
              'hover:cursor-pointer',
            ])}
            onClick={() => {
              setIsActiveBids(false);
            }}
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.293031 0.793081C0.480558 0.60561 0.734866 0.500295 1.00003 0.500295C1.26519 0.500295 1.5195 0.60561 1.70703 0.793081L6.00003 5.08608L10.293 0.793081C10.3853 0.697571 10.4956 0.621389 10.6176 0.56898C10.7396 0.516571 10.8709 0.488985 11.0036 0.487831C11.1364 0.486677 11.2681 0.511978 11.391 0.562259C11.5139 0.61254 11.6255 0.686793 11.7194 0.780686C11.8133 0.874579 11.8876 0.986231 11.9379 1.10913C11.9881 1.23202 12.0134 1.3637 12.0123 1.49648C12.0111 1.62926 11.9835 1.76048 11.9311 1.88249C11.8787 2.00449 11.8025 2.11483 11.707 2.20708L7.41403 6.50008L11.707 10.7931C11.8892 10.9817 11.99 11.2343 11.9877 11.4965C11.9854 11.7587 11.8803 12.0095 11.6948 12.1949C11.5094 12.3803 11.2586 12.4855 10.9964 12.4878C10.7342 12.49 10.4816 12.3892 10.293 12.2071L6.00003 7.91408L1.70703 12.2071C1.51843 12.3892 1.26583 12.49 1.00363 12.4878C0.741432 12.4855 0.49062 12.3803 0.305212 12.1949C0.119804 12.0095 0.0146347 11.7587 0.0123563 11.4965C0.0100779 11.2343 0.110873 10.9817 0.293031 10.7931L4.58603 6.50008L0.293031 2.20708C0.10556 2.01955 0.000244141 1.76525 0.000244141 1.50008C0.000244141 1.23492 0.10556 0.980609 0.293031 0.793081Z"
              fill="#ffffff"
            />
          </svg>
        </div>
        <div
          className={clsx(['h-[1px]', 'w-full', 'bg-[#4B5563]', 'mb-6'])}
        ></div>
        <div className={clsx(['px-6', 'flex', 'flex-col', 'gap-3', 'mb-3'])}>
          {listing.bids.map(
            (bid: {
              id: string;
              bidder: string;
              amount: string;
              bidAt: string;
            }) => {
              return (
                <Bid
                  key={bid.id}
                  id={bid.id}
                  seller={listing.seller}
                  bidder={bid.bidder}
                  amount={bid.amount}
                  bidAt={bid.bidAt}
                />
              );
            }
          )}
        </div>
        {listing.bids.length == 1 && (
          <p className={clsx('px-6', 'hidden', 'sm:block')}>
            Looks like nobody's placed a bid yet.{' '}
            <strong className={clsx(['font-semibold'])}>Bummer</strong>!
          </p>
        )}
      </div>
    </div>
  );
};

export default BidsModal;
