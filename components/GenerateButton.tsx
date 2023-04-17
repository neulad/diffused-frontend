import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

interface GenerateNftProps {
  data: any;
  image: { id: string; extension: string };
  setImage: any;
  authenticatedAddress: string;
  formik: any;
  removeImage: any;
}

const GenerateButton = ({
  image,
  setImage,
  formik,
  removeImage,
}: GenerateNftProps) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { status } = useSession();

  const [isRendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(true);
  }, []);

  const discardGeneration = async (e: any) => {
    e.preventDefault();

    formik.setValues({
      prompt: '',
      num_inference_steps: 50,
      guidance_scale: 7.5,
    });

    if (!image.id || !image.extension) return;

    setImage({ id: '', extension: '' });

    removeImage.mutate({
      id: image.id,
      extension: image.extension,
    });

    localStorage.setItem(
      publicRuntimeConfig.localStorageGenerationTitle,
      JSON.stringify({ id: '', extension: '' })
    );
  };

  const { publicRuntimeConfig } = getConfig();

  if (isRendered && !isConnected) {
    return <p className="hidden sm:block">Please connect to the Wallet!</p>;
  }

  if (
    isRendered &&
    !publicRuntimeConfig.networksToAddresses[chain?.id || 0]?.DiffusedNfts
  ) {
    return <p>Please connect to the appropriate chain!</p>;
  }

  if (isRendered && (!status || status == 'unauthenticated')) {
    return (
      <p>
        Please click connect button to make requests, you have to authenticate!
      </p>
    );
  }

  if (isRendered && image.id && image.extension) {
    return (
      <div className={clsx(['flex', 'gap-3'])}>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className={clsx([
            'text-white',
            'font-medium',
            'bg-[#8c4ace]',
            formik.isSubmitting && 'hover:cursor-default',
            !formik.isSubmitting && 'hover:bg-[#e9e9e9]',
            !formik.isSubmitting && 'hover:text-[#8c4ace]',
            !formik.isSubmitting && 'active:text-white',
            !formik.isSubmitting && 'active:bg-[#8c4ace]',
            'transition',
            'ease-in',
            'rounded-lg',
            'text-sm',
            'px-5',
            'py-2.5',
            'text-center',
          ])}
        >
          Generate Again
        </button>

        <button
          disabled={formik.isSubmitting}
          type="button"
          className={clsx([
            'text-white',
            'font-medium',
            'bg-[#18151b]',
            formik.isSubmitting && 'hover:cursor-default',
            !formik.isSubmitting && 'hover:bg-[#e9e9e9]',
            !formik.isSubmitting && 'hover:text-[#18151b]',
            !formik.isSubmitting && 'active:bg-[#18151b]',
            !formik.isSubmitting && 'active:text-white',
            'border',
            'transition',
            'ease-in',
            'rounded-lg',
            'text-sm',
            'px-5',
            'py-2.5',
            'text-center',
          ])}
          onClick={discardGeneration}
        >
          Discard
        </button>
      </div>
    );
  }

  return (
    <div className={clsx(['flex', 'gap-3'])}>
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className={clsx([
          'text-white',
          'font-medium',
          'bg-[#5F5AFA]',
          formik.isSubmitting && 'hover:cursor-default',
          !formik.isSubmitting && 'hover:bg-[#e9e9e9]',
          !formik.isSubmitting && 'hover:text-[#8c4ace]',
          !formik.isSubmitting && 'active:text-white',
          !formik.isSubmitting && 'active:bg-[#8c4ace]',
          'transition',
          'ease-in',
          'rounded-lg',
          'text-sm',
          'px-5',
          'py-2.5',
          'text-center',
        ])}
      >
        Generate
      </button>

      <button
        disabled={formik.isSubmitting}
        type="button"
        className={clsx([
          'text-white',
          'font-medium',
          formik.isSubmitting && 'hover:cursor-default',
          'bg-[#18151b]',
          !formik.isSubmitting && 'hover:bg-[#e9e9e9]',
          !formik.isSubmitting && 'hover:text-[#18151b]',
          !formik.isSubmitting && 'active:bg-[#18151b]',
          !formik.isSubmitting && 'active:text-white',
          'border',
          'transition',
          'ease-in',
          'rounded-lg',
          'text-sm',
          'px-5',
          'py-2.5',
          'text-center',
        ])}
        onClick={discardGeneration}
      >
        Discard
      </button>
    </div>
  );
};

export default GenerateButton;
