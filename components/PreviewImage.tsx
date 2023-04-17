import clsx from 'clsx';
import Image from 'next/image';

interface PreviewImageProps {
  isLoading: boolean;
  error: Error | unknown;
  isJsonLoading: boolean;
  jsonLoadingError: Error | unknown;
  jsonData: any;
  image: { id: string; extension: string };
}

const PreviewImage = ({
  isLoading,
  isJsonLoading,
  error,
  jsonLoadingError,
  image,
  jsonData,
}: PreviewImageProps) => {
  if (isLoading || isJsonLoading) {
    return (
      <div
        className={clsx([
          'animate-spin',
          'w-1/2',
          'h-1/2',
          'rounded-full',
          'border-b-2',
          'border-[#8c4ace]',
        ])}
      ></div>
    );
  }

  if (error || jsonLoadingError) {
    return <p>error</p>;
  }

  if (image.id && image.extension) {
    return <Image src={jsonData.image} layout="fill" />;
  }

  return (
    <div
      className={clsx([
        'flex',
        'flex-col',
        'text-center',
        'items-center',
        'w-[63.744%]',
        'whitespace-nowrap',
      ])}
    >
      <svg
        width="64"
        height="64"
        className={clsx(['mb-3'])}
        viewBox="0 0 64 64"
        fill="none"
      >
        <g opacity="0.8">
          <path
            d="M6.88 50.6933L6.82667 50.7467C6.10667 49.1733 5.65333 47.3867 5.46667 45.4133C5.65333 47.36 6.16 49.12 6.88 50.6933Z"
            fill="white"
          />
          <path
            d="M24 27.68C27.5052 27.68 30.3467 24.8385 30.3467 21.3333C30.3467 17.8282 27.5052 14.9867 24 14.9867C20.4948 14.9867 17.6533 17.8282 17.6533 21.3333C17.6533 24.8385 20.4948 27.68 24 27.68Z"
            fill="white"
          />
          <path
            d="M43.1733 5.33333H20.8267C11.12 5.33333 5.33333 11.12 5.33333 20.8267V43.1733C5.33333 46.08 5.84 48.6133 6.82667 50.7467C9.12 55.8133 14.0267 58.6667 20.8267 58.6667H43.1733C52.88 58.6667 58.6667 52.88 58.6667 43.1733V37.0667V20.8267C58.6667 11.12 52.88 5.33333 43.1733 5.33333ZM54.32 33.3333C52.24 31.5467 48.88 31.5467 46.8 33.3333L35.7067 42.8533C33.6267 44.64 30.2667 44.64 28.1867 42.8533L27.28 42.1067C25.3867 40.4533 22.3733 40.2933 20.24 41.7333L10.2667 48.4267C9.68 46.9333 9.33333 45.2 9.33333 43.1733V20.8267C9.33333 13.3067 13.3067 9.33333 20.8267 9.33333H43.1733C50.6933 9.33333 54.6667 13.3067 54.6667 20.8267V33.6267L54.32 33.3333Z"
            fill="white"
          />
        </g>
      </svg>
      <p className={clsx(['text-2xl', 'mb-2'])}>Your image will be here</p>
      <p className={clsx(['text-sm', 'text-opacity-60', 'text-white'])}>
        Click generate to fulfill this space!
      </p>
    </div>
  );
};

export default PreviewImage;
