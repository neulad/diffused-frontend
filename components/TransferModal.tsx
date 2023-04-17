import clsx from 'clsx';
import getConfig from 'next/config';
import Image from 'next/image';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNetwork } from 'wagmi';
import styles from '../styles/Token.module.scss';
import EOAMessage from './EOAMessage';

interface TransferModalProps {
  tokenId: string;
  toastId: MutableRefObject<number>;
  tokenData: { image: string; name: string; description: string };
  setIsTransferModalActive: (arg0: boolean) => void;
  address: `0x${string}` | undefined;
  setIsTokenBusy: (arg0: boolean) => void;
  writeTransfer:
    | ((
        overrideConfig?:
          | {
              recklesslySetUnpreparedArgs?: unknown[] | undefined;
              recklesslySetUnpreparedOverrides?: any;
            }
          | undefined
      ) => void)
    | undefined;
}

const TransferModal = ({
  tokenId,
  toastId,
  setIsTokenBusy,
  tokenData,
  address,
  setIsTransferModalActive,
  writeTransfer,
}: TransferModalProps) => {
  const { publicRuntimeConfig } = getConfig();
  const { chain } = useNetwork();

  const transferRef = useRef<HTMLDivElement>(null);

  const [tokenReceiver, setTokenReceiver] = useState('');
  const [isCorrectEOA, setIsCorrectEOA] = useState(false);

  useEffect(() => {
    const closeWindow = (e: KeyboardEvent) => {
      if (['27', 'Escape'].includes(String(e.key)))
        setIsTransferModalActive(false);
    };

    window.addEventListener('keydown', closeWindow);

    return () => {
      window.removeEventListener('keydown', closeWindow);
    };
  }, []);

  useEffect(() => {
    const removeModal = (e: MouseEvent) => {
      if (!transferRef.current?.contains(e.target as HTMLElement)) {
        setIsTransferModalActive(false);
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
          'items-stretch',
        ])}
        ref={transferRef}
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
            setIsTransferModalActive(false);
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
              Want to transfer the token?
            </p>
            <p className={clsx(['text-sm', 'opacity-40'])}>
              You won't possess it anymore. It will be shown to someone else's
              page just as it's shown on yours currently.
            </p>
          </div>
        </div>

        <div className={clsx(['bg-[#1a1a1a]', 'rounded-2xl', 'py-4', 'px-5'])}>
          <p className={clsx(['text-2xl', 'font-medium', 'mb-2'])}>Details</p>
          <hr className={clsx(['bg-white', 'opacity-10', 'mb-5'])} />
          <label
            htmlFor="receiver"
            className={clsx([
              'block',
              'mb-2',
              'text-sm',
              'pointer-events-none',
              'font-medium',
              'text-white',
            ])}
          >
            Receiver address
          </label>
          <div className={clsx(['relative', 'mb-2'])}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                viewBox="0 0 24 24"
                className="text-[#9ca3af]"
                width="20"
                height="20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              onClick={() => {
                setTokenReceiver('');
              }}
              className="absolute hover:cursor-pointer inset-y-0 right-0 flex items-center pr-3"
            >
              {/* Cross */}
              <svg
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="10.93 10.93 12.15 12.15"
              >
                <path
                  d="M12.7573 21.2427L21.2426 12.7574"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.2426 21.2426L12.7573 12.7573"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="text"
              id="receiver"
              className={clsx([
                'bg-[#242424]',
                'text-white',
                'border',
                'border-[#4b5563]',
                isCorrectEOA && tokenReceiver && 'focus:border-[#66BB6A]',
                !isCorrectEOA && tokenReceiver && 'focus:border-orange-800',
                !tokenReceiver && 'focus:border-[#5F5AFA]',
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
              value={tokenReceiver}
              onChange={(e) => {
                setTokenReceiver(e.target.value);

                setIsCorrectEOA(false);
                if (/^0x([A-Fa-f0-9]{40})$/.exec(e.target.value) !== null)
                  setIsCorrectEOA(true);
              }}
              placeholder="0x037907355E6..."
            />
          </div>

          <EOAMessage
            isCorrectEOA={isCorrectEOA}
            tokenReceiver={tokenReceiver}
          />

          <button
            disabled={!isCorrectEOA}
            className={clsx([
              'py-2',
              'px-6',
              !isCorrectEOA && 'pointer-events-none',
              !isCorrectEOA && 'opacity-60',
              'text-white',
              'text-xs',
              'font-medium',
              'bg-[#42A5F5]',
              'rounded-lg',
              'block',
              'hover:bg-white',
              'hover:text-[#42A5F5]',
              'transition',
              'ease-in',
              'mx-auto',
            ])}
            onClick={() => {
              setIsTransferModalActive(false);
              setIsTokenBusy(true);
              toastId.current = toast.loading('Transferring 👉', {
                theme: 'dark',
                closeOnClick: true,
                draggable: true,
              }) as number;
              writeTransfer?.({
                recklesslySetUnpreparedArgs: [address, tokenReceiver, tokenId],
              });
            }}
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
