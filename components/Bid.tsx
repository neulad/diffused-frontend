import clsx from 'clsx';
import { createAvatar } from '@dicebear/avatars';
import * as dicebearStyle from '@dicebear/open-peeps';
import { ethers } from 'ethers';
import { useNetwork } from 'wagmi';

interface BidProps {
  id: string;
  bidder: string;
  amount: string;
  bidAt: string;
  seller: string;
}

const Bid = ({ bidder, amount, seller }: BidProps) => {
  const { chain } = useNetwork();

  const zeroAddress = '0x0000000000000000000000000000000000000000';

  const avatar = createAvatar(dicebearStyle, {
    seed: bidder,
    dataUri: true,
    background: 'white',
    width: 40,
    height: 40,
  });

  return (
    <div
      className={clsx([
        'px-3',
        'bg-[#4B5563]',
        'rounded-lg',
        'flex',
        'flex-row',
        'sm:items-center',
        'gap-2',
        'justify-between',
        'py-3',
      ])}
    >
      <div className={clsx(['flex', 'gap-3', 'items-center'])}>
        <img className={clsx(['rounded-lg'])} src={avatar} />
        <p className={clsx(['text-sm', 'font-semibold', 'hidden', 'ss:block'])}>
          {bidder !== zeroAddress
            ? bidder.slice(0, 11) + '....' + bidder.slice(bidder.length - 6)
            : 'You began an auction'}
        </p>
      </div>
      <div className={clsx(['flex', 'items-center', 'gap-[0.3125rem]'])}>
        <>
          {(() => {
            switch (chain?.network) {
              case 'optimism':
                return (
                  <svg
                    width="18"
                    height="10"
                    viewBox="0 0 18 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.21826 9.35379C6.9253 9.35379 9.07862 7.15125 9.07862 3.97049C9.07862 1.78025 7.61436 0.168335 5.09805 0.168335C2.38486 0.168335 0.25 2.37703 0.25 5.55164C0.25 7.74803 1.75117 9.35379 4.21826 9.35379ZM5.04883 2.00173C6.10704 2.00173 6.78995 2.81384 6.78995 4.09969C6.78995 5.99461 5.67637 7.52039 4.27979 7.52039C3.22158 7.52039 2.54483 6.69598 2.54483 5.42244C2.54483 3.53367 3.65225 2.00173 5.04883 2.00173Z"
                      fill="white"
                    />
                    <path
                      d="M11.432 0.322144L9.54934 9.19998H11.8073L12.361 6.59754H13.8314C16.2616 6.59754 17.8427 5.21941 17.8427 2.99842C17.8427 1.3865 16.6738 0.322144 14.7419 0.322144H11.432ZM13.3207 2.05711H14.2743C15.0988 2.05711 15.5725 2.43855 15.5725 3.20144C15.5725 4.19812 14.8896 4.89334 13.8314 4.89334H12.7178L13.3207 2.05711Z"
                      fill="white"
                    />
                  </svg>
                );
              default:
                return (
                  <svg
                    width="6"
                    height="12"
                    viewBox="0 0 6 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 6.66235L3 8.69308L5.99942 6.66235L3 11.5L0 6.66235Z"
                      fill="url(#paint0_linear_380_2601)"
                    />
                    <path
                      d="M3 7.93674L0 5.90601L3 0.5L6 5.90601L3 7.93674Z"
                      fill="white"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_380_2601"
                        x1="2.99971"
                        y1="6.66235"
                        x2="2.99971"
                        y2="11.5"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="white" />
                        <stop
                          offset="1"
                          stop-color="white"
                          stop-opacity="0.9"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                );
            }
          })()}
        </>

        <div className={clsx(['flex', 'items-end'])}>
          <span className={clsx(['text-sm', 'font-semibold'])}>
            {ethers.utils.formatEther(amount)}&nbsp;
          </span>
          <span className={clsx(['text-sm', 'opacity-60'])}>
            {chain?.nativeCurrency?.symbol || 'ETH'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Bid;
