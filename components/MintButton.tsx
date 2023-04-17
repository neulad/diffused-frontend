import axios, { AxiosResponse } from 'axios';
import clsx from 'clsx';
import { useMutation, UseMutationResult } from 'react-query';
import { toast } from 'react-toastify';
import { useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi';
import getConfig from 'next/config';
import { useRef, useState } from 'react';

interface MintButtonProps {
  chainId: number;
  image: { id: string; extension: string };
  setImage: any;
}

const MintButton = ({ chainId, setImage, image }: MintButtonProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const { publicRuntimeConfig } = getConfig();
  const { chain } = useNetwork();
  const toastId = useRef(0);

  const deployNft = useMutation<AxiosResponse<any, any>, unknown, any, unknown>(
    (data: { chainId: number; extension: string }) => {
      return axios.post(`/api/nfts/${image.id}/mint`, {
        chainId: data.chainId,
        extension: data.extension,
      });
    }
  );

  const {
    isLoading: isMintingLoading,
    write,
    data,
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: publicRuntimeConfig.networksToAddresses[chainId]?.DiffusedNfts,
    abi: publicRuntimeConfig.networksToAddresses[chainId]?.DiffusedNftsAbi,
    onError() {
      toast.update(toastId.current, {
        render: 'Error! Transaction declined! ⛔',
        isLoading: false,
        type: 'error',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    },
    functionName: 'mintDiffusedNft',
  });

  const { isLoading: isLoadingMint } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      toast.update(toastId.current, {
        render: 'Minted! 😀',
        isLoading: false,
        type: 'success',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });

      setImage({ id: '', extension: '' });
      localStorage.setItem(
        'generation.current',
        JSON.stringify({ id: '', extension: '' })
      );
    },

    onError(err) {
      toast.update(toastId.current, {
        render: err.message,
        type: 'error',
        autoClose: 5000,
        isLoading: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    },
  });

  const handleMint = async () => {
    setIsDeploying(true);
    const deployNftPromise = deployNft.mutateAsync({
      chainId: chain?.id,
      extension: image.extension,
    });

    const data = await toast.promise(
      deployNftPromise,
      {
        pending: 'Deploying your image to IPFS 🐎',
        success: 'Deployed, now minting!',
        error: 'Error, not your day :(',
      },
      {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      }
    );

    write?.({
      recklesslySetUnpreparedArgs: [
        data.data.msg.image,
        data.data.msg.messageLength,
        data.data.msg.sig,
      ],
    });

    toastId.current = toast.loading('Minting 🦙', {
      theme: 'dark',
    }) as number;

    setIsDeploying(false);
  };

  return (
    <button
      type="button"
      disabled={
        isDeploying ||
        isLoadingMint ||
        isMintingLoading ||
        deployNft.isLoading ||
        !chain?.id
      }
      onClick={handleMint}
      className={clsx([
        'text-black',
        'rounded-lg',
        'text-sm',
        'bg-[#7ab93b]',
        'py-2',
        'text-center',
        !isDeploying &&
          !isLoadingMint &&
          !isMintingLoading &&
          !deployNft.isLoading &&
          'hover:bg-[#e9e9e9]',

        !isDeploying &&
          !isLoadingMint &&
          !isMintingLoading &&
          !deployNft.isLoading &&
          'active:text-black',

        !isDeploying &&
          !isLoadingMint &&
          !isMintingLoading &&
          !deployNft.isLoading &&
          'active:bg-[#7ab93b]',
        'transition',
        'ease-in',
      ])}
    >
      Mint
    </button>
  );
};

export default MintButton;
