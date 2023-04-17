import clsx from 'clsx';
import getConfig from 'next/config';
import Image from 'next/image';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import GenerateFormStyles from '../styles/GenerateForm.module.scss';
import { useNetwork } from 'wagmi';
import styles from '../styles/Token.module.scss';
import { BigNumber } from 'ethers';
import OpeningBidMessage from './OpeningBidMessage';
import DurationMessage from './DurationMessage';
import MinimumBidIncrementMessage from './MinimumBidIncrementMessage';

interface ListingModalProps {
  tokenId: string;
  toastId: MutableRefObject<number>;
  tokenData: { image: string; name: string; description: string };
  setIsListingActive: (arg0: boolean) => void;
  address: `0x${string}` | undefined;
  setIsTokenBusy: (arg0: boolean) => void;
  setOpeningBid: (arg0: string) => void;
  openingBid: string;
  setDuration: (arg0: string) => void;
  duration: string;
  setMinimumBidIncrement: (arg0: string) => void;
  minimunBidIncrement: string;
  writeApprove: any;
}

const ListingModal = ({
  tokenId,
  tokenData,
  toastId,
  setIsTokenBusy,
  setIsListingActive,
  writeApprove,
  setOpeningBid,
  openingBid,
  setDuration,
  duration,
  setMinimumBidIncrement,
  minimunBidIncrement: minimumBidIncrement,
}: ListingModalProps) => {
  const { publicRuntimeConfig } = getConfig();
  const listingRef = useRef<HTMLDivElement>(null);
  const { chain } = useNetwork();

  const [isOpeningBidTooPrecise, setIsOpeningBidTooPrecise] = useState(false);
  const [isCorrectOpeningBid, setIsCorrectOpeningBid] = useState(false);
  const [isOpeningBidInScope, setIsOpeningBidInScope] = useState(false);
  const [isCorrectDuration, setIsCorrectDuration] = useState(false);
  const [isDurationInScope, setIsDurationInScope] = useState(false);
  const [isCorrectMinimumBidIncrement, setIsCorrectMinimumBidIncrement] =
    useState(false);
  const [isMinimumBidIncrementInScope, setIsMinimumBidIncrementInScope] =
    useState(false);

  useEffect(() => {
    const closeWindow = (e: KeyboardEvent) => {
      if (['27', 'Escape'].includes(String(e.key))) setIsListingActive(false);
    };

    window.addEventListener('keydown', closeWindow);

    return () => {
      window.removeEventListener('keydown', closeWindow);
    };
  }, []);

  useEffect(() => {
    const removeModal = (e: MouseEvent) => {
      if (!listingRef.current?.contains(e.target as HTMLElement)) {
        setIsListingActive(false);
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
          'absolute',
          'ss:w-[440px]',
          'w-[90%]',
          'min-w-min',
          styles['pop-up'],
          'top-[50%]',
          'left-[50%]',
          'flex',
          'flex-col',
          'gap-3',
        ])}
        ref={listingRef}
      >
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="31.62 31.62 71.7 72.4"
          width="20px"
          height="20px"
          className={clsx([
            'absolute',
            'right-4',
            'top-4',
            'hover:cursor-pointer',
            'opacity-60',
            'hover:opacity-100',
          ])}
          onClick={() => {
            setIsListingActive(false);
          }}
        >
          <line
            x1="101.59"
            y1="102.299"
            x2="33.7042"
            y2="34.4127"
            stroke="white"
            strokeWidth="2"
          />
          <line
            x1="33.3525"
            y1="101.236"
            x2="101.238"
            y2="33.3501"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
        <div
          className={clsx([
            'px-5',
            'py-6',
            'bg-[#1a1a1a]',
            'rounded-2xl',
            'flex',
            'ss:flex-row',
            'flex-col',
            'gap-4',
            'items-start',
          ])}
        >
          <div
            className={clsx([
              'hidden',
              'ss:block',
              'rounded-lg',
              'relative',
              'overflow-clip',
              'h-[140px]',
              'w-[140px]',
            ])}
          >
            <Image
              src={tokenData.image.replace(
                'ipfs://',
                publicRuntimeConfig.ipfsHttpsPrefix
              )}
              layout="fixed"
              height="140"
              width="140"
            />
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
                'bottom-2',
                'left-2',
                'pointer-events-none',
                'flex',
                'flex-col',
                'items-start',
                'gap-1',
              ])}
            >
              <p className={clsx(['opacity-60', 'text-[0.625rem]'])}>
                #{tokenId}
              </p>
              <p className={clsx(['font-medium', 'text-sm'])}>
                {tokenData.name
                  .slice(0, 14)
                  .concat(tokenData.name.length > 15 ? '...' : '')}
              </p>
            </div>
          </div>
          <div>
            <p className={clsx(['text-xl', 'font-medium', 'mb-2'])}>
              Want to sell it?
            </p>
            <p className={clsx(['text-sm', 'opacity-40'])}>
              The token will be securely locked in the marketplace until the
              designated duration has passed. Once that time has come, you will
              be able to claim the highest bid.
            </p>
          </div>
        </div>

        <div className={clsx(['bg-[#1a1a1a]', 'rounded-2xl', 'py-4', 'px-5'])}>
          <p className={clsx(['text-2xl', 'font-medium', 'mb-2'])}>Details</p>
          <hr className={clsx(['bg-white', 'opacity-10', 'mb-5'])} />
          <label
            htmlFor="openingBid"
            className={clsx([
              'block',
              'mb-2',
              'text-sm',
              'pointer-events-none',
              'font-medium',
              'text-white',
            ])}
          >
            Starting Price
          </label>
          <div className={clsx(['relative', 'mb-2'])}>
            <div
              className={clsx([
                'absolute',
                'inset-y-0',
                'left-0',
                'flex',
                'items-center',
                'pl-3',
                'pointer-events-none',
              ])}
            >
              <svg
                width="20"
                height="20"
                className="text-[#9ca3af]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.44 8.8999C20.04 9.2099 21.51 11.0599 21.51 15.1099V15.2399C21.51 19.7099 19.72 21.4999 15.25 21.4999H8.73998C4.26998 21.4999 2.47998 19.7099 2.47998 15.2399V15.1099C2.47998 11.0899 3.92998 9.2399 7.46998 8.9099"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15.0001V3.62012"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.35 5.85L12 2.5L8.65002 5.85"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              className={clsx([
                'absolute',
                'flex',
                'flex-col',
                'justify-center',
                'gap-1',
                'inset-y-0',
                'right-3',
                !isCorrectOpeningBid
                  ? 'hover:cursor-default'
                  : 'hover:cursor-pointer',
              ])}
            >
              <svg
                className={clsx([
                  'hover:opacity-60',
                  'hover:cursor-pointer',
                  !isCorrectOpeningBid && 'pointer-events-none',
                  'transition',
                  'ease-in',
                ])}
                onClick={() => {
                  if (isCorrectOpeningBid)
                    setOpeningBid((Number(openingBid) + 1).toString());
                }}
                width="12"
                viewBox="0 0 8 4"
                fill="none"
              >
                <path
                  d="M1.04 3.91L4.155 3.91L6.96 3.91C7.44 3.91 7.68 3.33 7.34 2.99L4.75 0.400003C4.335 -0.0149965 3.66 -0.0149965 3.245 0.400003L2.26 1.385L0.655004 2.99C0.320004 3.33 0.560004 3.91 1.04 3.91Z"
                  fill="white"
                />
              </svg>

              <svg
                className={clsx([
                  'hover:opacity-60',
                  'hover:cursor-pointer',
                  !isCorrectOpeningBid && 'pointer-events-none',
                  'transition',
                  'ease-in',
                ])}
                onClick={() => {
                  if (isCorrectOpeningBid && Number(openingBid) - 1 > 0)
                    setOpeningBid((Number(openingBid) - 1).toString());
                }}
                width="12"
                viewBox="0 0 8 4"
                fill="none"
              >
                <path
                  d="M6.96 0.0899963H3.845H1.04C0.559996 0.0899963 0.319996 0.669997 0.659996 1.01L3.25 3.6C3.665 4.015 4.34 4.015 4.755 3.6L5.74 2.615L7.345 1.01C7.68 0.669997 7.44 0.0899963 6.96 0.0899963Z"
                  fill="white"
                />
              </svg>
            </div>
            <input
              type="text"
              id="openingBid"
              className={clsx([
                'bg-[#242424]',
                'text-white',
                'border',
                !openingBid && 'focus:border-[#5F5AFA]',
                openingBid
                  ? !isOpeningBidInScope ||
                    !isCorrectOpeningBid ||
                    isOpeningBidTooPrecise
                    ? 'focus:border-orange-800'
                    : 'focus:border-[#66BB6A]'
                  : '',
                'border-[#4b5563]',
                'text-sm',
                'rounded-lg',
                'font-space',
                'pr-8',
                'block',
                'placeholder:text-[#9ca3af]',
                'focus:placeholder:text-transparent',
                'focus:caret-white',
                'w-full',
                'pl-10',
                'p-2.5',
              ])}
              onChange={(e) => {
                if (
                  e.target.value.length !== 0 &&
                  /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/.exec(e.target.value) ===
                    null
                ) {
                  setIsCorrectOpeningBid(false);
                } else {
                  setIsCorrectOpeningBid(true);
                }

                if (
                  Number(e.target.value) < 0.000001 ||
                  Number(e.target.value) > 10000
                ) {
                  setIsOpeningBidInScope(false);
                } else {
                  setIsOpeningBidInScope(true);
                }

                const numberAfterDot = e.target.value.split('.')[1]?.length;
                if (numberAfterDot && numberAfterDot > 6) {
                  setIsOpeningBidTooPrecise(true);
                } else {
                  setIsOpeningBidTooPrecise(false);
                }

                setOpeningBid(e.target.value);
              }}
              value={openingBid}
              placeholder="100"
            />
          </div>

          <OpeningBidMessage
            openingBid={openingBid}
            isCorrectOpeningBid={isCorrectOpeningBid}
            isOpeningBidInScope={isOpeningBidInScope}
            isOpeningBidTooPrecise={isOpeningBidTooPrecise}
          />

          <label
            htmlFor="duration"
            className={clsx([
              'block',
              'mb-2',
              'text-sm',
              'pointer-events-none',
              'font-medium',
              'text-white',
            ])}
          >
            Duration
          </label>
          <div className={clsx(['relative', 'mb-2'])}>
            <div
              className={clsx([
                'absolute',
                'inset-y-0',
                'left-0',
                'flex',
                'items-center',
                'pl-3',
                'pointer-events-none',
              ])}
            >
              <svg
                width="20"
                height="20"
                className="text-[#9ca3af]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.49 2.23006L5.50003 4.10006C4.35003 4.53006 3.41003 5.89006 3.41003 7.12006V14.5501C3.41003 15.7301 4.19005 17.2801 5.14005 17.9901L9.44003 21.2001C10.85 22.2601 13.17 22.2601 14.58 21.2001L18.88 17.9901C19.83 17.2801 20.61 15.7301 20.61 14.5501V7.12006C20.61 5.89006 19.67 4.53006 18.52 4.10006L13.53 2.23006C12.68 1.92006 11.32 1.92006 10.49 2.23006Z"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15.5C14.2091 15.5 16 13.7091 16 11.5C16 9.29086 14.2091 7.5 12 7.5C9.79086 7.5 8 9.29086 8 11.5C8 13.7091 9.79086 15.5 12 15.5Z"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.25 10.25V11.18C12.25 11.53 12.07 11.86 11.76 12.04L11 12.5"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center">
              {/* Cross */}
              <div
                className={clsx([
                  'absolute',
                  'flex',
                  'flex-col',
                  'justify-center',
                  'gap-1',
                  'cursor-pointer',
                  (!isCorrectDuration || !isDurationInScope) &&
                    'hover:cursor-default',
                  'inset-y-0',
                  'right-0',
                ])}
              >
                <svg
                  className={clsx([
                    'hover:opacity-60',
                    'transition',
                    'hover:cursor-pointer',
                    (!isCorrectDuration || !isDurationInScope) &&
                      'hover:pointer-events-none',
                    'ease-in',
                  ])}
                  onClick={() => {
                    if (
                      Number(duration) + 1 > 57_600 ||
                      Number(duration) + 1 < 10
                    )
                      return;

                    setDuration((Number(duration) + 1).toString());
                  }}
                  width="12"
                  viewBox="0 0 8 4"
                  fill="none"
                >
                  <path
                    d="M1.04 3.91L4.155 3.91L6.96 3.91C7.44 3.91 7.68 3.33 7.34 2.99L4.75 0.400003C4.335 -0.0149965 3.66 -0.0149965 3.245 0.400003L2.26 1.385L0.655004 2.99C0.320004 3.33 0.560004 3.91 1.04 3.91Z"
                    fill="white"
                  />
                </svg>

                <svg
                  className={clsx([
                    'hover:opacity-60',
                    (!isCorrectDuration || !isDurationInScope) &&
                      'hover:pointer-events-none',
                    'hover:cursor-pointer',
                    'transition',
                    'ease-in',
                  ])}
                  onClick={() => {
                    if (
                      Number(duration) - 1 > 57_600 ||
                      Number(duration) - 1 < 10
                    )
                      return;

                    setDuration((Number(duration) - 1).toString());
                  }}
                  width="12"
                  viewBox="0 0 8 4"
                  fill="none"
                >
                  <path
                    d="M6.96 0.0899963H3.845H1.04C0.559996 0.0899963 0.319996 0.669997 0.659996 1.01L3.25 3.6C3.665 4.015 4.34 4.015 4.755 3.6L5.74 2.615L7.345 1.01C7.68 0.669997 7.44 0.0899963 6.96 0.0899963Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <input
              type="text"
              id="duration"
              className={clsx([
                'bg-[#242424]',
                'text-white',
                'border',
                !duration && 'focus:border-[#5F5AFA]',
                duration
                  ? !isDurationInScope || !isCorrectDuration
                    ? 'focus:border-orange-800'
                    : 'focus:border-[#66BB6A]'
                  : '',
                'border-[#4b5563]',
                'text-sm',
                'rounded-lg',
                'font-space',
                'pr-8',
                'block',
                'placeholder:text-[#9ca3af]',
                'focus:placeholder:text-transparent',
                'focus:caret-white',
                'w-full',
                'pl-10',
                'p-2.5',
              ])}
              onChange={(e) => {
                if (!/^[0-9]+$/.exec(e.target.value)) {
                  setIsCorrectDuration(false);
                } else {
                  setIsCorrectDuration(true);
                }

                if (
                  Number(e.target.value) > 57_600 ||
                  Number(e.target.value) < 10
                ) {
                  setIsDurationInScope(false);
                } else {
                  setIsDurationInScope(true);
                }

                setDuration(e.target.value);
              }}
              value={duration}
              placeholder="289"
            />
          </div>

          <DurationMessage
            duration={duration}
            isCorrectDuration={isCorrectDuration}
            isDuarionInScope={isDurationInScope}
          />

          <label
            htmlFor="minimumBidIncrement"
            className={clsx([
              'block',
              'mb-2',
              'text-sm',
              'pointer-events-none',
              'font-medium',
              'text-white',
            ])}
          >
            Bid Increment
          </label>
          <div className={clsx(['relative', 'mb-2'])}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="text-[#9ca3af]"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.57007 15.27L15.11 8.72998"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.98001 10.3699C9.65932 10.3699 10.21 9.81923 10.21 9.13992C10.21 8.46061 9.65932 7.90991 8.98001 7.90991C8.3007 7.90991 7.75 8.46061 7.75 9.13992C7.75 9.81923 8.3007 10.3699 8.98001 10.3699Z"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.52 16.0899C16.1993 16.0899 16.75 15.5392 16.75 14.8599C16.75 14.1806 16.1993 13.6299 15.52 13.6299C14.8407 13.6299 14.29 14.1806 14.29 14.8599C14.29 15.5392 14.8407 16.0899 15.52 16.0899Z"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="absolute hover:cursor-pointer inset-y-0 right-3 flex items-center">
              {/* Cross */}
              <div
                className={clsx([
                  'absolute',
                  'flex',
                  'flex-col',
                  'justify-center',
                  'gap-1',
                  'cursor-pointer',
                  (!isCorrectDuration || !isDurationInScope) &&
                    'hover:cursor-default',
                  'inset-y-0',
                  'right-0',
                ])}
              >
                <svg
                  className={clsx([
                    'hover:opacity-60',
                    'transition',
                    'hover:cursor-pointer',
                    (!isMinimumBidIncrementInScope ||
                      !isCorrectMinimumBidIncrement) &&
                      'hover:pointer-events-none',
                    'ease-in',
                  ])}
                  onClick={() => {
                    if (
                      Number(minimumBidIncrement) + 1 > 15 ||
                      Number(minimumBidIncrement) + 1 < 2
                    )
                      return;

                    setMinimumBidIncrement(
                      (Number(minimumBidIncrement) + 1).toString()
                    );
                  }}
                  width="12"
                  viewBox="0 0 8 4"
                  fill="none"
                >
                  <path
                    d="M1.04 3.91L4.155 3.91L6.96 3.91C7.44 3.91 7.68 3.33 7.34 2.99L4.75 0.400003C4.335 -0.0149965 3.66 -0.0149965 3.245 0.400003L2.26 1.385L0.655004 2.99C0.320004 3.33 0.560004 3.91 1.04 3.91Z"
                    fill="white"
                  />
                </svg>

                <svg
                  className={clsx([
                    'hover:opacity-60',
                    (!isMinimumBidIncrementInScope ||
                      !isCorrectMinimumBidIncrement) &&
                      'hover:pointer-events-none',
                    'hover:cursor-pointer',
                    'transition',
                    'ease-in',
                  ])}
                  onClick={() => {
                    if (
                      Number(minimumBidIncrement) - 1 > 15 ||
                      Number(minimumBidIncrement) - 1 < 2
                    )
                      return;

                    setMinimumBidIncrement(
                      (Number(minimumBidIncrement) - 1).toString()
                    );
                  }}
                  width="12"
                  viewBox="0 0 8 4"
                  fill="none"
                >
                  <path
                    d="M6.96 0.0899963H3.845H1.04C0.559996 0.0899963 0.319996 0.669997 0.659996 1.01L3.25 3.6C3.665 4.015 4.34 4.015 4.755 3.6L5.74 2.615L7.345 1.01C7.68 0.669997 7.44 0.0899963 6.96 0.0899963Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <input
              type="text"
              id="minimumBidIncrement"
              className={clsx([
                'bg-[#242424]',
                'text-white',
                'border',
                !minimumBidIncrement && 'focus:border-[#5F5AFA]',
                minimumBidIncrement
                  ? !isMinimumBidIncrementInScope ||
                    !isCorrectMinimumBidIncrement
                    ? 'focus:border-orange-800'
                    : 'focus:border-[#66BB6A]'
                  : '',
                'border-[#4b5563]',
                'text-sm',
                'rounded-lg',
                'font-space',
                'pr-8',
                'block',
                'placeholder:text-[#9ca3af]',
                'focus:placeholder:text-transparent',
                'focus:caret-white',
                'w-full',
                'pl-10',
                'p-2.5',
              ])}
              onChange={(e) => {
                if (
                  e.target.value.length !== 0 &&
                  /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/.exec(e.target.value) ===
                    null
                ) {
                  setIsCorrectMinimumBidIncrement(false);
                } else {
                  setIsCorrectMinimumBidIncrement(true);
                }

                if (Number(e.target.value) < 2 || Number(e.target.value) > 15) {
                  setIsMinimumBidIncrementInScope(false);
                } else {
                  setIsMinimumBidIncrementInScope(true);
                }

                setMinimumBidIncrement(e.target.value);
              }}
              value={minimumBidIncrement}
              placeholder="4"
            />
          </div>

          <MinimumBidIncrementMessage
            minimumBidIncrement={minimumBidIncrement}
            isCorrectMinimumBidIncrement={isCorrectMinimumBidIncrement}
            isMinimumBidIncrementInScope={isMinimumBidIncrementInScope}
          />

          <button
            disabled={
              !isCorrectDuration ||
              !isCorrectMinimumBidIncrement ||
              !isCorrectOpeningBid ||
              !isDurationInScope ||
              !isOpeningBidInScope ||
              !isMinimumBidIncrementInScope ||
              !duration ||
              !minimumBidIncrement ||
              !openingBid
            }
            onClick={() => {
              setIsListingActive(false);
              setIsTokenBusy(true);

              toastId.current = toast.loading('Approving 👉', {
                theme: 'dark',
                closeOnClick: true,
                draggable: true,
              }) as number;

              writeApprove?.();
            }}
            className={clsx([
              'py-2',
              'px-10',
              (!isCorrectDuration ||
                !isCorrectMinimumBidIncrement ||
                !isCorrectOpeningBid ||
                !isDurationInScope ||
                !isOpeningBidInScope ||
                !isMinimumBidIncrementInScope ||
                !duration ||
                !minimumBidIncrement ||
                !openingBid) &&
                'opacity-60',
              (!isCorrectDuration ||
                !isCorrectMinimumBidIncrement ||
                !isCorrectOpeningBid ||
                !isDurationInScope ||
                !isOpeningBidInScope ||
                !isMinimumBidIncrementInScope ||
                !duration ||
                !minimumBidIncrement ||
                !openingBid) &&
                'pointer-events-none',
              'text-white',
              'text-xs',
              'font-medium',
              'bg-[#66BB6A]',
              'rounded-lg',
              'block',
              'hover:bg-white',
              'hover:text-[#66BB6A]',
              'transition',
              'ease-in',
              'mx-auto',
            ])}
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
